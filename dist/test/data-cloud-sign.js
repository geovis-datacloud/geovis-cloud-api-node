"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloud_api_sign_1 = require("../cloud-api-sign");
const geoSign = new cloud_api_sign_1.DataCloudSign("your secretId", "your secretKey");
function createSignPrint(params) {
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
    final.path = params.path;
    const header = geoSign.sign(final);
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
    // console.log(`****************************************************curl print`);
}
function pringGet() {
    createSignPrint({
        base: 'https://datacloud.geovisearth.com',
        path: `/v1/cloudapi/application/myPublicAppList`,
        header: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'GET',
        time: new Date(),
        queryString: {
            channel: 'your channel',
            phone: 'which user you want to search',
        }
    });
}
pringGet();
