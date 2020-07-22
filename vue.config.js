module.exports = {
  publicPath: typeof process.env.CORDOVA_PLATFORM !== 'undefined' ? '' : '/',
  pluginOptions: {
    cordovaPath: 'src-cordova'
  },
  transpileDependencies: [
    'vuetify'
  ],
  pwa: {
    name: 'GCC AWANA',
    themeColor: '#00bfa5',
    msTileColor: '#00bfa5'
  }
}
