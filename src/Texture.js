import * as phina from "phina.js";
import * as PIXI from "pixi.js";
import { ASSET_TYPE } from "./const.js";

/**
 * <pre>
 * pixi用textureアセットクラス
 * phina Asset class wrapping.PIXI.Texture
 * </pre>
 *
 * @class   phina.pixi.PixiTexture
 * @memberOf phina.pixi
 * @extends phina.asset.Asset
 *
 * @param  {string} key - Name of the key to get this object from AssetManager
 *
 * properties: todo
 * @property {number} width
 * @property {number} height
 */
var PixiTexture = phina.createClass({
  superClass: phina.asset.Asset,

  init: function(key) {
    this.superInit();
    this._key = key || null;
    this.texture = null;
  },

  /**
   * _load returns resolve result
   * @private
   * @instance
   * @memberof phina.pixi.PixiTexture
   * @param  {function} resolve
   * @return {void}
   */
  _load: function(resolve) {
    /* loaderロード中はaddできないため、アセットごとにloader生成する */
    var loader = new PIXI.loaders.Loader();
    loader.add(this._key, this.src).load(function(loader, resources) {
      var resrc = resources[this._key];
      if (resrc.texture) {
        this.texture = resrc.texture;
      } else if (resrc.textures) {
        /* スプライトマップのときは全てのテクスチャを登録 */
        resrc.textures.forIn(function(key, texture) {
          var pixiTexture = PixiTexture();
          pixiTexture.texture = texture;
          key = key.replace(/\.[^/.]+$/, ""); // trim .ext
          phina.asset.AssetManager.set(ASSET_TYPE, key, pixiTexture);
        })
      }
      loader = null;
      resolve(this);
    }.bind(this));
  },

  /**
   * <pre>
   * create and return new PIXI.texture
   * You can set frame by passing parameters
   * 新しいPIXI.textureを返す
   * 矩形パラメータを渡すことでフレーム指定も可能
   * </pre>
   * @instance
   * @memberof phina.pixi.PixiTexture
   *
   * @param  {number|object} [x] - Could be a param object
   * @param  {number} [y] - frame rect origin y
   * @param  {number} [width] - frame rect width
   * @param  {number} [height]- frame rect height
   * @return {PIXI.Texture}
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
   * Create new Pixi texture from HTMLcanvas
   * @instance
   * @memberof phina.pixi.PixiTexture
   * @param {HTMLCanvasElement} canvas
   * @return {this}
   */
  fromCanvas: function(canvas) {
    this.texture = PIXI.Texture.fromCanvas(canvas);
    return this;
  },

  /**
   * Create new Pixi texture from phina Shape class
   * @instance
   * @memberof phina.pixi.PixiTexture
   * @param {phina.display.Shape} shape
   * @return {this}
   */
  fromShape: function(shape) {
    if (shape._dirtyDraw) {
      shape.render(shape.canvas);
    }
    return this.fromCanvas(shape.canvas.domElement);
  },

  /**
   * Update texture
   * @instance
   * @memberof phina.pixi.PixiTexture
   * @return {this}
   */
  update: function() {
    this.texture.update();
    return this;
  },

  _accessor: {
    width: {
      get: function() { return this.texture.width; },
      set: function(v) { this.texture.width = v; }
    },

    height: {
      get: function() { return this.texture.height; },
      set: function(v) { this.texture.height = v; }
    },
  },

  _static: {

    /**
     * static version of [createFrame]{@link phina.pixi.PixiTexture#createFrame}
     * @static
     * @memberof phina.pixi.PixiTexture
     * @return {PIXI.Texture}
     */
    createFrame: function(texture, x, y, width, height) {
      var pixiTexture = PixiTexture();
      pixiTexture.texture = texture;
      return pixiTexture.createFrame(x, y, width, height);
    },

    /**
     * static version of [fromCanvas]{@link phina.pixi.PixiTexture#fromCanvas}
     * @static
     * @memberof phina.pixi.PixiTexture
     * @return {PixiTexture}
     */
    fromCanvas: function(canvas) {
      return PixiTexture().fromCanvas(canvas);
    },

    /**
     * static version of [fromShape]{@link phina.pixi.PixiTexture#fromShape}
     * @static
     * @memberof phina.pixi.PixiTexture
     * @return {PixiTexture}
     */
    fromShape: function(shape) {
      return PixiTexture().fromShape(shape);
    },
  }
});

export default PixiTexture;