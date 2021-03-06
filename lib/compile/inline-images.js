// ==========================================
// RECESS
// COMPILE: replaces image links with base64 image data
// ==========================================
// Copyright 2012 Twitter, Inc
// Licensed under the Apache License v2.0
// http://www.apache.org/licenses/LICENSE-2.0
// ==========================================

'use strict'

var less = require('less')
  , fs = require('fs')
  ,fsPath = require('path')
  , seperator = (process.platform == 'win32') ? '\\' : '/'
  , toCSS
  , path

function compile () {
  // strip units from 0 values
  var props = toCSS.apply(this, arguments)

  // do we have a url here?
  if (/url\(/.test(props)) {
    var fileName = props.match(/url\((['"]?)(.*)\1\)/)[2]
      , ext = fileName.match(/[^.]*$/)[0]
      , mimetype = 'image/' + ext.replace(/jpg/, 'jpeg');
      var imgBuffer = new Buffer(fs.readFileSync(fsPath.resolve(fsPath.dirname(path),fileName))).toString('base64')
      var urlData = 'url(data:' + mimetype + ';base64,' + imgBuffer + ')'

    return props.replace(/url\([^\)]*\)/, urlData)
  }

  return props
}

module.exports.on = function () {
  path = this.path
  toCSS = less.tree.Value.prototype.toCSS
  less.tree.Value.prototype.toCSS = compile
}

module.exports.off = function () {
  less.tree.Value.prototype.toCSS = toCSS
}