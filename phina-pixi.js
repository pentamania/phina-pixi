
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
 * pixi.js 簡易連携用レイヤークラス　（パーティクルコンテナ版）
*/
phina.define('phina.display.PixiParticleLayer', {
  superClass: 'phina.display.PixiLayer',

  init: function(options) {
    this.superInit(options);

    this.stage = new PIXI.ParticleContainer();
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
    if (bg) this.renderer.backgroundColor = bg;
    options.domElement = this.renderer.view;

    this.superInit(options);

    // Set up Canvas
    this.canvas = phina.graphics.Canvas();
    this.canvas.canvas = this.canvas.domElement = this.domElement;
    this.canvas.setSize(options.width, options.height);

    // Append and fit
    if (options.parentElement){
      this.parentElement = options.parentElement
      options.parentElement.appendChild(this.domElement);
      if (options.fit) this.fitParent(true);
    } else {
      document.body.appendChild(this.domElement);
      if (options.fit) this.canvas.fitScreen(true);
    }

    // 描画スキップ機能
    this.doDraw = true;
    this.skip = options.skip || 1;
    this.on('enterframe', function() {
      this.doDraw = this.frame % this.skip === 0;
    });

    // Temp scene
    this.replaceScene(phina.app.PixiScene());
  },

  _draw: function(){
    if (this.currentScene) {
      //   this.renderer.render(this.currentScene.stage);
      if (this.doDraw) this.renderer.render(this.currentScene.stage);
    }
  },

  // fitScreenの応用: 親要素のサイズに合わせて拡大縮小
  fitParent: function(isEver) {
    var isEver = isEver === undefined ? true : isEver;

    var _fitFunc = function() {
      var e = this.domElement;
      var s = e.style;

      s.position = "absolute";
      s.margin = "auto";

      var parentWidth = this.parentElement.offsetWidth;
      var parentHeight = this.parentElement.offsetHeight;
      var rateWidth = e.width/parentWidth;
      var rateHeight= e.height/parentHeight;
      var rate = e.height/e.width;

      if (rateWidth > rateHeight) {
        s.width  = Math.floor(parentWidth)+"px";
        s.height = Math.floor(parentWidth*rate)+"px";
      }
      else {
        s.width  = Math.floor(parentHeight/rate)+"px";
        s.height = Math.floor(parentHeight)+"px";
      }
    }.bind(this);

    _fitFunc();

    // リサイズ時のリスナとして登録しておく
    if (isEver) {
      phina.global.addEventListener("resize", _fitFunc, false);
    }
  }
});

/**
 * pixi.jsオブジェクト ラッパークラス
 *
 * pixiObjectでtweenerをつかう
 * ref: http://github.dev7.jp/b/2015/12/20/phinaadvcal20151220/
*/
phina.define('phina.pixi.Element', {
  superClass: 'phina.app.Element',

  $p: null,

  init: function(options) {
    var options = ({}).$safe(options, phina.app.Object2D.defaults);
    this.superInit(options);
    if (options.pixiObject) {
      this.$p = pixiObject;
    } else {
      this.$p = new PIXI.Container();
    }

    return this;
  },

  // childは同じくPixiElement由来であること
  addChild: function(child) {
    if (child.parent) child.remove();
    this.children.push(child);
    this.$p.addChild(child.$p);
    child.parent = this;

    child.has('added') && child.flare('added');
    return this;
  },

  removeChild: function(child) {
    var index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      this.$p.removeChild(child.$p);
      child.has('removed') && child.flare('removed');
    }
    return this;
  },
});

/**
 * Scene
 * @param  {[type]} options) {                                     this.superInit();                 this.width [description]
 * @param  {[type]} exit:    function(nextLabel, nextArguments) {                     if (!this.app) return     ;                if (arguments.length > 0) {      if (typeof arguments[0] [description]
 * @return {[type]}          [description]
 */
phina.define('phina.pixi.Scene', {
  superClass: 'phina.pixi.Element',

  init: function(options) {
    this.superInit(options);
    this.width = options.width;
    this.height = options.height;

    // 背景色設定
    if (options.backgroundColor) {
      this.on('enter', function() {
        this.app.renderer.backgroundColor = options.backgroundColor;
      });
    }

  },

  exit: function(nextLabel, nextArguments) {
    if (!this.app) return ;

    if (arguments.length > 0) {
      if (typeof arguments[0] === 'object') {
        nextLabel = arguments[0].nextLabel || this.nextLabel;
        nextArguments = arguments[0];
      }

      this.nextLabel = nextLabel;
      this.nextArguments = nextArguments;
    }

    this.app.popScene();

    return this;
  },
});

/**
 *
 */
phina.define('phina.pixi.DisplayElement', {
  superClass: 'phina.display.DisplayElement',

  $p: null,

  init: function(options) {
    this.superInit(options);
    if (options.pixiObject) {
      this.$p = pixiObject;
    } else {
      this.$p = new PIXI.Container();
    }

    this.on('enterframe', function(e) {
      // Elementと必要な情報を同期
      this.$p.position.set(this.x, this.y);
      this.$p.rotation = this.rotation.toRadian();
      this.$p.scale.set(this.scaleX, this.scaleY);
      this.$p.anchor.set(this.originX, this.originY);
      this.$p.pivot.set(this.width*this.originX, this.height*this.originY);
      this.$p.alpha = this.alpha;
    });
  },

  // childは同じくPixiElement由来であること
  addChild: function(child) {
    if (child.parent) child.remove();
    this.children.push(child);
    this.$p.addChild(child.$p);
    child.parent = this;

    child.has('added') && child.flare('added');
    return this;
  },

  removeChild: function(child) {
    var index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      this.$p.removeChild(child.$p);
      child.has('removed') && child.flare('removed');
    }
    return this;
  },

});

/**
 * スプライト表示
 * - tweenerもできる
 * - parentがphina由来でもok
* reference:http://runstant.com/minimo/projects/85b7efe7
*/
phina.define('phina.pixi.Sprite', {
  superClass: 'phina.display.Sprite',


  init: function(image, width, height) {
    this.superInit(image, width, height);

    this.$p = new PIXI.Sprite.fromImage(this.image.src);
    this.$p.anchor.set(0.5, 0.5);

    this.$p.texture.baseTexture.width = this.image.domElement.width;
    this.$p.texture.baseTexture.height = this.image.domElement.height;

    this.on('enterframe', function(e) {
      // Elementと必要な情報を同期
      this.$p.position.set(this.x, this.y);
      this.$p.rotation = this.rotation.toRadian();
      this.$p.scale.set(this.scaleX, this.scaleY);
      this.$p.anchor.set(this.originX, this.originY);
      this.$p.alpha = this.alpha;
    });
  },
});

//==============================

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
    // console.log("using pc",this.stage);
    this.width = options.width;
    this.height = options.height;

    // 背景色設定
    if (options.backgroundColor) {
      this.on('enter', function() {
        this.app.renderer.backgroundColor = options.backgroundColor;
      });
    }
  },
  // update:{},

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

phina.define('phina.pixi.StarShape', {
  superClass: 'phina.display.PlainElement',

  init: function(options) {
    this.superInit(options);

    // this.canvas.star(0, 0, this.radius, this.sides, this.sideIndent)
    this.canvas.fillStar(0, 0, 48, 5, 0.38);
    console.log(this.canvas.domElement)
    var texture = new PIXI.Texture(PIXI.BaseTexture.fromCanvas(this.canvas.domElement));
    this.pixiObject = new PIXI.Sprite(texture);
  }
});

