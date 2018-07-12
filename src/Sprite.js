import * as phina from "phina.js";
import * as PIXI from "pixi.js";
import {PIXI_KEY} from './const.js';
import {PixiDisplayElement} from './element.js';

/**
 * phina.pixi.PixiSprite
 * @class   PixiSprite
 * @extends PixiDisplayElement
 *
 * @param {string|phina.pixi.PixiTexture|PIXI.Texture} image - String should be a key name
 * @param {number} [width]
 * @param {number} [height]
 */
export default phina.createClass({
// export default phina.define('phina.pixi.PixiSprite', {
  superClass: PixiDisplayElement,

  _image: null,

  init: function(image, width, height) {
    this.superInit(new PIXI.Sprite());
    this.setImage(image, width, height);

    this._frameIndex = 0;
    this._maxFrameIndex = 0;
    this._frameOriginX = 0;
    this._frameOriginY = 0;
    this.frameWidth = this.width;
    this.frameHeight = this.height;
    this._cachedFrames = {};
  },

  /**
   * setImage
   * @param {string|phina.pixi.PixiTexture|PIXI.Texture} image
   * @param {number} [width]
   * @param {number} [height]
   * @param {number} [x]
   * @param {number} [y]
   * @return {this}
   */
  setImage: function(image, width, height, x, y) {
    if (typeof image === 'string') {
      image = phina.asset.AssetManager.get('pixi', image);
      if (!image) throw new Error("[phina-pixi]: Image does not exist in AssetManager")
    }

    /* フレーム情報があったら、それに応じて新しいframeを生成する */
    if (image.createFrame && arguments[1] != null) {
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
   * @param {number|object} index - Could be a param object
   * @param {number} [width]
   * @param {number} [height]
   * @param {number} [x] - origin-x of frame
   * @param {number} [y] - origin-y of frame
   * @return {this}
   */
  setFrameIndex: function(index, width, height, x, y) {
    if (typeof index === 'object') {
      var params = ({}).$extend(index);
      index = params.index;
      width = params.width;
      height = params.height;
      x = params.x;
      y = params.y;
    }
    var ox = this._frameOriginX = (x || this._frameOriginX);
    var oy = this._frameOriginY = (y || this._frameOriginY);
    var fw = this.frameWidth = (width || this.frameWidth);
    var fh = this.frameHeight = (height || this.frameHeight);
    var _index = (this._maxFrameIndex !== 0) ? index%this._maxFrameIndex : index;

    /* check cached frame */
    var cachedFrame = this._getCachedFrame(_index, fw, fh, ox, oy);
    if (cachedFrame != null) {
      this.setImage(cachedFrame);
      this._frameIndex = _index;
      return this;
    }

    /* create new frame */
    var baseTexture = this[PIXI_KEY].texture.baseTexture;
    var row = ~~((baseTexture.width-ox) / fw);
    var col = ~~((baseTexture.height-oy) / fh);
    var maxIndex = this._maxFrameIndex = row*col;
    index = index%maxIndex;

    var sx = index%row;
    var sy = ~~(index/row);
    this.setImage(this._image, fw, fh, sx*fw+ox, sy*fh+oy);
    this._image._frameOriginX = ox;
    this._image._frameOriginY = oy;
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
   *  ->ある =>  フレームのwidth, height等が変更されて
   *   -> ない => return _cachedFrames[index]
   *   -> いる => return null (make new frame)
   * @private
   * @param {number} index
   * @param {number} width
   * @param {number} height
   * @param {number} ox
   * @param {number} oy
   * @return {phina.pixi.PixiTexture|null}
   */
  _getCachedFrame: function(index, width, height, ox, oy) {
    if (this._cachedFrames[index]) {
      var frame = this._cachedFrames[index];
      if (
        frame.width === width
        && frame.height === height
        && frame._frameOriginX === ox
        && frame._frameOriginY === oy
      ) {
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