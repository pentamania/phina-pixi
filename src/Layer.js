import * as phina from "phina.js";
import * as PIXI from "pixi.js";
import {PIXI_KEY} from './const.js';
import {PixiDisplayElement} from './element.js';

/**
 * phina.pixi.PixiLayer
 * @class   PixiLayer
 * @extends PixiDisplayElement
 * 簡易連携用レイヤークラス
 *
 * @param {Object} options
*/
export default phina.createClass({
  superClass: PixiDisplayElement,

  renderer: null,

  init: function(options) {
    options = ({}).$safe(options, {
      width: 640,
      height: 960,
    });
    this.superInit(null, options);
    this.renderer = PIXI.autoDetectRenderer(options.width, options.height, {transparent: true});
    this._width = options.width;
    this._height = options.height;
    this.setOrigin(0, 0); // width/heightに合わせて再セット必要

    // phina側と整合性を取るため必要
    this._matrix = phina.geom.Matrix33().identity();
    this._worldMatrix = phina.geom.Matrix33().identity();

    this.on('enterframe', function() {
      this.renderer.render(this[PIXI_KEY]);
    });
  },

  // phina側と整合性を取るため必要
  _calcWorldMatrix: function() {
    return phina.app.Object2D.prototype._calcWorldMatrix();
  },

  draw: function(canvas) {
    // @fixme: こちらではrotationの描画がうまくいかない
    // var image = this.renderer.view;
    // canvas.context.drawImage(image,
    //   0, 0, image.width, image.height,
    //   -this.width*this.originX, -this.height*this.originY, this.width, this.height
    // );
    var image = this.renderer.view;
    canvas.context.drawImage(image, 0, 0, image.width, image.height);
  },

  _accessor: {
    /**
     * @property    width
     * 再セットするとoriginに不具合あり
     */
    width: {
      "get": function() {
        return this._width;
      },
      "set": function(v) {
        this._width = v;
        // this[PIXI_KEY].width = v;
        this.renderer.resize(v, this.height);
      }
    },
    /**
     * @property    height
     */
    height: {
      "get": function() {
        return this._height;
      },
      "set": function(v) {
        this._height = v;
        // this[PIXI_KEY].height = v;
        this.renderer.resize(this.width, v)
      }
    },
  },
});