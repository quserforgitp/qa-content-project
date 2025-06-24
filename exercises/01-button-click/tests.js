describe('Exercise 01 - button', () => {
  it('should show Hello World! when is clicked', () => {
    const button = document.getElementById('btn');
    button.click();
    const output = document.getElementById('output');
    expect(output.textContent).to.equal('Hello World!');
  });
});
