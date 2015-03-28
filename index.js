/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 kf (7kfpun@gmail.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */
/* jshint node: true */
'use strict';

var through = require('through2');
var gutil = require('gulp-util');

var PLUGIN_NAME = 'gulp-pangu';

var pangu = function() {

  // https://github.com/vinta/paranoid-auto-spacing/blob/master/src/pangu.js#L72-L130
  function insert_space(text) {
    var old_text = text;
    var new_text;

    /*
      Regular Expressions
      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
      Symbols
      ` ~ ! @ # $ % ^ & * ( ) _ - + = [ ] { } \ | ; : ' " < > , . / ?
      3000-303F 中日韓符號和標點
      3040-309F 日文平假名 (V)
      30A0-30FF 日文片假名 (V)
      3100-312F 注音字母 (V)
      31C0-31EF 中日韓筆畫
      31F0-31FF 日文片假名語音擴展
      3200-32FF 帶圈中日韓字母和月份 (V)
      3400-4DBF 中日韓統一表意文字擴展 A (V)
      4E00-9FFF 中日韓統一表意文字 (V)
      AC00-D7AF 諺文音節 (韓文)
      F900-FAFF 中日韓兼容表意文字 (V)
      http://unicode-table.com/cn/
      */

    // 前面"中間"後面 >> 前面 "中間" 後面
    text = text.replace(/([\u3040-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])(["])/ig, '$1 $2');
    text = text.replace(/(["])([\u3040-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/ig, '$1 $2');

    // 避免出現「前面 " 中間" 後面」之類的不對稱的情況
    text = text.replace(/(["']+)(\s*)(.+?)(\s*)(["']+)/ig, '$1$3$5');

    // # 符號需要特別處理
    text = text.replace(/([\u3040-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])(#(\S+))/ig, '$1 $2');
    text = text.replace(/((\S+)#)([\u3040-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/ig, '$1 $3');

    // 前面<中間>後面 --> 前面 <中間> 後面
    old_text = text;
    new_text = old_text.replace(/([\u3040-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([<\[\{\(\u201c]+(.*?)[>\]\}\)\u201d]+)([\u3040-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/ig, '$1 $2 $4');
    text = new_text;
    if (old_text === new_text) {
      // 前面<後面 --> 前面 < 後面
      text = text.replace(/([\u3040-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([<>\[\]\{\}\(\)\u201c\u201d])/ig, '$1 $2');
      text = text.replace(/([<>\[\]\{\}\(\)\u201c\u201d])([\u3040-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/ig, '$1 $2');
    }
    // 避免出現「前面 [ 中間] 後面」之類的不對稱的情況
    text = text.replace(/([<\[\{\(\u201c]+)(\s*)(.+?)(\s*)([>\]\}\)\u201d]+)/ig, '$1$3$5');

    // 中文在前
    text = text.replace(/([\u3040-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([a-z0-9`~@\$%\^&\*\-\+=\|\\\/\u0080-\u00ff\u2022\u2150-\u218f])/ig, '$1 $2');

    // 中文在後
    text = text.replace(/([a-z0-9`~!\$%\^&\*\-\+=\|\\;\:\,\.\/\?\u0080-\u00ff\u2022\u2150-\u218f])([\u3040-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/ig, '$1 $2');

    // 避免「陳上進's something」的 's 前面被加了空格
    text = text.replace(/([\u3040-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])( )(')([a-z])/ig, '$1$3$4');

    return text;
  }

  return through.obj(function(file, enc, cb) {

    if (file.isStream()) {
      return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isBuffer()) {
      file.contents = Buffer.concat([
        new Buffer(insert_space(file.contents.toString()))
      ]);
    }

    return cb(null, file);
  });

};

module.exports = pangu;
