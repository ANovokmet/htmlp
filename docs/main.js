
const codeArea = document.getElementById('code-area');
const resultArea = document.getElementById('result-area');
const execArea = document.getElementById('exec-area');
const previewArea = document.getElementById('preview-area');

codeArea.value = 
`<declare name="x"></declare>
<assign>
    <identifier name="x"></identifier>
    <operation type="+">
        <literal value="2"></literal>
        <literal value="2"></literal>
    </operation>
</assign>`;

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
        execArea.innerText = eval(resultArea.innerText);
    } catch (error) {
        execArea.innerText = error.message;
        console.error('Error running js:', error);
    }
}

previewCode();
tryCompileCode();
tryRunCode();

codeArea.onkeyup = () => {
    previewCode();
    tryCompileCode();
    tryRunCode();
};