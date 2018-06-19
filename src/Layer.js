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
// phina.define('phina.display.PixiLayer', {
  superClass: PixiDisplayElement,

  renderer: null,

  init: function(options) {
    this.superInit(null, options);

    this.renderer = PIXI.autoDetectRenderer(options.width, options.height, {transparent: true});

    this.on('enterframe', function() {
      this.renderer.render(this[PIXI_KEY]);
    });
  },

  draw: function(canvas) {
    var domElement = this.renderer.view;
    canvas.context.drawImage(domElement, 0, 0, domElement.width, domElement.height);
  },
});