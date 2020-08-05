process.env.VUE_APP_VERSION = require('./package.json').version

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
    msTileColor: '#00bfa5',
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-icon-152x152.png',
      msTileImage: 'img/icons/ms-icon-144x144.png'
    },
    manifestOptions: {
      icons: [
        {
          src: 'img/icons/android-icon-36x36.png',
          sizes: '36x36',
          type: 'image/png',
          density: '0.75'
        },
        {
          src: 'img/icons/android-icon-48x48.png',
          sizes: '48x48',
          type: 'image/png',
          density: '1.0'
        },
        {
          src: 'img/icons/android-icon-72x72.png',
          sizes: '72x72',
          type: 'image/png',
          density: '1.5'
        },
        {
          src: 'img/icons/android-icon-96x96.png',
          sizes: '96x96',
          type: 'image/png',
          density: '2.0'
        },
        {
          src: 'img/icons/android-icon-144x144.png',
          sizes: '144x144',
          type: 'image/png',
          density: '3.0'
        },
        {
          src: 'img/icons/android-icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          density: '4.0'
        }
      ]
    }
  }
}
