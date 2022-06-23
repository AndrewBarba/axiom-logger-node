/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { Dispatcher } from 'undici';
import { IncomingHttpHeaders } from 'http';
import { Readable } from 'stream';
export declare class HttpClient {
    private _options;
    constructor(options?: HttpRequestOptions);
    get(path: string, options?: HttpRequestOptions): Promise<Dispatcher.ResponseData>;
    post(path: string, options?: HttpRequestOptions): Promise<Dispatcher.ResponseData>;
    put(path: string, options?: HttpRequestOptions): Promise<Dispatcher.ResponseData>;
    patch(path: string, options?: HttpRequestOptions): Promise<Dispatcher.ResponseData>;
    delete(path: string, options?: HttpRequestOptions): Promise<Dispatcher.ResponseData>;
    options(path: string, options?: HttpRequestOptions): Promise<Dispatcher.ResponseData>;
    head(path: string, options?: HttpRequestOptions): Promise<Dispatcher.ResponseData>;
    request(path: string, _options?: HttpRequestOptions): Promise<Dispatcher.ResponseData>;
}
export declare const httpClient: HttpClient;
export interface HttpRequestOptions {
    basePath?: string;
    method?: Dispatcher.HttpMethod;
    headers?: Record<string, string>;
    jsonBody?: Record<string, any>;
    formBody?: Record<string, string | number | boolean | null | undefined>;
    body?: Buffer | Readable | string;
    searchParams?: Record<string, string | null | undefined>;
    firstByteTimeout?: number;
    requestTimeout?: number;
    username?: string;
    password?: string;
    maxRedirections?: number;
    idempotent?: boolean;
}
export declare class HttpRequestError extends Error {
    readonly statusCode: number;
    readonly headers: IncomingHttpHeaders;
    readonly body: string;
    readonly request: HttpRequestOptions;
    readonly response: Dispatcher.ResponseData;
    constructor(url: URL, request: HttpRequestOptions, response: Dispatcher.ResponseData, body: string);
    toJSON(): {
        statusCode: number;
        headers: IncomingHttpHeaders;
        body: string;
        stack: string | undefined;
    };
}
