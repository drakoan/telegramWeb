class ChatManager {
    constructor(chatContainer) {
        this.container = chatContainer;
    }

    setChat({ id, chatName, isPinned, lastMessage, sentMessageStatus, lastMessageDate } = {}) {
        this.#setDefaultProps();

        // FIX IT
        // you need to ensure that fields aren't html, just a plain text
        this.id = id ?? this.id;
        this.chatName = chatName ?? this.chatName;
        this.isPinned = isPinned ?? this.isPinned;
        this.lastMessage = lastMessage ?? this.lastMessage;
        this.sentMessageStatus = sentMessageStatus ?? this.sentMessageStatus;
        this.lastMessageDate = lastMessageDate ?? this.lastMessageDate;

        this.#updateChatNode();
    }

    getAllChats() {
        return document.querySelectorAll(".chat");
    }

    getChat(id) {
        for (let chat of this.getAllChats()) {
            if (chat.dataset.id === id.toString()) return chat;
        }

        return null;
    }

    #setDefaultProps() {
        // chat props
        this.id = 228;
        this.chatName = "Chat";
        this.isPinned = true;
        this.lastMessage = "This is default last message text.";
        this.sentMessageStatus = "";
        this.lastMessageDate = "27.12.2020";
    }

    #updateChatNode() {
        const isPinned = this.isPinned ? "chat_pinned" : "";

        let element = this.getChat(this.id);

        if (element) {
            // So why just don't use the same innerHTML when chat exists? Why add this stupid ass code?
            // innerHTML kills all event listeners. It's unlikely there are ever gonna be some listeners on these elements, but who knows?)
            document.querySelector(".chat__name").textContent = this.chatName;

            const chatMessageStatus = document.querySelector(".chat__sent-message-status");
            chatMessageStatus.classList.remove("chat__sent-message-status_sent", "chat__sent-message-status_sent");
            chatMessageStatus.classList.add(`chat__sent-message-status_${this.sentMessageStatus}`);

            document.querySelector(".chat__last-message-date").textContent = this.lastMessageDate;
            document.querySelector(".chat__last-message").textContent = this.lastMessage;

            if (isPinned !== "chat_pinned") {
                document.querySelector(".chat_isPinned").classList.remove("chat_pinned");
            } else {
                document.querySelector(".chat_isPinned").classList.add(isPinned);
            }
        } else {
            element = document.createElement("li");
            element.classList.add("chat", "circle-animation");
            element.dataset.id = this.id;

            element.innerHTML = `<div class="bg-picture"></div>
                             <div class="chat__body">
                                <div class="chat__row">
                                    <div class="chat__name">${this.chatName}</div>
                                    <div class="chat__additional-info">
                                        <div class="chat__sent-message-status chat__sent-message-status_${this.sentMessageStatus}"></div>
                                        <div class="chat__last-message-date">${this.lastMessageDate}</div>
                                    </div>
                                </div>
                                <div class="chat__row">
                                    <div class="chat__last-message">${this.lastMessage}</div>
                                    <div class="chat__additional-info">
                                        <div class="chat_isPinned ${isPinned}"></div>
                                    </div>
                                </div>
                            </div>`;

            this.#insertChatNode(element);
            this.#initEventListeners()
        }
    }

    #insertChatNode(node) {
        this.container.insertAdjacentElement("beforeend", node);
    }

    #initEventListeners() {
        const chats = this.getAllChats();
        const chatList = this.container;
        const activeChatClass = "chat_active";

        const addSelection = (chat) => {
            chat.classList.add(activeChatClass)
        }

        const removeAllChatSelection = () => {
            chats.forEach(chat => chat.classList.remove(activeChatClass));
        };


        // при клике на чат, он выделяется синим цветом, всё предыдущее выделение скидывается
        chats.forEach(chat => {
            chat.addEventListener('click', () => {
                removeAllChatSelection();
                addSelection(chat);
            });
        });

        // если кликнули за пределы контейнера чатов, то скинуть всё выделение чатов
        document.addEventListener("click", (e) => {
            if (!e.path.includes(chatList)) {
                removeAllChatSelection();
            }
        });
    }
}

