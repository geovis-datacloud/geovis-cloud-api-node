"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloud_api_sign_1 = require("../cloud-api-sign");
const geoSign = new cloud_api_sign_1.PaymentSign('secretId', 'oL9Ebg3ofo9pyaB42KMokWzc0SMQQeLjFkVF33U6N1M=', 'mchid');
function createSignPrint(params, send = false) {
    const final = {
        ...params,
        queryString: '',
        body: '',
    };
    let path = params.path;
    if (params.queryString) {
        const urlsp = new URLSearchParams(params.queryString);
        final.queryString = urlsp.toString();
        path += `?${final.queryString}`;
    }
    if (final.method !== 'GET' && params.body) {
        final.body = JSON.stringify(params.body);
    }
    // const url = new URL(path, params.base)
    final.path = params.path;
    const header = geoSign.sign(final);
    if (send) {
        fetch(`${params.base}${params.path}`, {
            method: final.method,
            headers: header,
            body: final.method !== 'GET' ? final.body : undefined,
        })
            .then(res => res.text())
            .then(body => {
            console.log(`****************************************************response print`);
            console.log(body);
        });
    }
    else {
        console.log(`****************************************************json header print`);
        console.log(JSON.stringify(header, null, 2));
        // console.log(`****************************************************json header print`);
        const str = Object.entries(header).map(([k, v]) => `${k}: ${v}`).join('\n');
        console.log(`****************************************************test header print`);
        console.log(`method: ${final.method}`);
        console.log(str);
        // console.log(`****************************************************test header print`);
        let curlcmd = `curl -X ${final.method} `;
        Object.entries(header).forEach(([k, v]) => {
            curlcmd += ` -H "${k}: ${v}" `;
        });
        final.method !== 'GET' && (curlcmd += ` -d '${final.body ?? ''}'`);
        curlcmd += ` ${params.base}${params.path}`;
        console.log(`****************************************************curl print`);
        console.log(curlcmd);
    }
    // console.log(`****************************************************curl print`);
}
function pringGet() {
    const params = {
        base: 'http://127.0.0.1:3001',
        path: '/v1/access/prepay',
        header: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        time: new Date(),
        body: {
            orderNo: [1, 2, 3].map(() => Math.trunc(Math.random() * 1000000000)).join(''),
            productName: "测试验签工具",
            total: 10000,
            payMode: 'wxpay',
            payChannel: 'NATIVE',
            callbackUrl: 'http://www.baidu.com?ad=12'
        }
        // queryString: {
        //     a: 1,
        //     b: 2,
        //     c: 3,
        // }
    };
    createSignPrint(params);
}
pringGet();
