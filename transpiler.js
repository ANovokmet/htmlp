function transpile(node) {
    if(node.type === 'root') {
        return transpileRoot(node);
    }
}

function transpileRoot(node, expression = '') {
    for (let child of node.children) {
        if(child.type === 'declaration') {
            expression += transpileDeclaration(child);
        }
        
        if(child.type === 'assignment') {
            expression += transpileAssignment(child);
        }
    }

    return expression;
}

function transpileAssignment(node) {
    return `${node.left.value} = ${transpileExpression(node.right)};\n`;
}

function transpileExpression(node) {
    if(node.type === 'constant') {
        return node.value;
    }
}

function transpileDeclaration(node) {
    if(node.right) {
        return `var ${node.left.value} = ${transpileExpression(node.right)};\n`;
    } else {
        return `var ${node.left.value};\n`;
    }
}

module.exports = transpile; 