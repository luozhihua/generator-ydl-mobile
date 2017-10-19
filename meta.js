module.exports = {
  "helpers": {
    "if_or": function (v1, v2, options) {
      if (v1 || v2) {
        return options.fn(this);
      }

      return options.inverse(this);
    }
  },
  "prompts": {
    "name": {
      "type": "string",
      "required": true,
      "message": "请输入项目名称（英文小写，单词间用`-`连接）"
    },
    "description": {
      "type": "string",
      "required": false,
      "message": "项目描述",
      "default": "Joyshark 移动端项目."
    },
    "author": {
      "type": "string",
      "message": "Author",
      "default": "mail@luozhihua.com"
    }
  },
  "filters": {},
  "skipInterpolation": "src/**/*.*",
  "completeMessage": "项目创建成功，快速开始:\n\n  {{^inPlace}}cd {{destDirName}}\n  {{/inPlace}}npm install\n  npm run dev\n"
};