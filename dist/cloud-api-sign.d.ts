/// <reference types="node" />
/// <reference types="node" />
import * as crypto from 'crypto';
type SignInputParameters = {
    time: Date;
    header?: {
        [k: string]: string | number;
    };
    path: string;
    queryString?: string;
} & ({
    method: 'GET';
} | {
    method: "POST" | 'PUT' | 'PATCH';
    body: string;
});
type SignResult = {
    authorization: string;
} & SignInputParameters['header'];
export declare class CloudApiSign {
    readonly secretId: string;
    readonly serviceName: string;
    readonly defaultSignParams: {
        body: string;
        queryString: string;
    };
    readonly options: {
        extendKeys?: string[][];
    };
    readonly secretKey: Buffer;
    constructor(secretId: string, secretKey: string, serviceName: string, options?: CloudApiSign['options']);
    sign(params: SignInputParameters): SignResult;
    createSign(data: string, encoding?: crypto.BinaryToTextEncoding): string | Buffer;
}
export declare class DataCloudSign extends CloudApiSign {
    readonly secretId: string;
    constructor(secretId: string, secretKey: string);
}
export declare class CertificationSign extends CloudApiSign {
    readonly secretId: string;
    constructor(secretId: string, secretKey: string);
}
export declare class PaymentSign extends CloudApiSign {
    readonly secretId: string;
    readonly mchid: string;
    constructor(secretId: string, secretKey: string, mchid: string);
    parseCallback(data: {
        jsonData: string;
        notifyTime: string;
        sign: string;
        status: string;
    }): any;
}
export {};
