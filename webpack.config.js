const webpack = require("webpack");
const path = require('path');
const pkg = require('./package.json');

const namespace = ["phina", "pixi"];

const banner = `
${pkg.name} ${pkg.version}
${pkg.license} Licensed

Copyright (C) ${pkg.author}, ${pkg.homepage}
`;

const srcPath = path.resolve(__dirname, 'src/index.js');
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
    library: namespace,
    libraryTarget: 'umd',
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: banner,
    })
  ],
  externals: {
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