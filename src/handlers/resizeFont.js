let fontSize = window.innerWidth / 10;

if (fontSize > 42) fontSize = 42;

fontSize += "px";

document.querySelector("html").style.fontSize = fontSize;
