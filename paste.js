const Paste= document.querySelector("#paste");
const Bin= document.querySelector("#paste-bin");

Paste.addEventListener('click', async () => {
    const READ= await navigator.clipboard.readText();
    Bin.value= READ;
});