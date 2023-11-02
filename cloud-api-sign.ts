// const  = require('crypto');
import * as crypto from 'crypto'
import { nanoid } from "nanoid";

type SignInputParameters = {
    time: Date
    header?: {
        [k: string]: string | number
    }
    path: string
    queryString?: string
} & ({
    method: 'GET'
} | {
    method: "POST" | 'PUT' | 'PATCH';
    body: string
})

type SignParameters = SignInputParameters & {
    body: string
    nonceStr: string
}

type SignResult = {
    authorization: string;
} & SignInputParameters['header']


export class CloudApiSign {
    readonly defaultSignParams = {
        body: '',
        queryString: ''
    }
    public readonly options: {
        extendKeys?: string[][]
    } = {}
    public readonly secretKey: Buffer

    constructor(
        public readonly secretId: string,
        secretKey: string,
        public readonly serviceName: string,
        options?: CloudApiSign['options']
    ) {
        this.secretKey = Buffer.from(secretKey, 'base64')
        // console.log(this.secretKey)
        if (options) {
            this.options.extendKeys = options.extendKeys
        }
    }

    sign(params: SignInputParameters): SignResult {
        const final: SignParameters = Object.assign({
            nonceStr: nanoid()
        }, this.defaultSignParams, params)
        // console.log('final sign params', final)
        const timestamp = final.time.getTime()
        // ************* 步骤 1：拼接规范请求串 *************
        const canonicalRequest = `${this.serviceName}\n${final.method}\n${final.path}\n${final.queryString}\n${final.body}\n${final.nonceStr}\n${timestamp}`
        // ************* 步骤 3：计算签名 *************
        const signature = this.createSign(canonicalRequest, 'hex')
        // ************* 步骤 4：拼接 Authorization *************
        let authorization = `secretId=${this.secretId},nonceStr=${final.nonceStr},service=${this.serviceName},timestamp=${timestamp},signature=${signature}`
        // console.log('authorization', authorization)
        if (this.options.extendKeys && this.options.extendKeys.length) {
            authorization = `${authorization},${this.options.extendKeys.map(p => `${p[0]}=${p[1]}`).join(',')}`
        }
        // 返回新的httpHeader
        return {
            ...final.header,
            authorization,
        }
    }

    createSign(data: string, encoding?: crypto.BinaryToTextEncoding) {
        const hmac = crypto.createHmac('sha256', this.secretKey)

        return encoding ? hmac.update(data).digest(encoding) : hmac.update(data).digest()
    }
}

export class DataCloudSign extends CloudApiSign {
    constructor(
        public readonly secretId: string,
        secretKey: string,
    ) {
        super(secretId, secretKey, 'geovis-data-cloud')
    }
}

export class PaymentSign extends CloudApiSign {
    constructor(
        public readonly secretId: string,
        secretKey: string,
        public readonly mchid: string,
    ) {
        super(secretId, secretKey, 'geovis-payment-center', {
            extendKeys: [['mchid', mchid]]
        })

    }

    parseCallback(data: {
        jsonData: string;
        notifyTime: string;
        sign: string;
        status: string,
    }) {
        const sign = this.createSign(`${data.jsonData}\n${data.notifyTime}`, 'hex')
        if (data.sign !== sign) {
            throw new Error('invalid signature')
        }
        return JSON.parse(data.jsonData)
    }
}