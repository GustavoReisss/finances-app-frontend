
const PROXY_CONFIG = [
    {
        "enabled": false,
        "context": ["/api_proxy/despesas_futuras"],
        "target": "https://d28jtj2wwws6wz.cloudfront.net/api",
        "secure": false,
        "changeOrigin": true,
        "logLevel": "debug",
        "pathRewrite": {
            "^/api_proxy": ""
        }
    },
    {
        "enabled": false,
        "context": ["/api_proxy/despesas_futuras"],
        "target": "http://127.0.0.1:5001",
        "secure": false,
        "changeOrigin": true,
        "logLevel": "debug",
        "pathRewrite": {
            "^/api_proxy": ""
        }
    },
    {
        "enabled": false,
        "context": [
            "/api_proxy/despesas",
            "/api_proxy/extrato_despesas",
            "/api_proxy/ativos"
        ],
        "target": "http://127.0.0.1:5000",
        "secure": false,
        "changeOrigin": true,
        "logLevel": "debug",
        "pathRewrite": {
            "^/api_proxy": ""
        }
    },
    {
        "enabled": true,
        "context": ["/api_proxy"],
        "target": "https://d28jtj2wwws6wz.cloudfront.net/api",
        "secure": true,
        "changeOrigin": true,
        "logLevel": "debug",
        "pathRewrite": {
            "^/api_proxy": ""
        }
    }
]

module.exports = PROXY_CONFIG.filter(config => config.enabled)