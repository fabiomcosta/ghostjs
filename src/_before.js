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

