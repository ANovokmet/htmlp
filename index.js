var parse5 = require('parse5')
var fromParse5 = require('hast-util-from-parse5')
var transpile = require('./transpiler')


function traverse(node) {
    for (let child of node.children) {
        if (child.tagName == 'body') {
            return traverseRoot(child);
        }

        if (child.tagName == 'html') {
            return traverse(child);
        }
    }
}

function traverseRoot(node) {
    const output = {
        type: 'root',
        children: []
    };

    for (let child of node.children) {
        if (child.tagName == 'declare') {
            output.children.push(traverseDeclaration(child));
        }

        if (child.tagName == 'assign') {
            output.children.push(traverseAssignment(child));
        }
    }

    return output;
}

function traverseDeclaration(node) {
    let output = {
        type: 'declaration',
        left: null,
        right: null
    }

    console.log('declaration');
    for (let child of node.children) {

        if (child.tagName == 'identifier') {
            output.left = traverseIdentifier(child);
        }

        if (child.tagName == 'const') {
            output.right = traverseConstant(child);
        }
    }

    return output;
}

class Parser {
    

    // const p = new Parser(node.children);

    // let child = p.nextValidNode();
    // if (child.tagName == 'identifier') {
    //     output.left = traverseIdentifier(child);
    // } else {
    //     // error
    // }
    // child = p.nextValidNode();
    // if (child && child.tagName == 'const') {
    //     output.right = traverseIdentifier(child);
    // } else {
    //     // error
    // }
    // child = p.nextValidNode();
    // if(child) {
    //     // error
    // }

    constructor(nodes) {
        this.pos = -1;
        this.nodes = nodes;
    }

    nextValidNode() {
        let node = this.nodes[++this.pos];
        while(
            (!node || node.type === 'text') && (!node.value || !node.value.trim())
        ) {
            node = this.nodes[++this.pos];
            if(this.pos >= this.nodes.length) {
                break;
            }
        }
        return node;
    }

    node() {
        return this.nodes[this.pos];
    }
}

function traverseAssignment(node) {
    let output = {
        type: 'assignment',
        left: null,
        right: null
    }

    console.log('assignment');
    for (let child of node.children) {
        if (child.tagName == 'identifier') {
            output.left = traverseIdentifier(child);
        }

        if (child.tagName == 'const') {
            output.right = traverseConstant(child);
        }
    }

    return output;
}

function traverseIdentifier(node) {

    const output = {
        type: 'identifier',
        value: null
    }

    for (let child of node.children) {
        if (child.type == 'text') {
            const constValue = child.value.trim();
            if (!output.value) {
                output.value = constValue;
            } else {
                throw new Error("Identifier has multiple names");
            }
        } else {
            throw new Error("Invalid name for identifier");
        }
    }

    return output;
    // else {
    //     throw new Error("Identifier has no name");
    // }
}

function traverseConstant(node) {
    const output = {
        type: 'constant',
        value: null
    }

    for (let child of node.children) {
        if (child.type == 'text') {
            const constValue = child.value.trim();
            if (!output.value) {
                output.value = constValue;
            } else {
                throw new Error("Constant has multiple values")
            }
        } else {
            throw new Error("Invalid value for constant");
        }
    }

    return output;
    // } else {
    //     throw new Error("Constant has no value");
    // }
}

function toHast(html) {
    const ast = parse5.parse(html, { sourceCodeLocationInfo: true })
    const hast = fromParse5(ast);
    return hast;
}

module.exports = {
    toHast,
    traverse,
    transpile,

    compile: function(html) {
        const hast = toHast(html);
        const newTree = traverse(hast); 
        const code = transpile(newTree);
        return code;
    }
}