// have no idea why do I need this class, just decided to pack code inside a class)))
// refactor it later, it looks horrible
class ContextMenu  {
    constructor(chats) {
        document.addEventListener('contextmenu', (e) => e.preventDefault());

        chats.forEach((chat) => {
            chat.addEventListener("contextmenu", (e) => {
                this.#removePopup();

                const viewportHeight = window.innerHeight;
                const x = e.clientX;
                let y = e.clientY;

                this.#insertPopup();

                this.#getShowSubPopupBtn().addEventListener("mouseover", () => {
                    this.#getSubPopup().classList.add("popup__sub_visible")
                });

                this.#getShowSubPopupBtn().addEventListener("mouseout", () => {
                    this.#getSubPopup().classList.remove("popup__sub_visible")
                });

                // constraint popup to appear only in viewport
                if (y + this.#getPopupHeight() > viewportHeight) {
                    y = viewportHeight - this.#getPopupHeight();
                }

                this.#getPopupNode().style.left = x + "px";
                this.#getPopupNode().style.top = y + "px";
            });
        });

        document.addEventListener('click', () => this.#removePopup());
    }

    container = document.querySelector(".chats-block");
    html =
        `
    <ul class="popup">
        <li class="popup__item">Archive</li>
        <li class="popup__item">Pin</li>
        <li class="popup__item popup__show-sub-popup-icon">Mute notifications
            <ul class="popup popup__sub">
                <li class="popup__item">Select tone</li>
                <li class="popup__item">Disable sound</li>
                <li class="popup__item">Mute for...</li>
                <li class="popup__item popup__item_color_red">Mute forever</li>
            </ul>
        </li>
        <li class="popup__item">Mark as unread</li>
        <li class="popup__item">Block user</li>
        <li class="popup__item">Clear history</li>
        <li class="popup__item popup__item_color_red">Delete chat</li>
    </ul>
    `;

    #insertPopup() {
        this.container.insertAdjacentHTML("beforeend", this.html);
        setTimeout(() => this.#getPopupNode().classList.add("popup_visible"), 10);
    }

    #getPopupNode() {
        return this.container.querySelector(".popup");
    }

    #getSubPopup() {
        return this.#getPopupNode().querySelector(".popup__sub");
    }

    #getShowSubPopupBtn() {
        return this.#getPopupNode().querySelector(".popup__show-sub-popup-icon");
    }

    #getPopupHeight() {
        return parseFloat(window.getComputedStyle(this.#getPopupNode()).height);
    }

    #removePopup() {
        if (this.#getPopupNode()) {
            this.#getPopupNode().remove();
        }
    }
}


const inputField = document.querySelector(".chats-block__search-field");

inputField.addEventListener('input', () => {
    showTargetChats(inputField.value);
});

function showTargetChats(chatNameStartsWith) {
    chatNameStartsWith = chatNameStartsWith.toLowerCase();

    hideAllChats();

    const chats = document.querySelectorAll(".chat");

    chats.forEach((chat) => {
        const chatNameText = chat.querySelector(".chat__name").textContent.toLowerCase();

        if (chatNameText.startsWith(chatNameStartsWith)) {
            chat.classList.remove("chat_hidden");
        }
    });
}

function hideAllChats() {
    const chats = document.querySelectorAll(".chat");

    chats.forEach((chat) => chat.classList.add("chat_hidden"));
}

const props = {
    id: 0,
    chatName: "Eminem",
    isPinned: true,
    lastMessage: "What's up, dude, I'd really like to make a feat wit' ya. Please!",
    sentMessageStatus: "sent",
    lastMessageDate: "30.11.2022"
};

const chatManager = new ChatManager( document.querySelector(".chats-block__list") );

const names = ["Eminem", "Dmitry", "Aboba", "MGK", "50 cent", "Pavel Bykov", "Egor Ershov", "Andrey",
"Sir Gay", "Sergey", "Kailee Morgue", "King Mala", "Dr Dre", "Johny Sins", "Andrew Tate", "LOOOL"];

for (let i = 0; i < 16; i++) {
    props.chatName = names[i];
    chatManager.setChat(props);
    props.id++;
}

new ContextMenu(chatManager.getAllChats());