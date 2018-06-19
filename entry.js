import * as pp from './src';
window.phina.pixi = pp;
export * from './src';

/**
 * commonJS style
 * 期待通りに動作する
 */
// const PixiLayer = require('./src/Layer.js').default;
// const {PixiScene, PixiElement} = require('./src/element.js');

// const exported = {
//   PixiLayer,
//   PixiScene, PixiElement,
// };

// phina.pixi = exported;
// module.exports = exported;
