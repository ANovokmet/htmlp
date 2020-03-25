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
        body: []
    };

    const children = noEmptyNodes(node.children);

    for (let child of children) {
        output.body.push(traverseStatement(child));
    }

    return output;
}

function hasClass(node, className) {
    return node && node.properties.className && node.properties.className.includes(className);
}

function traverseStatement(node) {
    const output = {
        type: 'statement',
        body: null
    };

    if (node.tagName == 'declare') {
        output.body = traverseDeclaration(node);
    } else if (node.tagName == 'div') {
        // block behaves same as 'statement'
        // output.type = 'block' ?
        // output = traverseBlockStatement ?
        output.body = traverseBlockStatement(node);
    } else if (node.tagName == 'function') {
        output.body = traverseFunctionDeclaration(node);
    } else if (node.tagName == 'return') {
        // only within functions
        output.body = traverseReturnStatement(node);
    } else if (node.tagName == 'if') {
        output.body = traverseConditionalStatement(node);
    } else if (node.tagName == 'loop') {
        output.body = traverseLoopStatement(node);
    } else {
        output.body = traverseExpression(node);
    }

    return output;
}

function traverseConditionalStatement(node) {
    const output = {
        type: 'conditional',
        test: null,
        then: null,
        else: null
    };

    const children = noEmptyNodes(node.children);

    for (let child of children) {
        if(hasClass(child, 'test')) {
            output.test = traverseExpression(child);
        }

        if(hasClass(child, 'then')) {
            output.then = traverseStatement(child);
        }

        if(hasClass(child, 'else')) {
            output.else = traverseStatement(child);
        }
    }

    return output;
}

function traverseLoopStatement(node) {
    const output = {
        type: 'loop',
        test: null,
        step: null,
        init: null,
        body: null
    };

    const children = noEmptyNodes(node.children);

    for (let child of children) {
        if(hasClass(child, 'test')) {
            output.test = traverseExpression(child);
        }

        if(hasClass(child, 'step')) {
            output.step = traverseExpression(child);
        }

        if(hasClass(child, 'init')) {
            if(child.tagName == 'declare') {
                output.init = traverseDeclaration(child);
            } else {
                output.init = traverseExpression(child);
            }
        }

        if(hasClass(child, 'body')) {
            output.body = traverseStatement(child);
        }
    }

    return output;
}

function traverseReturnStatement(node) {
    const output = {
        type: 'return',
        arg:  null
    };

    const children = noEmptyNodes(node.children);
    if(children.length > 0) {
        output.arg = traverseExpression(children[0]);
    }

    return output;
}

function traverseFunctionDeclaration(node) {
    const output = {
        type: 'function',
        name: node.properties.name,
        params: [],
        body: null
    };

    const children = noEmptyNodes(node.children);

    for (let child of children) {
        if(hasClass(child, 'body')) {
            output.body = traverseStatement(child);
        }

        if(hasClass(child, 'parameter')) {
            output.params.push(traverseExpression(child));
        }
    }

    return output;
}

function traverseBlockStatement(node) {
    const output = {
        type: 'block',
        body: []
    };

    const children = noEmptyNodes(node.children);

    for (let child of children) {
        output.body.push(traverseStatement(child));
    }
    return output;
}

function traverseExpression(node) {
    if(!node) {
        return null;
    }

    // statement
    if(node.tagName == 'assign') {
        return traverseAssigmentExpression(node);
    }

    if(node.tagName == 'operation') {
        return traverseOperationExpression(node);
    }

    if(node.tagName == 'literal') {
        return traverseLiteral(node);
    }

    if(node.tagName == 'identifier') {
        return traverseIdentifier(node);
    }

    if(node.tagName == 'call') {
        return traverseCallExpression(node);
    }

    if(node.tagName == 'member') {
        return traverseMemberExpression(node);
    }
}

function traverseMemberExpression(node) {
    const output = {
        type: 'member',
        property: node.properties.name,
        target: null
    }

    const children = noEmptyNodes(node.children);

    output.target = traverseExpression(children[0]);

    return output;
}

function traverseCallExpression(node) {
    const output = {
        type: 'call',
        target: null,
        args: []
    };

    const children = noEmptyNodes(node.children);

    for (let child of children) {
        if(hasClass(child, 'target')) {
            output.target = traverseExpression(child);
        }

        if(hasClass(child, 'argument')) {
            output.args.push(traverseExpression(child));
        }
    }

    return output;
}

function traverseAssigmentExpression(node) {
    const output = {
        type: 'assignment',
        left: null,
        right: null
    };

    const children = noEmptyNodes(node.children);

    output.left = traverseExpression(children[0]);
    output.right = traverseExpression(children[1]);

    return output;
}

function traverseDeclaration(node) {
    // identifier
    const output = {
        type: 'declaration',
        identifier: node.properties.name,
        init: null
    };

    const children = noEmptyNodes(node.children);

    // init expression
    output.init = traverseExpression(children[0]);

    return output;
}

function noEmptyNodes(nodes) {
    return nodes.filter(c => c.type != 'text' || c.value.trim());
}

function traverseLiteral(node) {
    const output = {
        type: 'literal',
        value: node.properties.value
    };

    return output;
}

function traverseIdentifier(node) {
    const output = {
        type: 'identifier',
        name: node.properties.name
    };

    // for (let child of node.children) {
    //     if (child.type == 'text') {
    //         const constValue = child.value.trim();
    //         if (!output.value) {
    //             output.value = constValue;
    //         } else {
    //             throw new Error("Identifier has multiple names");
    //         }
    //     } else {
    //         throw new Error("Invalid name for identifier");
    //     }
    // }

    return output;
}

function traverseOperationExpression(node) {
    // operation type
    const output = {
        type: 'operation',
        operator: node.properties.type,
        operands: [],
    };

    const children = noEmptyNodes(node.children);
    
    for (let child of children) {
        output.operands.push(traverseExpression(child));
    }
    
    return output;
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

