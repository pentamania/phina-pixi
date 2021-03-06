import * as phina from "phina.js";
import * as PIXI from "pixi.js";
import {toHex} from "./utils.js";
import {PixiScene} from './element.js';
var defaultParams = {
  width: 640,
  height: 960,
  fit: true,
  append: true,
};

/**
 * <pre>
 * Create app core using pixi.js's renderer for rendering.
 * レンダラーとしてpixi.js rendererを使うAppコアクラス
 * </pre>
 *
 * @class phina.pixi.PixiApp
 * @memberOf phina.pixi
 * @extends phina.display.DomApp
 *
 * @param {object} options - parameter almost same as phina.display.CanvasApp
*/
export default phina.createClass({
  superClass: phina.display.DomApp,

  init: function(options) {
    options = ({}).$safe(options, defaultParams);
    var bg = toHex(options.backgroundColor);
    var forceCanvas = options.forceCanvas || false;

    var domElement = options.domElement;
    if (!domElement && options.query) {
      domElement = document.querySelector(options.query);
    }
    var renderer = PIXI.autoDetectRenderer(options.width, options.height, {
      transparent: (bg != null) ? null : true,
      forceCanvas: forceCanvas, // for recent pixi
      view: domElement,
    }, forceCanvas); // for legacy pixi
    if (bg != null) renderer.backgroundColor = bg;
    options.domElement = renderer.view;

    this.superInit(options);
    this.renderer = renderer;
    this.canvas = this.domElement;
    phina.graphics.Canvas.prototype.setSize.call(this, options.width, options.height);
    if (!domElement && !options.query && options.append) {
      document.body.appendChild(this.domElement);
    }

    if (options.fit) {
      phina.graphics.Canvas.prototype.fitScreen.call(this);
    }

    if (options.startScene) {
      this.replaceScene(options.startScene(options));
    } else {
      this.replaceScene(PixiScene(options));
    }

    if (options.pixelated) {
      // チラつき防止
      // https://drafts.csswg.org/css-images/#the-image-rendering
      this.domElement.style.imageRendering = 'pixelated';
    }

    // pushScene, popScene 対策
    this.on('push', function() {
      // onenter 対策で描画しておく
      this._draw();
    });
  },

  /**
   * Render the stage(container) of currentScene.
   * @private
   * @instance
   * @override
   * @memberof phina.pixi.PixiApp
   * @return {void}
   */
  _draw: function() {
    if (this.currentScene) this.renderer.render(this.currentScene.stage);
  },

  /**
   * Returns whether the current renderer is using webGL.
   * @instance
   * @memberof phina.pixi.PixiApp
   * @return {boolean}
   */
  usingWebGL: function() {
    return this.renderer instanceof PIXI.WebGLRenderer;
  },

  _static: {

    /**
     * Default parameter of phina.pixi.PixiApp
     * @static
     * @memberof phina.pixi.PixiApp
     */
    defaults: defaultParams,
  },
})