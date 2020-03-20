var vfile = require('to-vfile')
var parse5 = require('parse5')
var inspect = require('unist-util-inspect')
var fromParse5 = require('hast-util-from-parse5')
var transpile = require('./transpiler')

var doc = vfile.readSync('./examples/assignment.html')
var ast = parse5.parse(String(doc), { sourceCodeLocationInfo: true })
var hast = fromParse5(ast, doc)

console.log(inspect(hast));

const newTree = traverse(hast); 
console.log('Transformed tree:');
console.log(newTree);

const code = transpile(newTree);
console.log('Transpiled code:');
console.log(code);

console.log('Evaluated:');
console.log(eval(code));