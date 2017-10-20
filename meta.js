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
    "port": {
      "type": "number",
      "required": true,
      "message": "请设置本地开发服务器端口，用于执行 npm run dev 命令后在浏览器访问的端口",
      "default": 8200
    },
    "author": {
      "type": "string",
      "message": "Author",
      "default": "mail@luozhihua.com"
    }
  },
  "filters": {},
  "skipInterpolation": "src/**/*.*",
  complete (data, {logger, chalk}) {
    if (!data.inPlace) {
      const fork = require('child_process').spawn

      logger.log(chalk.green('项目创建成功!'))
      logger.log(chalk.blue(`正在为您执行初始化脚本，可能需要${chalk.bold('3~6分钟')}才能完成。`))

      let ls = fork('npm', ['run', 'setup'], {cwd: data.destDirName})
      logger.log(chalk.blue('npm install && npm run dll'))

      ls.stdout.on('data', (data) => {
        console.log(`${data}`);
      });

      ls.stderr.on('data', (data) => {
        console.log(`${data}`);
      });

      ls.on('close', (code) => {
        if (code === 0) {
          logger.log(chalk.green('项目初始化完成，请执行以下命令开始 Coding 吧！'))
          logger.log(chalk.blue(`cd ${data.destDirName}`))
          logger.log(chalk.blue('npm run dev'))
        } else {
          logger.log(chalk.red(`项目初始化失败，请输入以下命令重试:\n\n  cd ${data.destDirName}\n  npm run setup\n`))
        }
      });
    }
  }
};
