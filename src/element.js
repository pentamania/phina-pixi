import * as phina from "phina.js";
import * as PIXI from "pixi.js";
import {PIXI_KEY} from './const.js';

/* globalizeされた時を考え、Pixi...の接頭辞をつける */

/**
 * phina.pixi.PixiElement
 * @class   PixiElement
 * @extends phina.app.Element
 * 基本抽象クラス
 *
 * @param {void}
*/
export const PixiElement = phina.createClass({
// phina.define('phina.pixi.PixiElement', {
  superClass: phina.app.Element,

  init: function() {
    this.superInit();
    this[PIXI_KEY] = null;
  },

  /**
   * @override
   */
  addChild: function(child) {
    if (child.parent) parent.removeChild(child);

    if (child[PIXI_KEY] === undefined) {
      // 純正pixiオブジェクト
      console.warn('[phina-pixi.js]: PixiElement child is recommended to extend PixiDisplayElement', child);
      this[PIXI_KEY].addChild(child);
      // @fixme: phinaの_updateElementに引っかかるため、仮関数を用意
      child.has = function() {};
    } else {
      // if (child.parent) child.remove();
      this[PIXI_KEY].addChild(child[PIXI_KEY]);
      child.has('added') && child.flare('added');
      child.parent = this;
    }
    this.children.push(child);

    return this;
  },

  /**
   * @override
   */
  removeChild: function(child) {
    var index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      if (child[PIXI_KEY] === undefined) {
        // 純正pixiオブジェクト
        this[PIXI_KEY].removeChild(child);
        if (child.has) child.has = null;
      } else {
        this[PIXI_KEY].removeChild(child[PIXI_KEY]);
        child.has('removed') && child.flare('removed');
        child.parent = null;
      }
    }

    return this;
  },

  /**
   * getPixiChildren
   * pixi側には利便のため、直接追加したもの以外も含まれる
   * @return {Array}
   */
  getPixiChildren: function() {
    return this[PIXI_KEY].children;
  },

});

/**
 * phina.pixi.PixiScene
 * @class   PixiScene
 * @extends PixiElement
 * PixiApp用Scene
 *
 * @param object
*/
export const PixiScene = phina.createClass({
// phina.define('phina.app.PixiScene', {
  superClass: PixiElement,

  init: function(options) {
    this.superInit();

    options = ({}).$safe(options, phina.app.Object2D.defaults);
    this[PIXI_KEY] = this.stage = new PIXI.Container();
    this.width = this.stage.width = options.width;
    this.height = this.stage.height = options.height;
  },
});

