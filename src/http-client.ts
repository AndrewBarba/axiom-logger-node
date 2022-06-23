import { request, Dispatcher } from 'undici'
import { IncomingHttpHeaders } from 'http'
import { Readable } from 'stream'
import { merge } from './merge'
import * as querystring from 'querystring'

export class HttpClient {
  private _options: HttpRequestOptions

  constructor(options?: HttpRequestOptions) {
    this._options = options ?? {}
  }

  get(path: string, options?: HttpRequestOptions) {
    return this.request(path, { ...options, method: 'GET' })
  }

  post(path: string, options?: HttpRequestOptions) {
    return this.request(path, { ...options, method: 'POST' })
  }

  put(path: string, options?: HttpRequestOptions) {
    return this.request(path, { ...options, method: 'PUT' })
  }

  patch(path: string, options?: HttpRequestOptions) {
    return this.request(path, { ...options, method: 'PATCH' })
  }

  delete(path: string, options?: HttpRequestOptions) {
    return this.request(path, { ...options, method: 'DELETE' })
  }

  options(path: string, options?: HttpRequestOptions) {
    return this.request(path, { ...options, method: 'OPTIONS' })
  }

  head(path: string, options?: HttpRequestOptions) {
    return this.request(path, { ...options, method: 'HEAD' })
  }

  async request(path: string, _options?: HttpRequestOptions) {
    // Build combined optiond
    const options = merge({}, this._options, _options)

    // Construct url
    const url = new URL(options.basePath ? `${options.basePath}/${path}` : path)

    // Apply url search params
    for (const [key, value] of Object.entries(options.searchParams ?? {})) {
      if (typeof value !== 'string') continue
      url.searchParams.set(key, value)
    }

    // Build http method
    const method = options.method ?? 'GET'

    // Build http headers
    const headers = { ...options.headers }

    // Set content type based on json body
    if (options.jsonBody) headers['content-type'] = 'application/json'

    // Set content type based on form body
    if (options.formBody) headers['content-type'] = 'application/x-www-form-urlencoded'

    // Set authorization header based on username/password
    if (options.username && options.password) {
      const token = Buffer.from(`${options.username}:${options.password}`).toString('base64')
      headers.authorization = `Basic ${token}`
    }

    // Build http body
    const body = options.jsonBody
      ? JSON.stringify(options.jsonBody)
      : options.formBody
      ? querystring.stringify(options.formBody)
      : options.body

    const res = await request(url, {
      method,
      headers,
      body,
      headersTimeout: options.firstByteTimeout ?? options.requestTimeout,
      bodyTimeout: options.requestTimeout,
      idempotent: options.idempotent,
      maxRedirections: options.maxRedirections
    })

    if (res.statusCode >= 400) {
      throw new HttpRequestError(url, options, res, await res.body.text())
    }

    return res
  }
}

export const httpClient = new HttpClient()

export interface HttpRequestOptions {
  basePath?: string
  method?: Dispatcher.HttpMethod
  headers?: Record<string, string>
  jsonBody?: Record<string, any>
  formBody?: Record<string, string | number | boolean | null | undefined>
  body?: Buffer | Readable | string
  searchParams?: Record<string, string | null | undefined>
  firstByteTimeout?: number
  requestTimeout?: number
  username?: string
  password?: string
  maxRedirections?: number
  idempotent?: boolean
}

export class HttpRequestError extends Error {
  readonly statusCode: number
  readonly headers: IncomingHttpHeaders
  readonly body: string
  readonly request: HttpRequestOptions
  readonly response: Dispatcher.ResponseData

  constructor(
    url: URL,
    request: HttpRequestOptions,
    response: Dispatcher.ResponseData,
    body: string
  ) {
    super(`${request.method} ${url.href} - ${response.statusCode} ${body}`)
    this.statusCode = response.statusCode
    this.headers = response.headers
    this.body = body
    this.request = request
    this.response = response
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      headers: this.headers,
      body: this.body,
      stack: this.stack
    }
  }
}
