const webpack = require("webpack");
const path = require('path');
const pkg = require('./package.json');

const banner = `
${pkg.name} ${pkg.version}
${pkg.license} Licensed

Copyright (C) ${pkg.author}, ${pkg.homepage}
`;

const srcPath = path.resolve(__dirname, 'entry.js');
const distPath = path.resolve(__dirname, 'dist');

const isProduction = (process.env.NODE_ENV != null && process.env.NODE_ENV.trim() === "production");
const buildMode = (isProduction) ? 'production': 'development';
const filename = (isProduction) ? `${pkg.name}.min.js` : `${pkg.name}.js`;

module.exports = {
  mode: buildMode,
  entry: srcPath,
  output: {
    path: distPath,
    filename: filename,

    /* webpack v4のエラー？: UMDのときはglobalをthisにしないとwebかbroswerどちらかからしか読み込めない
      https://github.com/webpack/webpack/issues/6522
    */
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: banner,
    })
  ],
  externals: {
    // [lib-name]: [var name]
    // 'phina.js': 'phina',
    // 'pixi.js': 'PIXI',

    'phina.js': {
      commonjs: 'phina.js',
      commonjs2: 'phina.js',
      amd: 'phina.js',
      root: 'phina', // windowでのglobalオブジェクト
    },

    'pixi.js': {
      commonjs: 'pixi.js',
      commonjs2: 'pixi.js',
      amd: 'pixi.js',
      root: 'PIXI'
    },
  },
};