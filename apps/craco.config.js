/* craco.config.js */

const CracoAlias = require("craco-alias")

module.exports = {
  eslint: {
    enable: false
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "jsconfig",
        // baseUrl SHOULD be specified
        // plugin does not take it from jsconfig
        baseUrl: "./src"
      }
    },
  ]
}