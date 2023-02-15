const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
// const cors = require('cors');

const app = express();
// app.use(cors());
const config = require("./webpack.config.js");
const compiler = webpack(config);

const port = process.env.FRONT_PORT || 3000;

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

app.listen(port, () => {
  console.log(`App listening on port ${port}!\n`);
});