/**
 * phina.pixi.PixiDisplayElement
 * @class   PixiDisplayElement
 * @extends PixiElement
 *
*/
export const PixiDisplayElement = phina.createClass({
// phina.define('phina.pixi.DisplayElement', {
  superClass: PixiElement,

  init: function(pixiObject, options) {
    this.superInit();
    if (pixiObject) {
      this[PIXI_KEY] = pixiObject;
      // this.setSize(this[PIXI_KEY].width*2, this[PIXI_KEY].height*2)
      // this.setSize(this[PIXI_KEY].width, this[PIXI_KEY].height)
    } else {
      this[PIXI_KEY] = new PIXI.Container();
    }

    this.scale = phina.geom.Vector2(1, 1);
    this.origin = phina.geom.Vector2(0.5, 0.5);

    options = ({}).$safe(options, phina.app.Object2D.defaults);
    this._width = this[PIXI_KEY].width;
    this._height = this[PIXI_KEY].height;
    this.x = options.x;
    this.y = options.y;
    this.alpha = options.alpha || 1;
    this.scaleX = options.scaleX;
    this.scaleY = options.scaleY;
    this.rotation = options.rotation;
    this.originX = options.originX;
    this.originY = options.originY;

    // this._filters = {};
    this
  },

  activateInteraction: function() {
    this.setInteractive(true);
    this._setUpInteraction();
    return this;
  },

  /**
   * _setUpInteraction
   * 無理やりインタラクション設定（仮）
   * phina側のinteractionは常にfalseになってること
   */
  _setUpInteraction: function() {
    ['mousedown', 'touchstart'].forEach(function(event) {
      this[PIXI_KEY].on(event, function(e) {
        if (this[PIXI_KEY].interactive) {
          this.flare('pointstart');
        }
      }.bind(this));
    }.bind(this));

    ['mouseup', 'touchend'].forEach(function(event) {
      this[PIXI_KEY].on(event, function(e) {
        if (this[PIXI_KEY].interactive) {
          this.flare('pointend');
        }
      }.bind(this));
    }.bind(this));

    ['mouseover', 'touchmove'].forEach(function(event) {
      this[PIXI_KEY].on(event, function(e) {
        if (this[PIXI_KEY].interactive) {
          this.flare('pointmove');
        }
      }.bind(this));
    }.bind(this));
  },

  setInteractive: function(flag, type) {
    this.interactive = flag;
    if (type) {
      this.boundingType = type;
    }
    return this;
  },

  setPosition: function(x, y) {
    this[PIXI_KEY].position.x = x;
    this[PIXI_KEY].position.y = y;
    return this;
  },

  setAlpha: function(v) {
    this.alpha = v;
    return this;
  },

  setSize: function(width, height) {
    this.width = width;
    this.height = height;
    return this;
  },

  setScale: function(x, y) {
    this.scaleX = x;
    if (arguments.length <= 1) {
      this.scaleY = x;
    } else {
      this.scaleY = y;
    }
    return this;
  },

  setRotation: function(angle) {
    this.rotation = angle;
    return this;
  },

  setOrigin: function(x, y) {
    this.originX = x;
    if (arguments.length <= 1) {
      y = x;
    }
    this.originY = y;
    return this;
  },

  setVisible: function(flag) {
    this.visible = flag;
    return this;
  },

  clearFilter: function() {
    this[PIXI_KEY].filters = [];
    return this;
  },

  /**
   * addFilter
   * フィルターを個別に追加
   * clearをtrueでリセット
   * @param {PIXI.Filter} filter
   * @param {boolean} clear
   * @return this
   */
  addFilter: function(filter, clear) {
    if (clear) this.clearFilter();
    // if (filterName) this._filters[filterName] = filter;

    if (this[PIXI_KEY].filters != null) {
      // すでにfilters arrayがあった場合： pushではうまくセットできない
      var newFilters = this[PIXI_KEY].filters.concat([filter]);
      this[PIXI_KEY].filters = newFilters;
    } else {
      this[PIXI_KEY].filters = [filter];
    }
    return this;
  },

  /**
   * setFilters
   * フィルターを配列もしくは可変長引数でセット
   * @param {PIXI.Filter[] | ...PIXI.Filter} filters
   * @return this
   */
  setFilters: function(filters) {
    if (Array.isArray(filters)) {
      this[PIXI_KEY].filters = filters;
    } else {
      filters = Array.prototype.slice.call(arguments);
      this[PIXI_KEY].filters = filters;
    }
    return this;
  },

  _accessor: {
    /**
     * @property    x
     * 位置x
     * @return Number
     */
    x: {
      get: function() { return this[PIXI_KEY].position.x; },
      set: function(v) { this[PIXI_KEY].position.x = v; }
    },

    /**
     * @property    y
     * 位置y
     * @return Number
     */
    y: {
      get: function() { return this[PIXI_KEY].position.y; },
      set: function(v) { this[PIXI_KEY].position.y = v; }
    },

    /**
     * @property    position
     * 位置
     * @return PIXI.Point
     */
    position: {
      get: function() { return this[PIXI_KEY].position; },
    },

    /**
     * @property    width
     * width
     */
    width: {
      "get": function() {
        return this._width;
      },
      "set": function(v) {
        this._width = v;
        this[PIXI_KEY].width = v;
      }
    },
    /**
     * @property    height
     * height
     */
    height: {
      "get": function() {
        return this._height;
        // return this[PIXI_KEY].height;
        // return (this.boundingType === 'rect') ?
        //   this._height : this._diameter;
      },
      "set": function(v) {
        this._height = v;
        this[PIXI_KEY].height = v;
      }
    },

    /**
     * @property    originX
     * x座標値
     */
    originX: {
      "get": function() { return this.origin.x; },
      "set": function(v) {
        this.origin.x = v;
        // this[PIXI_KEY].pivot.x = v * this.width;
        if (this[PIXI_KEY].anchor) {
          this[PIXI_KEY].anchor.x = v;
        } else {
          this[PIXI_KEY].pivot.x = this.width * v;
        }
      }
    },

    /**
     * @property    originY
     * y座標値
     */
    originY: {
      "get": function() { return this.origin.y; },
      "set": function(v) {
        this.origin.y = v;
        // this[PIXI_KEY].pivot.y = v * this.height;
        if (this[PIXI_KEY].anchor) {
          this[PIXI_KEY].anchor.y = v;
        } else {
          this[PIXI_KEY].pivot.y = this.height * v;
        }
      }
    },

    /**
     * @property    scaleX
     * スケールX値
     */
    scaleX: {
      "get": function()   { return this[PIXI_KEY].scale.x; },
      "set": function(v)  { this[PIXI_KEY].scale.x = v; }
    },

    /**
     * @property    scaleY
     * スケールY値
     */
    scaleY: {
      "get": function() { return this[PIXI_KEY].scale.y; },
      "set": function(v) { this[PIXI_KEY].scale.y = v; }
    },

    /**
     * @property    radius TODO
     * 半径
     */
    radius: {
      "get": function() {
        return (this.boundingType === 'rect') ?
          (this.width+this.height)/4 : this._radius;
      },
      "set": function(v) {
        this._radius = v;
        this._diameter = v*2;
        if (this.boundingType === 'circle') {
          this[PIXI_KEY].width = this._diameter * this._scale.x;
          this[PIXI_KEY].height = this._diameter * this._scale.y;
        }
      },
    },

    /**
     * @property    rotation
     * 回転
     */
    rotation: {
      "get": function() {
        return this[PIXI_KEY].rotation.toDegree();
      },
      "set": function(deg) {
        this[PIXI_KEY].rotation = deg.toRadian();
      },
    },

    /**
     * @property    alpha
     * 透明度
     */
    alpha: {
      "get": function() {
        return this[PIXI_KEY].alpha;
      },
      "set": function(v) {
        this[PIXI_KEY].alpha = v;
      },
    },

    /**
     * @property    visible
     */
    visible: {
      "get": function() {
        return this[PIXI_KEY].visible;
      },
      "set": function(v) {
        this[PIXI_KEY].visible = v;
      },
    },

    /**
     * @property    interactive
     */
    interactive: {
      // "get": function()   { return this[PIXI_KEY].interactive; },
      "set": function(v) {
        this[PIXI_KEY].interactive = v;
      }
    },

    /**
     * @property    mask
     */
    mask: {
      "get": function() { return this[PIXI_KEY].mask; },
      "set": function(v) {
        this[PIXI_KEY].mask = v;
      }
    },

    /**
     * @property    tint
     * PIXI.container、PIXI.DisplayObject等では無効
     */
    tint: {
      "get": function() { return this[PIXI_KEY].tint; },
      "set": function(v) {
        if (typeof v === 'string') {
          if (v.indexOf("#") !== -1) v = v.slice(1);
          v = parseInt(v, 16);
        }
        this[PIXI_KEY].tint = v;
      }
    },

    /**
     * @property    blendMode
     * PIXI.container、PIXI.DisplayObject等では無効
     */
    blendMode: {
      "get": function() { return this[PIXI_KEY].blendMode; },
      "set": function(v) {
        if (typeof v === 'string') {
          v = PIXI.BLEND_MODES[v];
        }
        this[PIXI_KEY].blendMode = v;
      }
    },

    /**
     * @property    filters
     */
    filters: {
      "get": function() { return this[PIXI_KEY].filters; },
      // "get": function() { return this_filters; },
      "set": function(v) {
        this[PIXI_KEY].filters = v;
      }
    },

    /**
     * @property    worldTransform
     * readonly
     */
    worldTransform: {
      "get": function() { return this[PIXI_KEY].worldTransform; },
    },

    /**
     * @property    hitArea
     * readonly?
     */
    hitArea: {
      "get": function() { return this[PIXI_KEY].hitArea; },
    },

    /**
     * @TODO
     */
//     /**
//      * @property    top
//      * 左
//      */
//     top: {
//       "get": function()   { return this.y - this.height*this.originY; },
//       "set": function(v)  { this.y = v + this.height*this.originY; },
//     },

//     /**
//      * @property    right
//      * 左
//      */
//     right: {
//       "get": function()   { return this.x + this.width*(1-this.originX); },
//       "set": function(v)  { this.x = v - this.width*(1-this.originX); },
//     },

//     /**
//      * @property    bottom
//      * 左
//      */
//     bottom: {
//       "get": function()   { return this.y + this.height*(1-this.originY); },
//       "set": function(v)  { this.y = v - this.height*(1-this.originY); },
//     },

//     /**
//      * @property    left
//      * 左
//      */
//     left: {
//       "get": function()   { return this.x - this.width*this.originX; },
//       "set": function(v)  { this.x = v + this.width*this.originX; },
//     },

//     /**
//      * @property    centerX
//      * centerX
//      */
//     centerX: {
//       "get": function()   { return this.x + this.width/2 - this.width*this.originX; },
//       "set": function(v)  {
//         // TODO: どうしようかな??
//       }
//     },

//     /**
//      * @property    centerY
//      * centerY
//      */
//     centerY: {
//       "get": function()   { return this.y + this.height/2 - this.height*this.originY; },
//       "set": function(v)  {
//         // TODO: どうしようかな??
//       }
//     },
//   }
  },
});
