
const codeArea = document.getElementById('code-area');
const resultArea = document.getElementById('result-area');
const execArea = document.getElementById('exec-area');
const previewArea = document.getElementById('preview-area');

const SAVED_KEY = 'savedCode';

codeArea.value = localStorage[SAVED_KEY] ||
`<function name="hello">
<identifier class="parameter" name="name"></identifier>
<div class="body">
    <return>
        <operation type="+">
            <literal value="'Hello '"></literal>
            <identifier name="name"></identifier>
            <literal value="'!'"></literal>
        </operation>
    </return>
</div>
</function>

<call>
<identifier class="target" name="hello"></identifier>
<literal class="argument" value="'Ante'"></literal>
</call>`;

function tryCompileCode() {
    try {
        resultArea.innerText = htmlp.compile(codeArea.value);
    } catch (error) {
        resultArea.innerText = error.message;
        console.error('Error compiling html:', error);
    }
}

function previewCode() {
    previewArea.innerHTML = codeArea.value;
}

function tryRunCode() {
    try {
        //execArea.innerText = eval(resultArea.innerText);
    } catch (error) {
        execArea.innerText = error.message;
        console.error('Error running js:', error);
    }
}

previewCode();
tryCompileCode();
tryRunCode();

codeArea.onkeyup = () => {
    localStorage[SAVED_KEY] = codeArea.value;
    previewCode();
    tryCompileCode();
    tryRunCode();
};