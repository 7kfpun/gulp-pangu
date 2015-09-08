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

  // https://github.com/vinta/paranoid-auto-spacing/blob/master/dist/pangu.js#L43-L68
  function insert_space(text) {
    var old_text = text;
    var new_text;
    text = text.replace(/([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])(["])/g, '$1 $2');
    text = text.replace(/(["])([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g, '$1 $2');
    text = text.replace(/(["'\(\[\{<\u201c]+)(\s*)(.+?)(\s*)(["'\)\]\}>\u201d]+)/g, '$1$3$5');
    text = text.replace(/([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])( )(')([A-Za-z])/g, '$1$3$4');
    text = text.replace(/([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])(#(\S+))/g, '$1 $2');
    text = text.replace(/((\S+)#)([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g, '$1 $3');
    text = text.replace(/([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([\+\-\*\/=&\\|<>])([A-Za-z0-9])/g, '$1 $2 $3');
    text = text.replace(/([A-Za-z0-9])([\+\-\*\/=&\\|<>])([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g, '$1 $2 $3');
    old_text = text;
    new_text = old_text.replace(/([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([\(\[\{<\u201c]+(.*?)[\)\]\}>\u201d]+)([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g, '$1 $2 $4');
    text = new_text;
    if (old_text === new_text) {
        text = text.replace(/([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([\(\[\{<\u201c>])/g, '$1 $2');
        text = text.replace(/([\)\]\}>\u201d<])([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g, '$1 $2');
    }
    text = text.replace(/([\(\[\{<\u201c]+)(\s*)(.+?)(\s*)([\)\]\}>\u201d]+)/g, '$1$3$5');
    text = text.replace(/([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([~!;:,\.\?\u2026])([A-Za-z0-9])/g, '$1$2 $3');
    text = text.replace(/([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([A-Za-z0-9`\$%\^&\*\-=\+\\\|/@\u00a1-\u00ff\u2022\u2027\u2150-\u218f])/g, '$1 $2');
    text = text.replace(/([A-Za-z0-9`~\$%\^&\*\-=\+\\\|/!;:,\.\?\u00a1-\u00ff\u2022\u2026\u2027\u2150-\u218f])([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g, '$1 $2');
    text = text.replace(/(Taipei)(,)(China)/g, '$1$2 $3');

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
        new Buffer(insert_space(insert_space(file.contents.toString())))
      ]);
    }

    return cb(null, file);
  });

};

module.exports = pangu;
