/**
 * common.js
 * phina-pixiのパフォーマンステスト 共通処理部分
 *
 * タップすることで64x64のスプライトを大量生成する
 *
 */

'use strict';

var SCREEN_WIDTH = 512;
var SCREEN_HEIGHT = 512;
var FPS = 60;
// var FPS = 120;
var DRAW_FPS = 60;
var SKIP = FPS/DRAW_FPS;
var ASSETS = {
  image: {
    'fox': '../fox64x64.png'
  },
  pixi: {
    'fox': '../fox64x64.png'
  }
};
var FONT_SIZE = 16;
var ADDED_SPRITE = 20;
var counterDisplay = document.getElementById('counterDisplay');

// Sprite生成用
var generateFox = function(x, y, type, texture) {
  var fox;
  var _vector = phina.geom.Vector2(Math.randint(-8, 8), Math.randint(-8, 8));
  var _angVelocity = Math.randint(1, 8);

  if (type === "phina") {
    /* phina object */
    fox = phina.display.Sprite('fox')
    .setPosition(x, y);
    fox.vector = _vector;
    fox.angularVelocity = _angVelocity;

    fox.move = function() {
      fox.position.add(fox.vector);
      fox.rotation += fox.angularVelocity;
    }
  } else {

    /* 純正Pixi版：こちらのほうがちょっと軽い？ */
    // fox = new PIXI.Sprite.fromImage(phina.asset.AssetManager.get('image', 'fox').src);
    // fox.position.set(x, y);
    // fox.anchor.set(0.5, 0.5);
    // fox.scale.set(0.5, 0.5);
    // fox.angularVelocity = _angVelocity.toRadian();

    /* phina.pixi.PixiSprite版 */
    fox = phina.pixi.PixiSprite('fox')
    .setPosition(x, y)
    .setOrigin(0.5, 0.5);
    fox.angularVelocity = _angVelocity;

    fox.vector = _vector;
    fox.move = function() {
      fox.position.set(fox.x+fox.vector.x, fox.y+fox.vector.y);
      fox.rotation += fox.angularVelocity;
    }

    /* test */
    // fox.alpha = Math.randfloat(0.1, 0.9);
    // fox.interactive = true;
    // fox.mousedown = function(){
    //   console.log('dont touch me!')
    // }
  }

  fox.alpha = Math.randfloat(0.1, 0.9);
  fox.reverse = function(dir) {
    fox.vector[dir] = -fox.vector[dir];
  }

  return fox;
}