var vfile = require('to-vfile');
var inspect = require('unist-util-inspect');
var htmlp = require('.');

var doc = vfile.readSync('./examples/call.html');
var hast = htmlp.toHast(String(doc));

console.log(inspect(hast));

const newTree = htmlp.traverse(hast); 
console.log('Transformed tree:');
console.log(newTree);

const code = htmlp.transpile(newTree);
console.log('Transpiled code:');
console.log(code);

console.log('Evaluated:');
console.log(eval(code));
