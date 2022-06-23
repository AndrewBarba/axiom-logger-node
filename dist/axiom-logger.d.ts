import { AxiomClient } from './axiom-client';
export declare type AxiomLogEvent = Record<string, any>;
export declare type AxiomClientBaseProps = {
    apiKey: string;
} | {
    client: AxiomClient;
};
export declare type AxiomClientProps = AxiomClientBaseProps & {
    dataset: string;
    defaultProperties?: AxiomLogEvent;
};
export declare class AxiomLogger {
    private _client;
    private _dataset;
    private _defaultProperties?;
    private _q;
    get client(): AxiomClient;
    get dataset(): string;
    get defaultProperties(): AxiomLogEvent | undefined;
    set defaultProperties(newValue: AxiomLogEvent | undefined);
    constructor(props: AxiomClientProps);
    write(event: AxiomLogEvent | AxiomLogEvent[]): void;
    drain(): Promise<void>;
    private _write;
}
