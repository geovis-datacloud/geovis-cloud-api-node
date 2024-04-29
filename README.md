### 使用方法
1 安装
```bash
npm install --save git+ssh://git@github.com:geovis-datacloud/geovis-cloud-api-node.git
```

2 DataCloudSign使用
```javascript
const { DataCloudSign } = require('geovis-cloud-api-node')

const geoSign = new DataCloudSign(
    "your secretId",
    "your secretKey"
)

// 获取header authorization 签名
const header = geoSign.sign({
    path: `/v1/cloudapi/developer/devDataPackUsage`,
    header: {
        'Content-Type': 'application/json',
    },
    method: 'GET',
    time: new Date(),
    body: '',
    queryString: 'channel=channelId&appId=appId',
})
// 签名返回内容
// {
//     "Content-Type": "application/json",
//     "authorization": "secretId=secretId,nonceStr=K-zgG5ZW7UvfmwpgN8LO4,service=geovis-data-cloud,timestamp=1698828171453,signature=13f01b038e401bf7d8d78e1a530d14cdfa07964daf11b4b0a2c850c4c8e1b36d"
// }

```

3 CertificationSign使用
```javascript
const { CertificationSign } = require('geovis-cloud-api-node')

const geoSign = new CertificationSign(
    "your secretId",
    "your secretKey"
)

// 获取header authorization 签名
const header = geoSign.sign({
    path: `/v1/cloudapi/user/status`,
    header: {
        'Content-Type': 'application/json',
    },
    method: 'GET',
    time: new Date(),
    body: '',
    queryString: 'channel=channelId&phone=phone',
})
// 签名返回内容
// {
//   "Content-Type": "application/json; charset=utf-8",
//   "authorization": "secretId=your secretId,nonceStr=pVu7s_Um38DPMzPYisclN,service=geovis-certification,timestamp=1714359369224,signature=a0e8410ea7b105d1fa838d33be8ec7d05f355997d0afbaa58a95cd897d1dbc3b"
// }

```

4 PaymentSign使用
```javascript
const { PaymentSign } = require('geovis-cloud-api-node')

const paymentSign = new PaymentSign(
    "your secretId",
    "your secretKey",
    'mchid'
)

// 获取header authorization 签名
const header = paymentSign.sign({
    path: `/v2/access/prepay`,
    header: {
        'Content-Type': 'application/json',
    },
    method: 'POST',
    time: new Date(),
    body: JSON.stringify({
        orderNo: 'orderNo',
        productName: "测试验签工具",
        total: 10000,
        payMode: 'wxpay',
        payChannel: 'NATIVE',
        callbackUrl: 'http://www.baidu.com?ad=12'
    }),
    queryString: '',
})
// 签名返回内容
// {
//     "Content-Type": "application/json",
//     "authorization": "secretId=secretId,nonceStr=K-zgG5ZW7UvfmwpgN8LO4,service=geovis-payment-center,timestamp=1698828171453,signature=13f01b038e401bf7d8d78e1a530d14cdfa07964daf11b4b0a2c850c4c8e1b36d,mchid=mchid"
// }

// 验证签名
try {
    const data = paymentSign.parseCallback({
        jsonData: '',
        notifyTime: '',
        sign: '',
        status: ''
    })
    return doSomethingForCallBack(data)
} catch (error) {
    // 签名不正确
    return null
}


```

