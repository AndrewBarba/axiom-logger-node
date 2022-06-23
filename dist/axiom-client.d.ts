import { HttpClient } from './http-client';
export declare class AxiomClient {
    private _apiKey;
    private _client;
    get apiKey(): string;
    get client(): HttpClient;
    constructor(props: {
        apiKey: string;
    });
    ingest(dataset: string, payload: any): Promise<import("undici/types/dispatcher").ResponseData>;
}
