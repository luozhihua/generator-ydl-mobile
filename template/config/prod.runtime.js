/**
 * 生产环境运行时配置文件
 *
 * 所有配置项会被挂载到全局变量 CONFIG 上
 * 因此，在代码中可以直接通过 CONFIG.xxx 读取配置项
 *
 * 🌰 举个栗子：
 *
 * console.log(CONFIG.env) // 在测试环境值为 dev, 生产环境值为 prod
 */
export default {
  env: 'prod',
  apiPrefix: '/', // API 前缀
  dingLoginCallbackUrl: '' // 钉钉账号或扫描登陆成功后的回调地址
}
