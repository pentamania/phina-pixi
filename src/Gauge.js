import * as phina from "phina.js";
import * as PIXI from "pixi.js";
import {PIXI_KEY} from './const.js';
import {PixiDisplayElement} from './element.js';
import {toHex} from "./utils.js";

/**
 * <pre>
 * Alternative of phina.ui.Gauge class
 * </pre>
 *
 * @class   phina.pixi.PixiGauge
 * @memberOf phina.pixi
 * @extends phina.pixi.PixiDisplayElement
 *
 * @param  {Object} params - todo
 */
export default phina.createClass({
  superClass: PixiDisplayElement,

  _ratio: 1,
  _value: 0,
  _maxWidth: 0,
  _maxValue: 100,
  _minValue: 0,
  color: 0xFFFFFF,
  bgColor: 0x222222,
  // valueUnlimited: false, // @todo

  init: function(params) {
    this.superInit(new PIXI.Graphics());

    this._maxWidth = this.width = params.width;
    this.height = params.height || 20;
    this._maxValue = params.max || 100; // 0はだめ
    this._minValue = params.min || 0;
    this._gaugeAlpha = 1;

    this.value = params.value || 100;
    this.setColor(params.color, params.bgColor);
    this.setOrigin(0, 0.5);

    if (params.ratio != null) {
      this.setRatio(params.ratio);
    }
  },

  /**
   * set the value as ratio
   * @instance
   * @memberof phina.pixi.PixiGauge
   * @todo value should be changed
   *
   * @param {number} v - clamp to 0.0~1.0
   * @return {this}
   */
  setRatio: function(v) {
    v = Math.clamp(v, 0, 1);
    this._ratio = v;
    this._drawGauge();

    return this;
  },

  /**
   * set value
   * @instance
   * @memberof phina.pixi.PixiGauge
   *
   * @param {number} v - clamp to 0.0~1.0
   * @return {this}
   */
  setValue: function(value) {
    value = Math.clamp(value, this._minValue, this._maxValue);
    this._value = value;
    this.ratio = value/this._maxValue;
    this._drawGauge();

    return this;
  },

  /**
   * set gauge and background color
   * @instance
   * @memberof phina.pixi.PixiGauge
   *
   * @param {number|string} color hex
   * @param {number|string} bgColor hex
   * @return {this}
   */
  setColor: function(color, bgColor) {
    if (color != null) {
      if (typeof color === 'string') {
        color = toHex(color);
      }
      this.color = color;
    }

    if (bgColor != null) {
      if (typeof bgColor === 'string') {
        bgColor = toHex(bgColor);
      }
      this.bgColor = bgColor;
    }

    this._drawGauge();
    return this;
  },

  /**
   * set the value to max
   * @instance
   * @memberof phina.pixi.PixiGauge
   * @return {this}
   */
  refill: function() {
    this.value = this.max;
    return this;
  },

  /**
   * set up mask
   * @instance
   * @memberof phina.pixi.PixiGauge
   * @todo: マスクサイズをリサイズする手段
   *
   * @return {this}
   */
  setMask: function() {
    var mask = new PIXI.Graphics();
    mask.beginFill();
    mask.drawRect(0, 0, this.width, this.height);
    mask.endFill();
    mask.x = this._maxWidth;
    mask.y = this.height;

    this.addChild(mask);
    this.mask = mask;
    return this;
  },

  /**
   * update gauge view
   * @private
   * @instance
   * @memberof phina.pixi.PixiGauge
   *
   * @return {void}
   */
  _drawGauge: function() {
    this[PIXI_KEY].clear()
      .beginFill(this.bgColor, 1)
      .drawRect(0, 0, this._maxWidth, this.height)
      .endFill()
      .beginFill(this.color, this._gaugeAlpha)
      .drawRect(0, 0, this._maxWidth*this.ratio, this.height)
      .endFill()
    ;
  },

  _accessor: {
    /*
     * ratio range[0 ~ 1]
     */
    ratio: {
      "get": function() { return this._ratio; },
      "set": function(v) {
        this.setRatio(v);
      }
    },

    value: {
      "get": function() { return this._value; },
      "set": function(v) {
        this.setValue(v);
      }
    },

    max: {
      "get": function() { return this._maxValue; },
      "set": function(v) {
        this._maxValue = v;
      }
    },

    min: {
      "get": function() { return this._minValue; },
      "set": function(v) {
        this._minValue = v;
      }
    },

    isMax: {
      "get": function() { return this._value === this._maxValue; }
    },

    isNeg: {
      "get": function() { return this._value < 0; }
    }
  }
});
