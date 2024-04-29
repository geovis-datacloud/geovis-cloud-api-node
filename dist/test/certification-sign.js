"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloud_api_sign_1 = require("../cloud-api-sign");
const geoSign = new cloud_api_sign_1.CertificationSign('KWaLTdzNnKfsDgIVrAczCoDqU08', 'HD9AT2U/hN+ra5iSPcccMXmq59EcRuRTrNM/Dk2Zp4m37YGwANYICfVPMcTVJzaDgeAfLN5ooUq/K6vIA92OpA==');
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
        base: 'http://127.0.0.1:3096',
        path: `/v1/cloudapi/certification/city`,
        header: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'GET',
        time: new Date(),
        // body: {
        //     channel: 'db2d7faa-63cb-4a7e-833b-8b9d83a91dec',
        //     appId: 'fFJtM1EV9VacL-o_',
        // },
        // queryString: {
        //     channel: '11560f93-1cab-482c-bff1-fece3ff14aed',
        //     phone: '13008150017',
        // }
    });
}
pringGet();
