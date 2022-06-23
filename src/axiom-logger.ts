import { AxiomClient } from './axiom-client'
import type { queueAsPromised } from 'fastq'
import * as fastq from 'fastq'

export type AxiomLogEvent = Record<string, any>

export type AxiomClientBaseProps = { apiKey: string } | { client: AxiomClient }

export type AxiomClientProps = AxiomClientBaseProps & { dataset: string; defaultProperties?: AxiomLogEvent }

export class AxiomLogger {
  private _client: AxiomClient
  private _dataset: string
  private _defaultProperties?: AxiomLogEvent
  private _q: queueAsPromised<AxiomLogEvent[]>

  get client() {
    return this._client
  }

  get dataset() {
    return this._dataset
  }

  get defaultProperties() {
    return this._defaultProperties
  }

  set defaultProperties(newValue) {
    this._defaultProperties = newValue
  }

  constructor(props: AxiomClientProps) {
    this._client = 'client' in props ? props.client : new AxiomClient({ apiKey: props.apiKey })
    this._dataset = props.dataset
    this._defaultProperties = props.defaultProperties
    this._q = fastq.promise((task) => this._write(task), 1)
  }

  write(event: AxiomLogEvent | AxiomLogEvent[]) {
    const events: AxiomLogEvent[] = Array.isArray(event) ? event : [event]
    this._q.push(
      events.map((log) => ({
        ...this._defaultProperties,
        ...log,
        _time: Date.now()
      }))
    )
  }

  async drain() {
    if (this._q.idle()) {
      return
    }
    return this._q.drained()
  }

  private async _write(events: AxiomLogEvent[]) {
    await this._client.ingest(this._dataset, events)
  }
}

function toString(input: any[], sep = ' '): string {
  return input.map((item) => (typeof item === 'object' ? JSON.stringify(item) : item)).join(sep)
}
