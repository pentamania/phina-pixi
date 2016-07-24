'use strict';

var SCREEN_WIDTH = 512;
var SCREEN_HEIGHT = 512;
var FPS = 60;
var ASSETS = {
  image: {
    'fox': '../fox64x64.png'
  }
};
var addedFoxes = 20;
var counterDisplay = document.getElementById('counterDisplay');

// Sprite生成用
var generateFox = function(x, y, type) {
  var fox;
  var _vector = phina.geom.Vector2(Math.randint(-8, 8), Math.randint(-8, 8));
  var _angVelocity = Math.randint(1, 8);

  if (type === "phina") {
    fox = phina.display.Sprite('fox')
    .setPosition(x, y);
    fox.vector = _vector;
    fox.angularVelocity = _angVelocity;

    fox.move = function() {
      fox.position.add(fox.vector);
      fox.rotation += fox.angularVelocity;
    }
  } else {

    // Pixi版
    fox = new PIXI.Sprite.fromImage(phina.asset.AssetManager.get('image', 'fox').src);
    fox.position.set(x, y);
    fox.anchor.set(0.5, 0.5);
    fox.vector = _vector;
    fox.angularVelocity = _angVelocity;

    fox.move = function() {
      fox.position.set(fox.x+fox.vector.x, fox.y+fox.vector.y);
      fox.rotation += (fox.angularVelocity).toRadian();
    }

    // test
    // fox.interactive = true;
    // fox.mousedown = function(){
    //   console.log('dont touch me!')
    // }
  }

  fox.reverse = function(dir) {
    fox.vector[dir] = -fox.vector[dir];
  }

  return fox;
}

/*
 * pixi.js 簡易連携用レイヤークラス
*/
phina.define('phina.display.PixiLayer', {
  superClass: 'phina.display.DisplayElement',

  stage: null,
  renderer: null,

  init: function(options) {
    this.superInit();

    this.stage = new PIXI.Container();
    this.renderer = PIXI.autoDetectRenderer(options.width, options.height, {transparent: true});

    this.on('enterframe', function() {
      this.renderer.render(this.stage);
    });
  },

  draw: function(canvas) {
    var domElement = this.renderer.view;
    canvas.context.drawImage(domElement, 0, 0, domElement.width, domElement.height);
  },

  addChild: function(pixiObject){
    this.stage.addChild(pixiObject);
    return this;
  },

  removeChild: function(pixiObject){
    this.stage.removeChild(pixiObject);
    return this;
  }
});


/*
 * pixi.js連携用コアクラス
*/
phina.define('phina.display.PixiApp', {
  superClass: 'phina.display.DomApp',

  renderer: null,
  domElement: null,

  init: function(options) {

    var options = (options || {}).$safe(phina.display.CanvasApp.defaults);
    var bg = options.backgroundColor;
    this.renderer = PIXI.autoDetectRenderer(options.width, options.height, {
      // transparent: (bg) ? false : true
    });
    // if (bg) this.renderer.backgroundColor = bg;
    options.domElement  = this.renderer.view;

    this.superInit(options);

    // Canvas設定
    this.canvas = phina.graphics.Canvas();
    this.canvas.canvas = this.canvas.domElement = this.domElement;
    this.canvas.setSize(options.width, options.height);

    document.body.appendChild(this.domElement);
    if (options.fit) this.canvas.fitScreen(true);

    this.replaceScene(phina.app.PixiScene());
  },

  _draw: function(){
    if (this.currentScene) this.renderer.render(this.currentScene.stage);
  }
});

/*
 * pixi.js連携用Sceneクラス
*/
phina.define('phina.app.PixiScene', {
  superClass: 'phina.app.Element',
  stage: null,

  init: function(options) {
    this.superInit();

    var options = ({}).$safe(options, phina.app.Object2D.defaults);

    this.stage = new PIXI.Container();
    this.width = options.width;
    this.height = options.height;
    if (options.backgroundColor) {
      this.on('enter', function() {
        this.app.renderer.backgroundColor = options.backgroundColor;
      });
    }
  },

  addChild: function(pixiObject){
    this.stage.addChild(pixiObject);
  },

  removeChild: function(pixiObject){
    this.stage.removeChild(pixiObject);
  }
});

/* ローディング用 仮クラス　*/
phina.define('phina.game.PixiLoadingScene', {
  superClass: 'phina.app.PixiScene',

  init: function(options) {
    this.superInit(options);

    if (options.assets) {
      var phinaLoader = phina.asset.AssetLoader();

      phinaLoader.on('progress', function(e) {
        // ゲージアニメーションなどで進捗状況を知らせる場合はここを更新
      });

      // ロード完了後、イベント発火
      phinaLoader.on('load', function(){
        this.flare('loaded');
      }.bind(this));

      phinaLoader.load(options.assets);
    }
  }
});
