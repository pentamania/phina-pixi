import * as phina from "phina.js";
import * as PIXI from "pixi.js";
import {PIXI_KEY} from './const.js';
import {PixiDisplayElement} from './element.js';
import PixiTexture from './Texture.js';

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

  init: function(image, width, height, x, y) {
    this.superInit(new PIXI.Sprite());
    this._image = null;
    this._frame = null;
    this._cachedFrames = {};
    this._frameIndex = 0;
    this._maxFrameIndex = 0;

    this.setImage(image, width, height, x, y);
    this._setFrame(this._image);

    // this._frameOriginX = 0;
    // this._frameOriginY = 0;
    this.cachedFrameWidth = this.width;
    this.cachedFrameHeight = this.height;
  },

  /**
   * 基本となる画像（テクスチャ）をセット
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
      if (!image) throw new Error("[phina-pixi]: Image does not exist in AssetManager");
    }

    /* フレーム情報があったら、それに応じて新しいframeを生成する */
    if (arguments[1] != null) {
      image = PixiTexture.createFrame(image.texture, x, y, width, height)
    }
    this._image = image;

    /* init cache */
    this._cachedFrames = {
      0: image,
    };
    this._frameIndex = 0;
    this._maxFrameIndex = 0;

    return this;
  },

  /**
   * フレーム最終調整・セット
   * @private
   * @param {phina.pixi.PixiTexture|PIXI.Sprite} image
   * @return {void}
   */
  _setFrame: function(image) {
    this._frame = image;
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
   * @param {number} [width] - width of frame
   * @param {number} [height] - height of frame
   * @param {number} [x] - origin-x of frame
   * @param {number} [y] - origin-y of frame
   * @return {this}
   */
  // setFrameIndex: function(index, width, height, x, y) {
  setFrameIndex: function(index, width, height) {
    if (typeof index === 'object') {
      var params = ({}).$extend(index);
      index = params.index;
      width = params.width;
      height = params.height;
      // x = params.x;
      // y = params.y;
    }
    var baseFrame = this._image.texture.frame;
    // var ox = this._frameOriginX = (x || this._frameOriginX);
    // var oy = this._frameOriginY = (y || this._frameOriginY);
    var ox = baseFrame.x;
    var oy = baseFrame.y;
    var fw = this.cachedFrameWidth = (width || this.cachedFrameWidth);
    var fh = this.cachedFrameHeight = (height || this.cachedFrameHeight);
    var _index = (this._maxFrameIndex !== 0) ? index%this._maxFrameIndex : index;

    /* check cached frame */
    // var cachedFrame = this._getCachedFrame(_index, fw, fh, ox, oy);
    var cachedFrame = this._getCachedFrame(_index, fw, fh);
    if (cachedFrame != null) {
      this._setFrame(cachedFrame);
      this._frameIndex = _index;
      return this;
    }

    /* create new frame */
    // var baseTexture = this._image.texture.baseTexture;
    var row = ~~(baseFrame.width / fw);
    var col = ~~(baseFrame.height / fh);
    // var row = ~~((baseTexture.width-ox) / fw);
    // var col = ~~((baseTexture.height-oy) / fh);
    var maxIndex = this._maxFrameIndex = row*col;
    index = index%maxIndex;

    var sx = index%row;
    var sy = ~~(index/row);
    var newFrame = PixiTexture.createFrame(this._image.texture, sx*fw+ox, sy*fh+oy, fw, fh)
    this._setFrame(newFrame);
    this._frameIndex = index;
    // console.log('new frame!', newFrame);

    /* cache frame */
    this._cachedFrames[index] = newFrame;
    // console.log('cached!', this._cachedFrames);

    return this;
  },

  /**
   * cacheされたフレームが
   *  ->ない => return null (make new frame)
   *  ->ある =>  フレームのwidth, height等が変更されて
   *   -> ない => return _cachedFrames[index]
   *   -> いる => return null (make new frame)
   * @private
   * @param {number} index
   * @param {number} [width]
   * @param {number} [height]
   * @param {number} ox
   * @param {number} oy
   * @return {phina.pixi.PixiTexture|null}
   */
  // _getCachedFrame: function(index, width, height, ox, oy) {
  _getCachedFrame: function(index, width, height) {
    if (this._cachedFrames[index]) {
      // console.log('cached frame', this._cachedFrames[index]);
      var frame = this._cachedFrames[index];
      var frameRect = frame.texture.frame;
      if (
        frameRect.width === width
        && frameRect.height === height
        // && frame.x === ox
        // && frame.y === oy
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