function transpile(node) {
    if(node.type === 'root') {
        return transpileRoot(node);
    }
}

function transpileRoot(node, statements = '') {
    for (let child of node.body) {
        statements += transpileStatement(child);
    }

    return statements;
}

function transpileStatement(node, statement = '') {
    if(!node.body) {
        return ';';
    }

    if(node.body.type === 'declaration') {
        statement = transpileDeclaration(node.body);
    } else {
        statement = transpileExpression(node.body);
    }

    return `${statement};\n`;
}

function transpileExpression(node) {
    // statement
    if(node.type == 'assignment') {
        return transpileAssigmentExpression(node);
    }

    if(node.type == 'operation') {
        return transpileOperationExpression(node);
    }

    if(node.type == 'literal') {
        return transpileLiteral(node);
    }

    if(node.type == 'identifier') {
        return transpileIdentifier(node);
    }

    if(node.type == 'call') {
        return transpileCallExpression(node);
    }

    if(node.type == 'member') {
        return transpileMemberExpression(node);
    }
}

function transpileCallExpression(node) {
    const target = transpileExpression(node.target);
    const args = node.args.map(transpileExpression).join(', ');

    return `${target}(${args})`;
}

function transpileMemberExpression(node) {
    const target = transpileExpression(node.target);
    
    return `${target}.${node.property}`;
}

function transpileLiteral(node) {
    return node.value;
}

function transpileIdentifier(node) {
    return node.name;
}

function transpileAssigmentExpression(node) {
    return `${transpileExpression(node.left)} = ${transpileExpression(node.right)}`;
}

function transpileOperationExpression(node) {
    const left = transpileExpression(node.left);
    const right = transpileExpression(node.right);
    const operator = node.operator;

    return `${left} ${operator} ${right}`;
}

function transpileDeclaration(node) {
    if(node.init) {
        return `var ${node.identifier} = ${transpileExpression(node.init)}`;
    } else {
        return `var ${node.identifier}`;
    }
}

module.exports = transpile; 