const constants = require('./constants');

const defaultTagName = constants.DEFAULT_TAG_NAME;
const defaultTagId = constants.DEFAULT_TAG_ID;
const configWarn = constants.CONFIG_WARNING;

class ReactRootPlugin {
  constructor(options) {
    let newOptions = options;
    if (Object.prototype.toString.call(options) !== '[object Object]') {
      let tagId;
      if (typeof options === 'string') {
        tagId = options;
      } else if (typeof options !== 'undefined') {
        this.configWarn = configWarn;
      }

      newOptions = {
        tagName: defaultTagName,
        tagId: tagId || defaultTagId,
      };
    }

    this.tagName = newOptions.tagName || defaultTagName;
    this.tagId = newOptions.tagId || defaultTagId;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('ReactRootPlugin', (compilation) => {
      require('html-webpack-plugin').getHooks(compilation).beforeEmit.tapAsync(
        'ReactRootPlugin',
        (data, cb) => {
          const htmlString = data.html;
          const bodyIndex = htmlString.indexOf('<script');
          const firstHalf = htmlString.slice(0, bodyIndex);
          const secondHalf = htmlString.slice(bodyIndex, htmlString.length);

          const returnData = {
            html: `${firstHalf}<${this.tagName} id="${this.tagId}"></${this.tagName}>${secondHalf}`,
          };

          cb(null, returnData);
        }
      );
    });
  }
}

module.exports = ReactRootPlugin;
