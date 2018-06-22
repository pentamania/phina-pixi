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
    this._frameIndex = 0;
    this._frameWidth = 0;
    this._frameHeight = 0;
    // this._cachedFrames = {};
    this.setImage(image, 0, 0, width, height);
  },

  /**
   * setImage
   * @param {string|phina.pixi.PixiTexture|PIXI.Texture} image
   * @param {number} x      [optional]
   * @param {number} y      [optional]
   * @param {number} width  [optional]
   * @param {number} height [optional]
   */
  setImage: function(image, x, y, width, height) {
    if (typeof image === 'string') {
      image = phina.asset.AssetManager.get('pixi', image);
    }
    if (image.createFrame && typeof x === 'number') {
      image = image.createFrame(x, y, width, height);
    }
    this._image = image;

    this._setFrame(image);
    return this;
  },

  _setFrame: function(frame) {
    // var texture = (frame.pixiTexture) ? frame.pixiTexture : frame.texture;
    var texture = frame.texture;
    this[PIXI_KEY].texture = texture;
    this.width = texture.width;
    this.height = texture.height;
    this.setOrigin(this.originX, this.originY);
  },

  setFrameIndex: function(index, width, height) {
    // todo: check cached frame
    var tw  = this._frameWidth = width || this._frameWidth;      // tw
    var th  = this._frameHeight = height || this._frameHeight;    // th
    var row = ~~(this[PIXI_KEY].texture.baseTexture.width / tw);
    var col = ~~(this[PIXI_KEY].texture.baseTexture.height / th);
    var maxIndex = row*col;
    index = index%maxIndex;

    var x = index%row;
    var y = ~~(index/row);
    this.setImage(this._image, x*tw, y*th, tw, th);
    this._frameIndex = index;
    // todo: cache frame
    return this;
  },

  // @todo: フレームをキャッシュするようにする？ frameCacherみたいなクラス用意する？
  // _getCachedFrame: function(index, width, height) {
    // if (this._cachedFrames[index]) {
    //   var frame = this._cachedFrames[index];
    //   if (frame.width === width && frame.height === height) {
    //     this._setFrame(frame);
    //     this._frameIndex = index;
    //     return this;
    //   }
    // }
  // },

  _accessor: {
    frameIndex: {
      get: function() { return this._frameIndex; },
      set: function(idx) {
        this.setFrameIndex(idx);
        return this;
      }
    },
  },
});