# {{ name }}

> {{ description }}

## Environment

`Node >= 6`

## 快速开始

 - clone 此项目到本地
 - 进入项目文件夹, 安装依赖包:

``` bash
npm install
```

## 开发

``` bash
# 远行此命令，然后在浏览器打开：localhost:{{ port }}
npm run dev
```

## 打包

``` bash
# 打包后会在项目根目录生成 dist 目录，此目录即是用于生产环境的部署包
npm install && npm run build
```

## NGINX 配置

```yml
    # 代理API，代理到后台API的地址和端口
    location /api/ {

        # 代理到API服务器后去掉path中的“/api”
        # "www.xxx.com/api/serviceName" => "www.xxx.com/serviceName"
        rewrite ^/api/(.*) /$1 break;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;

        proxy_pass http://127.0.0.1:3100; # WEB_API 服务的ip和port;
        proxy_redirect off;
    }

    location / {
        # 必须配置
        try_files $uri /index.html; 
    }
```
