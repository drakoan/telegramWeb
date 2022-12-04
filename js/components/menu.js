const menuBtn = document.querySelector(".chats-block__menu-btn");

const menu  = {
    node: document.querySelector(".menu"),
    blackScreen: document.querySelector(".black-screen"),
    isOpen: false,

    show() {
        this.node.classList.add("menu_active")
        this.isOpen = true;
        this.blackScreen.classList.toggle("black-screen_active");
    },

    hide() {
        this.node.classList.remove("menu_active")
        this.isOpen = false;
        this.blackScreen.classList.toggle("black-screen_active");
    }
};

menuBtn.addEventListener("click", () => menu.show());

document.addEventListener("click", (e) => {
    if (!e.path.includes(menu.node) && !e.path.includes(menuBtn) && menu.isOpen) {
        menu.hide();
    }
});

// switch user block
const showSwitchUserBtn = document.querySelector(".user__show-switch-user-block-btn");

class SwitchUser {
    node = document.querySelector(".user__switch-user-block");
    activeClass = "user__switch-user-block_active";
    offsetHeight = this.node.offsetHeight;
    isOpen = false;

    constructor() {
        this.hide();
    }


    hide() {
        this.node.style.height = "0";
        this.node.classList.remove(this.activeClass);
        this.isOpen = false;
    }

    show() {
        this.node.style.height = this.offsetHeight + "px";
        this.node.classList.add(this.activeClass);
        this.isOpen = true;
    }
}

let switchUser = new SwitchUser();

showSwitchUserBtn.addEventListener("click", () => {
    showSwitchUserBtn.classList.toggle("user__show-switch-user-block-btn_active");

    switchUser.isOpen ? switchUser.hide() : switchUser.show();
});
// and of switch user block