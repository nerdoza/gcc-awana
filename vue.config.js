module.exports = {
  publicPath: typeof process.env.CORDOVA_PLATFORM !== 'undefined' ? '' : '/',
  pluginOptions: {
    cordovaPath: 'src-cordova'
  },
  transpileDependencies: [
    'vuetify'
  ]
}
