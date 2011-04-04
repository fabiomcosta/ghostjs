#!/usr/bin/env node

var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');

var modules = ['_before.js', 'slick.js', 'ghost.js', '_after.js'];

var ghostFilePath = '/tmp/ghostjs.js';
var url = process.argv[2];

var dir = path.join(path.dirname(module.filename), 'src');
var script = [];

if (!path.existsSync(ghostFilePath)){
    modules.forEach(function(fileName, i){
        script.push(fs.readFileSync(path.join(dir, fileName)));
    });
    fs.writeFileSync(ghostFilePath, script.join(';'));
}

exec('phantomjs ' + ghostFilePath + ' ' + url, function(error, stdout, stderr){
    console.log(stdout, stderr);
    process.exit(error ? error.code : 0);
});

