import * as phina from "phina.js";
import * as PIXI from "pixi.js";

/**
 * phina.pixi.PixiTexture
 * @class   PixiTexture
 * @extends phina.asset.Asset
 * ref: https://github.com/simiraaaa/phina.pixi.js
 *
 */
var PixiTexture = phina.createClass({
  superClass: phina.asset.Asset,

  init: function(key) {
    this.superInit();
    this._key = key || null;
    // this.pixiTexture = null;
    this.texture = null;
    this.textures = null;
  },

  /**
   * _load
   * @param  {function} resolve
   * @return {resolve return}
   */
  _load: function(resolve) {
    /* loaderロード中はaddできないため、アセットごとにloader生成する */
    var loader = new PIXI.loaders.Loader();
    loader.add(this._key, this.src).load(function(loader, resources) {
      var resrc = resources[this._key];
      if (resrc.texture) {
        this.texture = resrc.texture;
      } else if (resrc.textures) {
        // スプライトマップのとき: 全てテクスチャ登録する？
        this.textures = resrc.textures;
      }
      loader = null;
      resolve(this);
    }.bind(this));
  },

  /**
   * createFrame
   * 完全に新しいtextureを返す
   * @param  {number} x
   * @param  {number} y
   * @param  {number} width
   * @param  {number} height
   * @return {PixiTexture}
   */
  createFrame: function(x, y, width, height) {
    if (typeof x === 'object') {
      y = x.y;
      width = x.width;
      height = x.height;
      x = x.x;
    }
    x = x || 0;
    y = y || 0;
    width = width || this.texture.baseTexture.width;
    height = height || this.texture.baseTexture.height;

    var newPixiTexture = PixiTexture();
    newPixiTexture.texture = new PIXI.Texture(this.texture.baseTexture, new PIXI.Rectangle(x, y, width, height));
    return newPixiTexture;
  },

  /**
   * @param {HTMLCanvasElement} canvas
   */
  fromCanvas: function(canvas) {
    this.texture = PIXI.Texture.fromCanvas(canvas);
    return this;
  },

  /**
   * @param {phina.display.Shape} shape
   */
  fromShape: function(shape) {
    if (shape._dirtyDraw) {
      shape.render(shape.canvas);
    }
    return this.fromCanvas(shape.canvas.domElement);
  },

  update: function() {
    this.texture.update();
    return this;
  },

  _accessor: {
    width: {
      get: function() {
        return this.texture.width;
      },

      set: function(v) {
        this.texture.width = v;
      }
    },

    height: {
      get: function() {
        return this.texture.height;
      },

      set: function(v) {
        this.texture.height = v;
      }
    },
  },

  _static: {
    fromCanvas: function(canvas) {
      return PixiTexture().fromCanvas(canvas);
    },

    fromShape: function(shape) {
      return PixiTexture().fromShape(shape);
    },
  }
});

/**
 * extend phina AssetLoader
 */
// phina.asset.AssetLoader.register('pixi', function(key, path) {
//   return PixiTexture(key).load(path);
// });
phina.asset.AssetLoader.assetLoadFunctions.pixi = function(key, path) {
  return PixiTexture(key).load(path);
};

export default PixiTexture;