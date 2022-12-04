import "./components/chats-block.js";
import "./components/circleAnimation.js";
import "./components/menu.js";

const resizeGutter = document.querySelector(".resize-gutter");
const chatBlock = document.querySelector(".chats-block");

if (localStorage.getItem("chatBlockWidth")) {
    chatBlock.style.width = localStorage.getItem("chatBlockWidth");
}

let isClicked = false;
let oldX;

resizeGutter.addEventListener('mousedown', e => {
    isClicked = true;
    oldX = e.clientX; // x = 360
});

window.addEventListener('mouseup', () => {
    isClicked = false;
});

window.addEventListener('mousemove', e => {
    if (isClicked) {
        let computedX = e.clientX - oldX;
        oldX = e.clientX;

        chatBlock.style.width = parseInt(window.getComputedStyle(chatBlock).width) + computedX + "px";

        localStorage.setItem("chatBlockWidth", chatBlock.style.width);
    }
});

setTimeout(() => {
    document.querySelector(".white-screen")?.remove();
}, 0);