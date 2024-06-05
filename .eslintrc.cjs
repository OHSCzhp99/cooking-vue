/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-prettier/skip-formatting'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    //prettier插件配置：
    //禁用格式化插件 prettier ，并且关闭settings.json中的format on save
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true, //单引号
        semi: false, //无分号
        printWidth: 80, //每行宽度至多80字符
        trailingComma: 'none', //不加对象/数组最后的逗号
        endOfLine: 'auto' //换行符号不限制（win mac 不一致）
      }
    ],
    //ESLint插件配置：
    //安装ESLint插件，并配置保存时自动修复
    'vue/multi-word-component-names': [
      'warn',
      {
        ignores: ['index'] //vue组件名称多单词组成 (忽略index.vue)
      }
    ],
    'vue/no-setup-props-destructure': ['off'], //关闭props 解构的校验(props解构丢失响应式)
    'no-undef': 'error' //未定义变量错误提示
  },
  //对element按需导入进行说明，否则eslint会认为没有导入
  globals: {
    ElMessage: 'readonly',
    ElMessageBox: 'readonly',
    ElLoading: 'readonly'
  }
}
