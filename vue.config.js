const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave: false, //关闭eslint检查
  // publicPath: isDev ? '' : querystring.unescape('<%=request.getContextPath()%>'),
  publicPath: process.env.BASE_URL,
  transpileDependencies: true,
  css:{
    loaderOptions:{
      less: {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {},
        },
        additionalData: `
          @import "ant-design-vue/lib/style/themes/default.less";
          @import "~@/styles/variables.less";
      `,
      },
    }
  }
})
