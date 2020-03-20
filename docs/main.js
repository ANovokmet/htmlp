
const codeArea = document.getElementById('code-area');
const resultArea = document.getElementById('result-area');
const execArea = document.getElementById('exec-area');
const previewArea = document.getElementById('preview-area');

codeArea.value = 
`<declare>
    <identifier>x</identifier>
</declare>
<assign>
    <identifier>x</identifier>
    <const>5</const>
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