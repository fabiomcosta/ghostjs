#!/usr/bin/env node

var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');

var modules = ['_before.js', 'slick.js', 'ghost.js', '_after.js'];

var ghostFilePath = '/tmp/ghost.js';
var url = process.argv[2];

var dir = path.join(path.dirname(module.filename), 'src');
var script = [];

if (!path.exists(ghostFilePath)){
    modules.forEach(function(fileName, i){
        script.push(fs.readFileSync(path.join(dir, fileName)));
    });
}

fs.writeFile(ghostFilePath, script.join(';'), function(error){
    if (error) throw error;
    exec('phantomjs ' + ghostFilePath + ' ' + url, function(error, stdout, stderr){
        console.log(stdout);
        process.exit(error.code);
    });
});

