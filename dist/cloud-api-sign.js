"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSign = exports.CertificationSign = exports.DataCloudSign = exports.CloudApiSign = void 0;
// const  = require('crypto');
const crypto = __importStar(require("crypto"));
const nanoid_1 = require("nanoid");
class CloudApiSign {
    secretId;
    serviceName;
    defaultSignParams = {
        body: '',
        queryString: ''
    };
    options = {};
    secretKey;
    constructor(secretId, secretKey, serviceName, options) {
        this.secretId = secretId;
        this.serviceName = serviceName;
        this.secretKey = Buffer.from(secretKey, 'base64');
        // console.log(this.secretKey)
        if (options) {
            this.options.extendKeys = options.extendKeys;
        }
    }
    sign(params) {
        const final = Object.assign({
            nonceStr: (0, nanoid_1.nanoid)()
        }, this.defaultSignParams, params);
        console.log('final sign params', final);
        const timestamp = final.time.getTime();
        // ************* 步骤 1：拼接规范请求串 *************
        const canonicalRequest = `${this.serviceName}\n${final.method}\n${final.path}\n${final.queryString}\n${final.body}\n${final.nonceStr}\n${timestamp}`;
        // ************* 步骤 3：计算签名 *************
        const signature = this.createSign(canonicalRequest, 'hex');
        // ************* 步骤 4：拼接 Authorization *************
        let authorization = `secretId=${this.secretId},nonceStr=${final.nonceStr},service=${this.serviceName},timestamp=${timestamp},signature=${signature}`;
        // console.log('authorization', authorization)
        if (this.options.extendKeys && this.options.extendKeys.length) {
            authorization = `${authorization},${this.options.extendKeys.map(p => `${p[0]}=${p[1]}`).join(',')}`;
        }
        // 返回新的httpHeader
        return {
            ...final.header,
            authorization,
        };
    }
    createSign(data, encoding) {
        const hmac = crypto.createHmac('sha256', this.secretKey);
        return encoding ? hmac.update(data).digest(encoding) : hmac.update(data).digest();
    }
}
exports.CloudApiSign = CloudApiSign;
class DataCloudSign extends CloudApiSign {
    secretId;
    constructor(secretId, secretKey) {
        super(secretId, secretKey, 'geovis-data-cloud');
        this.secretId = secretId;
    }
}
exports.DataCloudSign = DataCloudSign;
class CertificationSign extends CloudApiSign {
    secretId;
    constructor(secretId, secretKey) {
        super(secretId, secretKey, 'geovis-certification');
        this.secretId = secretId;
    }
}
exports.CertificationSign = CertificationSign;
class PaymentSign extends CloudApiSign {
    secretId;
    mchid;
    constructor(secretId, secretKey, mchid) {
        super(secretId, secretKey, 'geovis-payment-center', {
            extendKeys: [['mchid', mchid]]
        });
        this.secretId = secretId;
        this.mchid = mchid;
    }
    parseCallback(data) {
        const sign = this.createSign(`${data.jsonData}\n${data.notifyTime}`, 'hex');
        if (data.sign !== sign) {
            throw new Error('invalid signature');
        }
        return JSON.parse(data.jsonData);
    }
}
exports.PaymentSign = PaymentSign;
