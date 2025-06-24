const selector = document.getElementById("exerciseSelector");
const frame = document.getElementById("exerciseFrame");
const instructions = document.getElementById("instructions");
const htmlEditor = document.getElementById("html-code");
const cssEditor = document.getElementById("css-code");
const jsEditor = document.getElementById("js-code");

let currentTestsCode = ""; // Guardamos el código tests.js cargado

selector.addEventListener("change", async () => {
  const selected = selector.value;

  // Load exercise instructions
  try {
    const response = await fetch(`./exercises/${selected}/instructions.md`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const text = await response.text();
    instructions.innerHTML = text
      .replace(/^## (.*)$/gm, "<h2>$1</h2>")
      .replace(/^### (.*)$/gm, "<h3>$1</h3>")
      .replace(/^- (.*)$/gm, "<li>$1</li>");
  } catch (e) {
    console.error("Error loading instructions:", e);
    instructions.innerHTML = `<p style="color: red;">The exercise instructions could not be loaded, make sure <code>instructions.md</code> exists in <code>./exercises/${selected}/</code>.</p>`;
  }

  // Load tests.js dynamically for the selected exercise
  try {
    const resTests = await fetch(`./exercises/${selected}/tests.js`);
    if (!resTests.ok) throw new Error(`Could not load tests.js for ${selected}`);
    currentTestsCode = await resTests.text();
  } catch (e) {
    console.error("Error loading tests.js:", e);
    currentTestsCode = "// No tests found for this exercise";
  }

  renderPreview();
});

// Update the iframe in function of the editors' content and inject tests
function renderPreview() {
  const html = htmlEditor.value;
  const css = cssEditor.value;
  const js = jsEditor.value;

  const fullCode = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Exercise</title>
      <link href="https://cdn.jsdelivr.net/npm/mocha@10.2.0/mocha.css" rel="stylesheet" />
      <style>${css}</style>
    </head>
    <body>
      ${html}

      <div id="mocha"></div>

      <script src="https://cdn.jsdelivr.net/npm/mocha@10.2.0/mocha.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/chai@4.3.7/chai.js"></script>
      <script>
        mocha.setup('bdd');
        const { expect } = chai;
      </script>

      <script>${js}<\/script>

      <script>${currentTestsCode}<\/script>

      <script>
        mocha.run();
      </script>
    </body>
    </html>
  `;

  frame.srcdoc = fullCode;
}

// Update iframe when there is an input
htmlEditor.addEventListener("input", renderPreview);
cssEditor.addEventListener("input", renderPreview);
jsEditor.addEventListener("input", renderPreview);

// Load the first exercise at the begining
selector.dispatchEvent(new Event("change"));
