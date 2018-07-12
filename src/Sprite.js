import * as phina from "phina.js";
import * as PIXI from "pixi.js";
import {PIXI_KEY} from './const.js';
import {PixiDisplayElement} from './element.js';
import PixiTexture from './Texture.js';

/**
 * @class phina.pixi.PixiSprite
 * @memberOf phina.pixi
 * @extends phina.pixi.PixiDisplayElement
 *
 * @param {string|phina.pixi.PixiTexture|PIXI.Texture} image - String should be a key name
 * @param {number} [width]
 * @param {number} [height]
 * @param {number} [x]
 * @param {number} [y]
 */
export default phina.createClass({
// export default phina.define('phina.pixi.PixiSprite', {
  superClass: PixiDisplayElement,

  init: function(image, width, height, x, y) {
    this.superInit(new PIXI.Sprite());
    this._image = null;
    this._baseFrame = null;
    this._frameIndex = 0;

    this.setImage(image, width, height, x, y);
    this.cachedFrameWidth = this.width;
    this.cachedFrameHeight = this.height;
  },

  /**
   * Set the texture/image.
   * @instance
   * @memberof phina.pixi.PixiSprite
   *
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

    if (arguments[1] != null) {
      /* フレーム情報があったら、それに応じて新しいframeを生成する */
      image = PixiTexture.createFrame(image.texture, x, y, width, height)
    } else {
      /* clone image */
      image = PixiTexture.createFrame(image.texture, image.texture.frame);
    }
    this._image = image;
    this._baseFrame = image.texture.frame.clone();
    this._frameIndex = 0;
    this._setFrame(image);

    return this;
  },

  /**
   * @private
   * @instance
   * @memberof phina.pixi.PixiSprite
   *
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
   * @instance
   * @memberof phina.pixi.PixiSprite
   *
   * @param {number|object} index - The index of the frame. Could be a param object
   * @param {number} [width] - width of frame
   * @param {number} [height] - height of frame
   * @return {this}
   */
  setFrameIndex: function(index, width, height) {
    if (typeof index === 'object') {
      var params = ({}).$extend(index);
      index = params.index;
      width = params.width;
      height = params.height;
    }
    var baseFrame = this._baseFrame;
    var ox = baseFrame.x;
    var oy = baseFrame.y;
    var fw = this.cachedFrameWidth = (width || this.cachedFrameWidth);
    var fh = this.cachedFrameHeight = (height || this.cachedFrameHeight);

    var row = ~~(baseFrame.width / fw);
    var col = ~~(baseFrame.height / fh);
    var maxIndex = this._maxFrameIndex = row*col;
    index = index%maxIndex;

    var sx = index%row;
    var sy = ~~(index/row);
    this.resetFrame(sx*fw+ox, sy*fh+oy, fw, fh);
    this._frameIndex = index;

    return this;
  },

  /**
   * set frame and update texture
   * @instance
   * @memberof phina.pixi.PixiSprite
   *
   * @param {number|object} index - Could be a param object
   * @param {number} [width] - width of frame
   * @param {number} [height] - height of frame
   * @return {this}
   */
  resetFrame: function(x, y, width, height) {
    var texture = this._image.texture;
    texture.frame.set(x, y, width, height);
    texture._updateUvs();
    // this.width = width; // scaleが変わってしまう
    // this.height = height;
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