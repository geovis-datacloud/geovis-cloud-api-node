"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloud_api_sign_1 = require("../cloud-api-sign");
const geoSign = new cloud_api_sign_1.PaymentSign("sCx7-dtUrZQIQY5Zvkkn3TVALrU", "9Q1LxWRiRnmO0cb/k25ZndKP7q76bAxt6vIY40Q/OHI7GiSbTJkgZCLL4+kLGK8yRjpj13g12f5/Y7zdunxuKg==", 'QV5MGMKCM7MBAE1WZKFHKQTK');
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
        fetch(`${params.base}${path}`, {
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
        curlcmd += ` ${params.base}${path}`;
        console.log(`****************************************************curl print`);
        console.log(curlcmd);
    }
    // console.log(`****************************************************curl print`);
}
function pringGet() {
    const params = {
        base: 'https://api1.geovisearth.com/pay',
        path: '/v2/access/orderDetail',
        header: {
            'Content-Type': 'application/json'
        },
        method: 'GET',
        time: new Date(),
        // body: {
        //     orderNo:  [1, 2, 3].map(() => Math.trunc(Math.random() * 1000000000)).join(''),
        //     // productName: "测试验签工具",
        //     // total: 10000,
        //     payMode: 'wxpay',
        //     // payChannel: 'TRANSFER',
        //     // callbackUrl: 'http://www.baidu.com?ad=12',
        //     // returnUrl: 'http://www.baidu.com?ad=12',
        //     // userId: '111111111111111111111111111111',
        // },
        queryString: {
            orderNo: 'JjE8tKL7F3EhffrKd0p7dgfQItoeqx0n', // [1, 2, 3].map(() => Math.trunc(Math.random() * 1000000000)).join(''),
            payMode: 'wxpay',
        }
    };
    createSignPrint(params, true);
}
pringGet();
