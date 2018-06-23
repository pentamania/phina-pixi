# phina-pixi
phina.jsとpixi.jsを連携するためのプラグインモジュール  
Plugin module for phina.js and pixi.js coordination.

### Support
- phina v0.2.x
- pixi v4.x.x

### Sample (in browser)

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="IE=Edge">
  <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
  <title>phina-pixi sample</title>
</head>
<body>

<script src='./path/to/phina.js'></script>
<script src='./path/to/phina-pixi.js'></script>

<script>
phina.globalize();

phina.define('MainScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    this.superInit(options);

    // Layer
    this.pixiLayer = PixiLayer(options).addChildTo(this);
    // this.pixiLayer = phina.pixi.PixiLayer(options).addChildTo(this); // no globalize

    // Sprite
    PixiSprite('player')
    // phina.pixi.PixiSprite('player') // no globalize
    .addChildTo(this.pixiLayer);
  },
});

phina.main(function() {
  var app = GameApp({
    startLabel: 'main',
    assets: {
      pixi: {
        player: "./assets/player.png"
      }
    }
  });

  app.run();
});
</script>
</body>
</html>
```

### Sample (es modules)
#### Install
```npm i -S pentamania/phina-pixi```

※ phina.js, pixi.jsがインストール済みであること

#### Usage
```js
import * as phina from 'phina.js';
import {PixiLayer, PixiSprite} from 'phina-pixi';

phina.globalize();

phina.define('MainScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    this.superInit(options);

    // Layer
    this.pixiLayer = PixiLayer(options).addChildTo(this);

    // Sprite
    PixiSprite('player')
    .addChildTo(this.pixiLayer);
  },
});

phina.main(function() {
  var app = GameApp({
    startLabel: 'main',
    assets: {
      pixi: {
        player: "./assets/player.png"
      }
    }
  });

  app.run();
});
```

## License
MIT

## Reference
[phina.pixi.js (similar plugin for pixi v3)](https://github.com/simiraaaa/phina.pixi.js)
