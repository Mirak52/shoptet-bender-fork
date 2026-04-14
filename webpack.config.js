/** @format */

import path from 'path';
import {glob} from 'glob';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import WebpackObfuscatorPlugin from 'webpack-obfuscator';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';
import webpack from 'webpack';
import 'dotenv/config';

const outputDir = path.resolve(process.cwd(), 'dist');

const extensionsFilenames = {
  js: 'scripts',
  ts: 'scripts',
  tsx: 'scripts',
  scss: 'styles',
  less: 'styles',
  css: 'styles',
  html: 'markup',
};

const getEntries = (extension, isProduction) => {
  const entries = {};
  const folders = ['footer', 'header', 'index'];
  folders.forEach(folder => {
    const files = glob.sync(`./src/${folder}/**/*.${extension}`);
    if (files.length > 0) {
      const foundExtension = files[0].split('.').pop();
      const filename = extensionsFilenames[foundExtension];
      const minExtension = isProduction ? '.min' : '';
      entries[`${filename}.${folder}${minExtension}`] = files.map(str => './' + str);
    }
  });
  console.log(entries)
  return entries;
};

const getGlobalAssetsEntry = () => {
  const entries = {};
  const files = glob.sync('./assets/**/*');
  if (files.length > 0) {
    entries['assets'] = files.map(str => './' + str);
  }
  return entries;
};

export default env => {
  const isProduction = env.production === true;
  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'eval',
    entry: {
      ...getEntries('js', isProduction),
      ...getEntries('{scss,less}', isProduction),
      ...getEntries('css', isProduction),
      // TODO: add html entries
      // TODO: add copy assets entries
      ...getEntries('ts', isProduction),
      ...getEntries('tsx', isProduction),
      ...getGlobalAssetsEntry(),
    },
    output: {
      path: outputDir,
      clean: true,
    },
    plugins: [new MiniCssExtractPlugin(), new RemoveEmptyScriptsPlugin(),
      new webpack.DefinePlugin({
        'process.env.REACT_URL_API': JSON.stringify(isProduction ? process.env.REACT_URL_API_PROD : process.env.REACT_URL_API_DEV),
        'process.env.REACT_URL_ORDER_FINISHED_API': JSON.stringify(isProduction ? process.env.REACT_URL_API_ORDER_FINISH_PROD : process.env.REACT_URL_API_ORDER_FINISH_DEV),
        'process.env.REACT_URL_CART_RESERVATION_CHECK': JSON.stringify(isProduction ? process.env.REACT_URL_CART_RESERVATION_CHECK_PROD : process.env.REACT_URL_CART_RESERVATION_CHECK_DEV),
        'process.env.REACT_URL_DETAIL_RESERVATION_CHECK': JSON.stringify(isProduction ? process.env.REACT_URL_DETAIL_RESERVATION_CHECK_PROD : process.env.REACT_URL_DETAIL_RESERVATION_CHECK_DEV),
        'process.env.REACT_URL_RESERVED_TIMES': JSON.stringify(isProduction ? process.env.REACT_URL_RESERVED_TIMES_PROD : process.env.REACT_URL_RESERVED_TIMES_DEV),
        'process.env.REACT_URL_RENTING_TIMES': JSON.stringify(isProduction ? process.env.REACT_URL_RENTING_TIMES_PROD : process.env.REACT_URL_RENTING_TIMES_DEV),
        'process.env.REACT_URL_API_CHECK_ITEM_RESERVATION': JSON.stringify(isProduction ? process.env.REACT_URL_API_CHECK_ITEM_RESERVATION_PROD : process.env.REACT_URL_API_CHECK_ITEM_RESERVATION_DEV),
        'process.env.REACT_URL_API_GET_SERVICE_SLOTS': JSON.stringify(isProduction ? process.env.REACT_URL_API_GET_SERVICE_SLOTS_PROD : process.env.REACT_URL_API_GET_SERVICE_SLOTS_DEV),
        'process.env.REACT_URL_CHECK_ORDER_CONTENT': JSON.stringify(isProduction ? process.env.REACT_URL_CHECK_ORDER_CONTENT_PROD : process.env.REACT_URL_CHECK_ORDER_CONTENT_DEV),
        'process.env.REACT_URL_ESHOP_RESERVATION_ITEMS': JSON.stringify(isProduction ? process.env.REACT_URL_ESHOP_RESERVATION_ITEMS_PROD : process.env.REACT_URL_ESHOP_RESERVATION_ITEMS_DEV),
        'process.env.REACT_URL_VALIDATE_COUPON': JSON.stringify(isProduction ? process.env.REACT_URL_VALIDATE_COUPON_PROD : process.env.REACT_URL_VALIDATE_COUPON_DEV),                                
        'process.env.REACT_URL_REDEEM_COUPON': JSON.stringify(isProduction ? process.env.REACT_URL_REDEEM_COUPON_PROD : process.env.REACT_URL_REDEEM_COUPON_DEV),
        'process.env.REACT_URL_FRONTEND_CUSTOMIZATION': JSON.stringify(isProduction ? process.env.REACT_URL_FRONTEND_CUSTOMIZATION_PROD : process.env.REACT_URL_FRONTEND_CUSTOMIZATION_DEV),
        'process.env.REACT_DSN_SENTRY': JSON.stringify(process.env.SENTRY_DSN ?? ''),
        'process.env.REACT_URL_EVENT_SEATMAP': JSON.stringify(isProduction ? process.env.REACT_URL_EVENT_SEATMAP_PROD : process.env.REACT_URL_EVENT_SEATMAP_DEV),
        'process.env.REACT_URL_EVENT_LOCK_SEATS': JSON.stringify(isProduction ? process.env.REACT_URL_EVENT_LOCK_SEATS_PROD : process.env.REACT_URL_EVENT_LOCK_SEATS_DEV),
        'process.env.REACT_URL_EVENT_UNLOCK_SEATS': JSON.stringify(isProduction ? process.env.REACT_URL_EVENT_UNLOCK_SEATS_PROD : process.env.REACT_URL_EVENT_UNLOCK_SEATS_DEV),
        'process.env.REACT_URL_EVENT_AVAILABILITY': JSON.stringify(isProduction ? process.env.REACT_URL_EVENT_AVAILABILITY_PROD : process.env.REACT_URL_EVENT_AVAILABILITY_DEV),
        'process.env.REACT_URL_EVENT_OCCURRENCES': JSON.stringify(isProduction ? process.env.REACT_URL_EVENT_OCCURRENCES_PROD : process.env.REACT_URL_EVENT_OCCURRENCES_DEV)
    
      })
    ],
    ...(isProduction && {
      optimization: {
        minimize: true,
        minimizer: [
          new WebpackObfuscatorPlugin({
            rotateStringArray: true,
          }),
          new CssMinimizerPlugin(),
        ],
      },
    }),
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: 'ts-loader'
        },
        {
          test: /\.less$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
        },
        {
          test: /\.scss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {loader: 'sass-loader', options: {sassOptions: {outputStyle: 'expanded'}}},
          ],
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff2?|ttf|eot)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext]',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json']
    }
  };
};
