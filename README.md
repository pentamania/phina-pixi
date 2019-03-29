phina-pixi
===

![Tomaxi](https://user-images.githubusercontent.com/10734131/42134514-380896c6-7d78-11e8-8122-29eb6d80aa04.png)

[phina.js](http://phinajs.com/)の描画に[pixi.js](http://www.pixijs.com/)
を使用するためのプラグインモジュール  
Plugin module for phina.js to use pixi.js as rendering engine.

## Example 
- [Performance test: phina-pixi](https://pentamania.github.io/phina-pixi/performance-test/pixiLayer.html)
- [Performance test: phina.js only](https://pentamania.github.io/phina-pixi/performance-test/phinaSprite.html)

## Sample 

### In browser

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="IE=Edge">
  <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
  <title>phina-pixi sample</title>
</head>
<body>

<!-- load libraries -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.8.1/pixi.min.js"></script>
<script src='https://cdn.jsdelivr.net/npm/phina.js@0.2.2/build/phina.min.js'></script>
<script src='https://cdn.jsdelivr.net/npm/phina-pixi@latest/dist/phina-pixi.min.js'></script>

<script>

// phina.globalize();

phina.define('MainScene', {
  superClass: 'phina.display.DisplayScene',

  init: function(options) {
    this.superInit(options);

    // Layer
    this.pixiLayer = phina.pixi.PixiLayer(options)
    // this.pixiLayer = PixiLayer(options) // when phina.globalize()
    .addChildTo(this)
    
    // Sprite
    phina.pixi.PixiSprite("logo")
    // PixiSprite('logo') // when phina.globalize()
    .setPosition(this.width*0.5, this.height*0.5)
    .addChildTo(this.pixiLayer);
  },
});

phina.main(function() {
  var app = phina.game.GameApp({
    startLabel: 'main',
    assets: {
      // Use dedicated loader
      pixi: {
        logo: 'https://cdn.jsdelivr.net/npm/phina.js@0.2.2/logo.png',
      }
    }
  });

  app.run();
});
</script>
</body>
</html>
```

### As module

#### Install
```npm install pixi.js phina.js```

```npm install phina-pixi```


#### Usage
```js
import * as phina from 'phina.js';
import {PixiLayer, PixiSprite} from 'phina-pixi';

phina.define('MainScene', {
  superClass: 'phina.display.DisplayScene',

  init: function(options) {
    this.superInit(options);

    // Layer
    this.pixiLayer = PixiLayer(options)
    .addChildTo(this)
    
    // Sprite
    PixiSprite("logo")
    .setPosition(this.width*0.5, this.height*0.5)
    .addChildTo(this.pixiLayer);
  },
});

phina.main(function() {
  var app = phina.game.GameApp({
    startLabel: 'main',
    assets: {
      // Use dedicated loader
      pixi: {
        logo: 'https://cdn.jsdelivr.net/npm/phina.js@0.2.2/logo.png',
      }
    }
  });

  app.run();
});
```

### CDN
[https://cdn.jsdelivr.net/npm/phina-pixi@latest/dist/phina-pixi.min.js](https://cdn.jsdelivr.net/npm/phina-pixi@latest/dist/phina-pixi.min.js)

### Documentation
[https://pentamania.github.io/phina-pixi/docs](https://pentamania.github.io/phina-pixi/docs)

### Download
[https://github.com/pentamania/phina-pixi/releases](https://github.com/pentamania/phina-pixi/releases)

### License
MIT

#### Supported
- phina v0.2.x
- pixi v4.x.x

### Donation
[☺Amazon wish list☺](http://amzn.asia/1NJ5hOd)

### Inspired by
[phina.pixi.js](https://github.com/simiraaaa/phina.pixi.js)
