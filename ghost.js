if (phantom.state.length === 0) {
    if (phantom.args.length !== 1) {
        console.log('Usage: run-jasmine.js URL');
        phantom.exit(1);
    } else {
        phantom.state = 'run-jasmine';
        phantom.open(phantom.args[0]);
    }
} else {

    (function(){

        var slice = Array.prototype.slice;
        var toString = Object.prototype.toString;

        var typeOf = function(obj){
            return toString.call(obj).match(/^\[\w+\s+(\w+)\]$/)[1].toLowerCase();
        };
        var repeat = function(string, times){
            if (times <= 0) return '';
            var _string = string;
            while(--times > 0){
                string += _string;
            }
            return string;
        };
        var print = function(args, level){
            var str = [];
            if (typeOf(args) != 'array') args = [args];
            for (var i = 0; i < args.length; i++){
                var arg = args[i];
                if (typeOf(arg) == 'regexp'){
                    str.push(arg.source);
                } else if (typeOf(arg) == 'string'){
                    str.push('"'+ arg +'"');
                } else if (typeOf(arg) == 'array'){
                    str.push('['+ print(arg).join(', ') +']');
                } else if (typeOf(arg) == 'object'){
                    level++;
                    str.push('{');
                    for (var key in arg){
                        var printedKey = print(key)[0] + ': ';
                        str.push(repeat('  ', level) + printedKey + print(arg[key], level).join('\n'));
                    }
                    str.push(repeat('  ', level-1) + '}');
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

        //var body = document.body;
        //var search = function(selector, context){
            //return slice.call((context || document).querySelectorAll(selector), 0);
        //};
        //var find = function(selector, context){
            //return (context || document).querySelector(selector);
        //};
        //var jasmine = {
            //isItMe: function(){
                //return !!find('.jasmine_reporter');
            //},
            //finished: function(){
                //return !!find('.finished-at');
            //},
            //failed: function(){
                //return !!find('.jasmine_reporter > .runner.failed');
            //},
            //getFailedSpecs: function(){
                //var i, j, describe, desc;
                //var rootDescribes = search('.jasmine_reporter > .suite.failed');
                //var specs = [];
                
                //var traverse = function(describes, specs){

                    //describes.forEach(function(describe, i){
                        //var desc = find('* > .description', describe);
                        //var spec = {};
                        //spec[desc.innerText] = [];
                        //specs.push(spec);
                        //traverse();
                        ////tree[desc.innerText] = [];
                        ////childDescribes = search('> .suite.failed', describe);
                        ////for (j = 0; j < desc.length; j++){
                            ////console.log(desc[j].innerText);
                        ////}
                    //});

                //};
                //traverse(rootDescribes, specs);

                //return specs;
            //},
            //get stats(){
                //var statsStr = find('.description').innerText.trim();
                ////12 specs, 5 failures in 0.115s
                //var stats = statsStr.match(/^(\d+)\D+(\d+)\D+([\d.]+)/);
                //return {specs: stats[1], failures: stats[2], time: parseFloat(stats[3])};
            //}
        //};
        //var suites = {
            //jasmine: jasmine
            ////qunit: qunit
        //};
        //var detectSuite = function(){
            //for (var name in suites){
                //if (suites[name].isItMe()){
                    //return suites[name];
                //}
            //}
            //throw new Error('The test suite could not be detected. Supported suites are: '+ suites.keys());
        //};

        //var suite = detectSuite();
        //window.setInterval(function(){
            //if (suite.finished()){
                //if (suite.failed()){
                    //pprint(suite.getFailedSpecs());
                    //phantom.exit(suite.stats.failures);
                    //return;
                //}
                //phantom.exit(0);
            //}
        //}, 100);
    })();
}

