import * as phina from "phina.js";
import * as PIXI from "pixi.js";
import {PIXI_KEY} from './const.js';
import {PixiDisplayElement} from './element.js';

/**
 * phina.pixi.PixiSprite
 * @class   PixiSprite
 * @extends PixiDisplayElement
 * ref: https://qiita.com/minimo/items/a0aa17d05172b5bfca70
 *
 * @param  {String|PIXI.Texture} image: String should be key name or url
 *
 */
export default phina.createClass({
// export default phina.define('phina.pixi.PixiSprite', {
  superClass: PixiDisplayElement,
  // superClass: phina.pixi.DisplayElement,

  init: function(image) {
    if (typeof image === 'string') {
      // check pixi loader
      var pixiSrc = PIXI.loader.resources[image];
      if (pixiSrc) {
        if (typeof pixiSrc.texture !== "undefined") {
          image = new PIXI.Sprite(pixiSrc.texture);
        } else {
          image = new PIXI.Sprite(pixiSrc);
        }
      } else {
        // check phina side
        var phinaImage = phina.asset.AssetManager.get('image', image);
        if (phinaImage) {
         image = PIXI.Sprite.fromImage(phinaImage.src);
        } else {
          // is src url
         image = PIXI.Sprite.fromImage(image);
        }
      }
    } else {
      image = new PIXI.Sprite(image);
    }
    this.superInit(image);
    this._texture = this[PIXI_KEY].texture;

    this._frameIndex = 0;
    this._frameWidth = this.width;
    this._frameHeight = this.height;
    this.srcRect = new PIXI.Rectangle();
    this._frameMaskObject = new PIXI.Graphics();
    this[PIXI_KEY].addChild(this._frameMaskObject);
  },

  /**
   * setFrameIndex
   * とりあえずmask機能を使って無理やり再現
   * originを参照しているため、変更時に再実行される
   *
   * @param {Number} index  [description]
   * @param {Number} width  [description]
   * @param {Number} height [description]
   */
  setFrameIndex: function(index, width, height) {
    // phina.display.Sprite.prototype.setFrameIndex.apply(this, arguments);
    var tw  = this._frameWidth = width || this._frameWidth;      // tw
    var th  = this._frameHeight = height || this._frameHeight;    // th
    var row = ~~(this._texture.baseTexture.width / tw);
    var col = ~~(this._texture.baseTexture.height / th);
    var maxIndex = row*col;
    index = index%maxIndex;

    var x = index%row;
    var y = ~~(index/row);
    this.srcRect.x = -this._width*this.originX + x*tw;
    this.srcRect.y = -this._height*this.originY + y*th;
    this.srcRect.width  = tw;
    this.srcRect.height = th;

    this._frameMaskObject.clear().beginFill()
    .drawRect(this.srcRect.x, this.srcRect.y, this.srcRect.width, this.srcRect.height)
    .endFill();
    this[PIXI_KEY].mask = this._frameMaskObject;

    // うまくいかない：textureを直接操作するとほかのSpriteにも影響するため
    // this[PIXI_KEY].filterArea = this.srcRect;
    // this[PIXI_KEY].texture.frame = new PIXI.Rectangle(this.srcRect.x, this.srcRect.y, this.srcRect.width, this.srcRect.height);
    // this[PIXI_KEY].texture.trim = new PIXI.Rectangle(this.srcRect.x, this.srcRect.y, this.srcRect.width, this.srcRect.height);
    // this[PIXI_KEY].texture._updateUvs();

    this._frameIndex = index;

    return this;
  },

  // setImage: function(newImage, width, height) {
  //   this._image = newImage;
  //   this.pixiObject = new PIXI.Sprite.fromImage(newImage.src);
  //   this.pixiObject.texture.baseTexture.width = this.image.domElement.width;
  //   this.pixiObject.texture.baseTexture.height = this.image.domElement.height;
  //   this.pixiObject.texture.frame = new PIXI.Rectangle(this.srcRect.x, this.srcRect.y, this.srcRect.width, this.srcRect.height);
  //   return this;
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

  _defined: function() {
    // origin変更に応じてframeを変更しないといけない
    var func = function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setFrameIndex(this._frameIndex, this.srcRect.width, this.srcRect.height)
      }
    };

    [
      'originX',
      'originY',
    ].forEach(function(key) {
      this.$watch(key, func);
    }, this.prototype);
  },
});