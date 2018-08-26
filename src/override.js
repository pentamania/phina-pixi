import * as phina from "phina.js";
import * as PIXI from "pixi.js";

/**
 * pixi側elementがhasを持っていないので存在確認追加
 */
phina.app.Updater.prototype._updateElement = function(element) {
  var app = this.app;

  // awakeの存在確認
  if (element.awake && element.awake === false) return ;

  // hasの存在確認
  if (element.has && element.has('enterframe')) {
    element.flare('enterframe', {
      app: this.app,
    });
  }

  if (element.update) element.update(app);

  var len = element.children.length;
  if (element.children.length > 0) {
    var tempChildren = element.children.slice();
    for (var i=0; i<len; ++i) {
      this._updateElement(tempChildren[i]);
    }
  }
}

/**
 * PIXI extend Rectangle.set
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 */
PIXI.Rectangle.prototype.set = function(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

/**
 * FrameAnimation override
 *
 */
phina.accessory.FrameAnimation.prototype._updateFrame = function(element) {
  var anim = this.currentAnimation;
  if (anim) {
    if (this.currentFrameIndex >= anim.frames.length) {
      if (anim.next) {
        this.gotoAndPlay(anim.next);
        return ;
      }
      else {
        this.paused = true;
        this.finished = true;
        this.flare('finished'); // add
        return ;
      }
    }
  }

  var index = anim.frames[this.currentFrameIndex];
  var frame = this.ss.getFrame(index);
  // modified
  if (this.target.srcRect) {
    this.target.srcRect.set(frame.x, frame.y, frame.width, frame.height);
  } else {
    this.target.setFrameIndex(index, frame.width, frame.height)
  }

  if (this.fit) {
    this.target.width = frame.width;
    this.target.height = frame.height;
  }
}