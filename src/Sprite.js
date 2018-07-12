import * as phina from "phina.js";
import * as PIXI from "pixi.js";
import {PIXI_KEY} from './const.js';
import {PixiDisplayElement} from './element.js';

/**
 * phina.pixi.PixiSprite
 * @class   PixiSprite
 * @extends PixiDisplayElement
 *
 * @param {string|phina.pixi.PixiTexture|PIXI.Texture} image String: should be a key name
 */
export default phina.createClass({
// export default phina.define('phina.pixi.PixiSprite', {
  superClass: PixiDisplayElement,

  _image: null,

  init: function(image, width, height) {
    this.superInit(new PIXI.Sprite());
    this.setImage(image, 0, 0, width, height);

    this._frameIndex = 0;
    this._maxFrameIndex = 0;
    // this._frameOriginX = 0;
    // this._frameOriginY = 0;
    this.frameWidth = this.width;
    this.frameHeight = this.height;
    this._cachedFrames = {};
  },

  /**
   * setImage
   * @param {string|phina.pixi.PixiTexture|PIXI.Texture} image
   * @param {number} [x]
   * @param {number} [y]
   * @param {number} [width]
   * @param {number} [height]
   * @return {this}
   */
  setImage: function(image, x, y, width, height) {
    if (typeof image === 'string') {
      image = phina.asset.AssetManager.get('pixi', image);
      if (!image) throw new Error("[phina-pixi]: Image does not exist in AssetManager")
    }

    /* フレーム情報があったら、それに応じて新しいframeを生成する */
    if (image.createFrame && typeof x === 'number') {
      image = image.createFrame(x, y, width, height);
    }
    this._image = image;

    this._setFrame(image);
    return this;
  },

  /**
   * フレーム最終調整・セット
   * @private
   * @param {phina.pixi.PixiTexture|PIXI.Sprite} image
   * @return {void}
   */
  _setFrame: function(image) {
    var texture = image.texture;
    this[PIXI_KEY].texture = texture;
    this.width = texture.width;
    this.height = texture.height;
    this.setOrigin(this.originX, this.originY);
  },

  /**
   * indexに応じたフレームのセット
   * @instance
   * @param {phina.pixi.PixiTexture|PIXI.Sprite} image
   * @param {number} [width]
   * @param {number} [height]
   * @return {this}
   */
  setFrameIndex: function(index, width, height) {
    var fw  = this.frameWidth = (width || this.frameWidth);
    var fh  = this.frameHeight = (height || this.frameHeight);
    var _index = (this._maxFrameIndex !== 0) ? index%this._maxFrameIndex : index;

    /* check cached frame */
    var cachedFrame = this._getCachedFrame(_index, fw, fh);
    if (cachedFrame != null) {
      this.setImage(cachedFrame);
      this._frameIndex = _index;
      return this;
    }

    /* create new frame */
    var baseTexture = this[PIXI_KEY].texture.baseTexture;
    var row = ~~(baseTexture.width / fw);
    var col = ~~(baseTexture.height / fh);
    var maxIndex = this._maxFrameIndex = row*col;
    index = index%maxIndex;

    var x = index%row;
    var y = ~~(index/row);
    this.setImage(this._image, x*fw, y*fh, fw, fh);
    this._frameIndex = index;
    // console.log('new frame!');

    /* cache frame */
    this._cachedFrames[index] = this._image;
    // console.log('cached!', this._cachedFrames);

    return this;
  },

  /**
   * cacheしたフレームが
   *  ->ない => return null (make new frame)
   *  ->ある =>  フレームのwidth, heightが変更されて
   *   -> ない => return _cachedFrames[index]
   *   -> いる => return null (make new frame)
   * @private
   * @param {number} index
   * @param {number} width
   * @param {number} height
   */
  _getCachedFrame: function(index, width, height) {
    if (this._cachedFrames[index]) {
      var frame = this._cachedFrames[index];
      if (frame.width === width && frame.height === height) {
        return frame;
      } else {
        return null;
      }
    } else {
      return null;
    }
  },

  _accessor: {
    frameIndex: {
      get: function() { return this._frameIndex; },
      set: function(idx) {
        this.setFrameIndex(idx);
      }
    },
  },
});