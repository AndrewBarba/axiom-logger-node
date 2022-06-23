import { HttpClient } from './http-client'

export class AxiomClient {
  private _apiKey: string
  private _client: HttpClient

  get apiKey() {
    return this._apiKey
  }

  get client() {
    return this._client
  }

  constructor(props: { apiKey: string }) {
    this._apiKey = props.apiKey
    this._client = new HttpClient({
      basePath: 'https://cloud.axiom.co/api',
      headers: {
        Authorization: `Bearer ${props.apiKey}`
      }
    })
  }

  ingest(dataset: string, payload: any) {
    return this.client.post(`v1/datasets/${dataset}/ingest`, {
      jsonBody: payload
    })
  }
}
