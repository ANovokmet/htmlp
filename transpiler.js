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
        statement = transpileDeclaration(node.body) + ';';
    } else if (node.body.type === 'block') {
        statement = transpileBlockStatement(node.body);
    } else if (node.body.type === 'function') {
        statement = transpileFunctionDeclaration(node.body);
    } else if (node.body.type === 'return') {
        statement = transpileReturnStatement(node.body) + ';';
    } else if (node.body.type == 'conditional') {
        statement = transpileConditionalStatement(node.body);
    } else if (node.body.type == 'loop') { 
        statement = transpileLoopStatement(node.body);
    } else {
        statement = transpileExpression(node.body) + ';';
    }

    return `${statement}\n`;
}

function transpileConditionalStatement(node, statement = '') {
    const test = transpileExpression(node.test);

    statement += `if (${test}) `

    if(node.then) {
        statement += transpileStatement(node.then);
    }

    if(node.else) {
        statement += `else ${transpileStatement(node.else)}`;
    }
    
    return statement;
}

function transpileLoopStatement(node) {
    const test = node.test ? transpileExpression(node.test) : '';
    const step = node.step ? transpileExpression(node.step) : '';
    let init = '';
    if(node.init) {
        if(node.init.type == 'declaration') {
            init = transpileDeclaration(node.init);
        } else {
            init = transpileExpression(node.init);
        }
    }
    const body = node.body ? transpileStatement(node.body) : '';

    return `for (${init};${test};${step}) ${body}`;
}

function transpileReturnStatement(node) {
    if(!node.arg) {
        return 'return';
    }

    const arg = transpileExpression(node.arg);

    return `return ${arg}`;
}

function transpileFunctionDeclaration(node) {
    const body = transpileStatement(node.body);
    const params = node.params.map(transpileExpression).join(', ');

    return `function ${node.name}(${params}) ${body}`;
}

function transpileBlockStatement(node, statements = '') {
    if(!node.body || node.body.length === 0) {
        return '{ }';
    }

    for (let child of node.body) {
        statements += `\t${transpileStatement(child)}`;
    }

    return `{\n${statements}}`;
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
    const operator = node.operator;
    const operands = node.operands.map(transpileExpression).join(` ${operator} `);

    return `${operands}`;
}

function transpileDeclaration(node) {
    if(node.init) {
        return `var ${node.identifier} = ${transpileExpression(node.init)}`;
    } else {
        return `var ${node.identifier}`;
    }
}

module.exports = transpile; 