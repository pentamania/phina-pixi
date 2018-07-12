import * as phina from "phina.js";
import * as PIXI from "pixi.js";
import {PIXI_KEY} from './const.js';
import {PixiDisplayElement} from './element.js';
import {toHex} from "./utils.js";

var defaultParams = {
  fontFamily: 'meirio, monospace, sans-serif',
  fill: "black",
  stroke: null,
  strokeWidth: 2,
  text: 'Hello world!',
  fontSize: 32,
  fontWeight: '',
  align: 'center',
  baseline: 'alphabetic',
  lineHeight: 1.2,
};

/**
 * <pre>
 * テキスト描画クラス
 * Text rendering wrapper class.
 * Another name: <strong>phina.pixi.PixiText</strong>
 * </pre>
 *
 * @todo  Add all properties
 * @class   phina.pixi.PixiLabel
 * @memberOf phina.pixi
 * @extends PixiDisplayElement
 *
 * @param  {Object} params
 *
 * @property {object} style - <Readonly> Style of pixi.object
 * @property {string} text - text content
 * @property {string} font - <Readonly> Font Property of pixi.object
 * @property {string} fontFamily
 * @property {number} fontSize
 * @property {number} fontWeight
 *
 */
export default phina.createClass({
  superClass: PixiDisplayElement,

  init: function(options) {
    if (typeof arguments[0] !== 'object') {
      options = { text: arguments[0] };
    } else {
      options = arguments[0];
    }
    options = ({}).$safe(options, defaultParams);
    this.superInit(new PIXI.Text(options.text, new PIXI.TextStyle(options)));

    /**
     * @todo:accessor設定予定
     * 超絶重くなるのでenterframeで同期させない
     */
    // this[PIXI_KEY].style = {
      // align: this.align,
      // breakWords: false,
      // dropShadow: false,
      // dropShadowAngle: Math.PI / 6,
      // dropShadowBlur: 0,
      // dropShadowColor: '#000000',
      // dropShadowDistance: 5,
      // fillGradientType: CONST.TEXT_GRADIENT.LINEAR_VERTICAL,
      // fontStyle: this.fontStyle || 'normal',
      // fontVariant: 'normal',
      // letterSpacing: this.letterSpacing || 0,
      // lineHeight: this.lineHeight, //設定すると消える...
      // lineJoin: this.lineJoin || 'miter',
      // miterLimit: this.miterLimit,
      // padding: 0,
      // strokeThickness: this.strokeWidth,
      // textBaseline: this.baseline,
      // wordWrap: false,
      // wordWrapWidth: 100
    // };
  },

  _accessor: {
    style: {
      get: function() { return this[PIXI_KEY].style; },
    },
    text: {
      get: function() { return this._text; },
      set: function(v) {
        this._text = v;
        this[PIXI_KEY].text = v;
        this._lines = (this.text + '').split('\n');
      },
    },
    font: {
      get: function() {
        return "{fontWeight} {fontSize}px {fontFamily}".format(this);
      },
    },
    fontFamily: {
      get: function() { return this[PIXI_KEY].style.fontFamily; },
      set: function(v) {
        this[PIXI_KEY].style.fontFamily = v;
      },
    },
    fontSize: {
      get: function() { return this[PIXI_KEY].style.fontSize; },
      set: function(v) {
        this[PIXI_KEY].style.fontSize = v;
      },
    },
    fontWeight: {
      get: function() { return this[PIXI_KEY].style.fontWeight; },
      set: function(v) {
        this[PIXI_KEY].style.fontWeight = v;
      },
    },

    // 色指定はhex以外でもOKになった？
    fill: {
      get: function() { return this[PIXI_KEY].style.fill; },
      set: function(v) {
        // this[PIXI_KEY].style.fill = toHex(v);
        this[PIXI_KEY].style.fill = v;
      },
    },
    stroke: {
      get: function() { return this[PIXI_KEY].style.stroke; },
      set: function(v) {
        this[PIXI_KEY].style.stroke = v;
      },
    },

    strokeWidth: {
      get: function() { return this[PIXI_KEY].style.strokeThickness; },
      set: function(v) {
        this[PIXI_KEY].style.strokeThickness = v;
      },
    },

    /**
     * strokeThickness
     * same as strokeWidth
     */
    strokeThickness: {
      get: function() { return this[PIXI_KEY].style.strokeThickness; },
      set: function(v) {
        this[PIXI_KEY].style.strokeThickness = v;
      },
    },

    /* …その他todo.. */

  },

  _static: {
    defaults: defaultParams,
  },
});