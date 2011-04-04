
var slice = Array.prototype.slice;
var toString = Object.prototype.toString;

var typeOf = function(obj){
    return toString.call(obj).match(/^\[\w+\s+(\w+)\]$/)[1].toLowerCase();
};
var repeat = function(times, pattern){
    if (times <= 0) return '';
    if (pattern == null) pattern = ' ';
    var ptrn = pattern;
    while(--times > 0){
        pattern += ptrn;
    }
    return pattern;
};
var hasClass = function(element, _class){
    return new RegExp('(^|\\s)'+ _class +'(\\s|$)').test(element.className);
};
var print = function(args, level){
    var str = [];
    for (var i = 0; i < args.length; i++){
        var arg = args[i];
        if (typeOf(arg) == 'regexp'){
            str.push(arg.source);
        } else if (typeOf(arg) == 'string'){
            str.push('"'+ arg +'"');
        } else if (typeOf(arg) == 'array'){
            str.push('[');
            str.push(repeat(level, '  ') + print(arg).join(',\n'));
            str.push(repeat(level-1, '  ') + ']');
        } else if (typeOf(arg) == 'object'){
            level++;
            str.push('{');
            for (var key in arg){
                var printedKey = print([key])[0] + ': ';
                str.push(repeat(level, '  ') + printedKey + print([arg[key]], level).join('\n'));
            }
            str.push(repeat(level-1, '  ') + '}');
        } else {
            str.push(arg);
        }
    }
    return str;
};
var pprint = function(){
    var args = slice.call(arguments, 0);
    console.log(print(args, 0).join('\n'));
};

var body = document.body;
var search = function(selector, context){
    return Slick.search(context || document, selector);
};
var find = function(selector, context){
    return Slick.find(context || document, selector);
};
var jasmine = {
    isItMe: function(){
        return !!find('.jasmine_reporter');
    },
    finished: function(){
        return !!find('.finished-at');
    },
    failed: function(){
        return !!find('.jasmine_reporter > .runner.failed');
    },
    getFailedSpecs: function(){
        var i, j, describe, desc;
        var rootDescribes = search('.jasmine_reporter > .suite.failed');
        var specs = [];

        var traverse = function(describes, specs){

            describes.forEach(function(describe, i){
                var desc = find('> .description', describe);
                var spec = {};
                var children = spec[desc.innerText] = [];
                specs.push(spec);

                if (hasClass(describe, 'suite')){
                    traverse(search('> .spec.failed, > .suite.failed', describe), children);
                } else if (hasClass(describe, 'spec')){
                    children.push.apply(children, search('.resultMessage', describe).map(function(el){
                        return el.innerText;
                    }));
                }
            });

        };
        traverse(rootDescribes, specs);

        return specs;
    },
    get stats(){
        var statsStr = find('.description').innerText.trim();
        //12 specs, 5 failures in 0.115s
        var stats = statsStr.match(/^(\d+)\D+(\d+)\D+([\d.]+)/);
        return {specs: stats[1], failures: stats[2], time: parseFloat(stats[3])};
    }
};
var suites = {
    jasmine: jasmine
    //qunit: qunit
};
var detectSuite = function(){
    for (var name in suites){
        if (suites[name].isItMe()){
            return suites[name];
        }
    }
    throw new Error('The test suite could not be detected. Supported suites are: '+ suites.keys());
};
var p = function(obj, buffer, level){
    for (desc in obj){
        buffer.push(repeat(level*2) + desc);
        if (typeOf(obj[desc][0]) == 'string'){
            obj[desc].forEach(function(err){
                buffer.push(repeat(level*2) + '>> ' + err);
            });
        } else {
            level++;
            obj[desc].forEach(function(suite){
                p(suite, buffer, level);
            });
        }
    }
    return buffer;
};
var report = function(errors){
    var ret = [];
    for (var i = 0; i < errors.length; i++){
        ret.push.apply(ret, p(errors[i], [], 0));
    }
    return ret.join('\n');
};

var suite = detectSuite();
window.setInterval(function(){
    if (suite.finished()){
        if (suite.failed()){
            console.log(report(suite.getFailedSpecs()));
            phantom.exit(suite.stats.failures);
            return;
        }
        phantom.exit(0);
    }
}, 100);

