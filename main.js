let currentFilter = "All";

function getBotReply(msg) {
    const lowerMsg = msg.toLowerCase().trim();
    if (lowerMsg === "hii" || lowerMsg === "hi" || lowerMsg === "hey" || lowerMsg === "hello") return "Hello!";
    if (lowerMsg === "how are you" || lowerMsg === "whats up?") return "I'm fine, and you?";
    if (lowerMsg === "same here" || lowerMsg === "same") return "That's good!";
    if (lowerMsg === "are you free tonight" || lowerMsg === "are you free today") return Math.random() > 0.5 ? "No, actually I'm going out of town." : "No, I've some plans.";
    if (lowerMsg === "oh, no worries" || lowerMsg === "ok, no problem") return "Yaaa, See you soon!";
    if (lowerMsg === "bye" || lowerMsg === "byee" || lowerMsg === "byeee") return "❤️❤️";
    if (lowerMsg === "what's your name" || lowerMsg === "what is your name") return "I'm my Master's Assistant!";
    if (lowerMsg === "thanks" || lowerMsg === "thank you") return "You're welcome! 😊";

    const replies = [
        "That's interesting!",
        "Tell me more!",
        "Really? Wow!",
        "Haha, nice one!",,
        "I'm here if you need me."
    ];
    return replies[Math.floor(Math.random() * replies.length)];
}

const users = {
    "Aarav": [],
    "Ragini": [],
    "Ritesh": [],
    "Anjali": [],
    "Vihaan": [],
    "Aadhira": [],
    "Jitendra Uncle": [],
    "Priya Sharma": [],
    "Aarav Chaudhary": [],
    "Ritika Verma": [],
    "Ravi Kumar Reddy": [],
    "Divya Nair": [],
    "Sukhwinder Uncle": [],
    "Kajal Mehta": [],
    "Imran Ansari": [],
    "Amritpal Sandhu": [],
    "Jasleen Chahal": [],
    "Neha Malhotra": [],
    "Advika": [],
    "Ishita Khanna": [],
    "Charu": []
};

let activeUser = "Aarav";

const messageInput = document.getElementById("messageInput");
const messageContainer = document.getElementById("messageContainer");
const emojiBtn = document.getElementById("emojiBtn");
const toggleThemeBtn = document.getElementById("toggleTheme");
const searchInput = document.getElementById("searchInput");
const contactList = document.getElementById("contactList");
const typingIndicator = document.getElementById("typingIndicator");
const fileInput = document.getElementById("fileInput");
const callModal = document.getElementById("callModal");
const callingUser = document.getElementById("callingUser");
const endCallBtn = document.getElementById("endCall");
const ringtone = document.getElementById("ringtone");
const incomingCall = document.getElementById("incomingCall");
const incomingUser = document.getElementById("incomingUser");
const acceptCall = document.getElementById("acceptCall");
const declineCall = document.getElementById("declineCall");
const callBtn = document.getElementById("callBtn");

document.getElementById("callBtn").addEventListener("click", () => {
    callingUser.textContent = activeUser;
    callModal.style.display = "flex";
});

endCallBtn.addEventListener("click", () => {
    callModal.style.display = "none";
});


function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function loadLocalStorage() {
    const saved = localStorage.getItem("chatData");
    if (saved) Object.assign(users, JSON.parse(saved));
}

function saveLocalStorage() {
    localStorage.setItem("chatData", JSON.stringify(users));
}

function updateSidebar() {
    for (let user in users) {
        const messages = users[user];
        const lastMsgSpan = document.querySelector(`[data-last="${user}"]`);
        const unreadSpan = document.querySelector(`[data-unread="${user}"]`);

        if (messages.length) {
            const last = messages[messages.length - 1];
            if (lastMsgSpan) lastMsgSpan.textContent = last.type === "text" ? last.text : "📷 Image";
        } else {
            if (lastMsgSpan) lastMsgSpan.textContent = "";
        }

        if (user !== activeUser && unreadSpan) {
            const unread = messages.filter(m => m.sender !== "You").length;
            unreadSpan.textContent = unread ? unread : "";
        } else if (unreadSpan) {
            unreadSpan.textContent = "";
        }
    }
}

function loadChat(user) {
    activeUser = user;
    document.querySelector(".chat-header").innerText = user;
    renderMessages();
    updateSidebar();
}

function renderMessages() {
    messageContainer.innerHTML = "";
    users[activeUser].forEach(msg => {
        const div = document.createElement("div");
        div.className = "message " + (msg.sender === "You" ? "sent" : "received");
        if (msg.type === "text") {
            div.innerHTML = `<strong>${msg.sender}:</strong><div>${msg.text}</div><span class="timestamp">${msg.time}</span>`;
        } else if (msg.type === "image") {
            div.innerHTML = `<strong>${msg.sender}:</strong><img src="${msg.text}" class="image-message"/><span class="timestamp">${msg.time}</span>`;
        }
        messageContainer.appendChild(div);
    });
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function sendMessage() {
    const msg = messageInput.value.trim();
    if (!msg) return;
    const message = {
        type: "text",
        text: msg,
        time: getCurrentTime(),
        sender: "You"
    };
    users[activeUser].push(message);
    saveLocalStorage();
    renderMessages();
    updateSidebar();
    messageInput.value = "";

    typingIndicator.style.display = "block";
    setTimeout(() => {
        const botReply = {
            type: "text",
            text: getBotReply(msg),
            time: getCurrentTime(),
            sender: "User"
        };
        users[activeUser].push(botReply);
        saveLocalStorage();
        typingIndicator.style.display = "none";
        renderMessages();
        updateSidebar();
    }, 1500);
}

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imageMessage = {
                type: "image",
                text: event.target.result,
                time: getCurrentTime(),
                sender: "You"
            };
            users[activeUser].push(imageMessage);
            saveLocalStorage();
            renderMessages();
            updateSidebar();
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("uploadBtn").onclick = () => fileInput.click();

emojiBtn.addEventListener("click", () => {
    const picker = new EmojiButton();
    picker.togglePicker(emojiBtn);
    picker.on("emoji", emoji => {
        messageInput.value += emoji;
    });
});

toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    toggleThemeBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

document.getElementById("callBtn").addEventListener("click", () => {
    alert("Calling " + activeUser + " 📞...");
});

document.getElementById("callBtn").addEventListener("click", () => {
    document.getElementById("callingUser").textContent = activeUser;
    document.getElementById("callModal").style.display = "flex";
    ringtone.play();
});

document.getElementById("endCall").addEventListener("click", () => {
    document.getElementById("callModal").style.display = "none";
    ringtone.pause();
    ringtone.currentTime = 0;
});

let ringTimeout = null;

const randomContacts = [
    "Vihaan", "Aadhira", "Jitendra Uncle", "Priya Sharma",
    "Aarav Chaudhary", "Ritika Verma", "Ravi Kumar Reddy", "Divya Nair"
];

function triggerIncomingCall() {
    const user = randomContacts[Math.floor(Math.random() * randomContacts.length)];
    incomingUser.textContent = user;
    incomingCall.style.display = "flex";
    ringtone.play();

    ringTimeout = setTimeout(() => {
        incomingCall.style.display = "none";
        stopRingtone();
        console.log("📴 Missed call from", user);
    }, 100000);
}

setInterval(triggerIncomingCall, 300000);

callBtn.addEventListener("click", () => {
    callingUser.textContent = activeUser;
    callModal.style.display = "flex";
    ringtone.play();
});

endCallBtn.addEventListener("click", () => {
    callModal.style.display = "none";
    stopRingtone();
    logCall(activeUser, "Outgoing");
});

acceptCall.addEventListener("click", () => {
    incomingCall.style.display = "none";
    stopRingtone();
    clearTimeout(ringTimeout);
    alert("✅ Call connected!");
});

declineCall.addEventListener("click", () => {
    incomingCall.style.display = "none";
    stopRingtone();
    clearTimeout(ringTimeout);
});

function stopRingtone() {
    ringtone.pause();
    ringtone.currentTime = 0;
}

document.getElementById("callBtn").addEventListener("click", () => {
    callingUser.textContent = activeUser;
    callModal.style.display = "flex";
});

endCallBtn.addEventListener("click", () => {
    callModal.style.display = "none";
});

const callLogList = document.getElementById("callLogList");

function logCall(user, type = "Missed") {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const logEntry = { user, type, time };
    allCallLogs.unshift(logEntry); 
    saveCallLogs();                
    renderCallLogs(currentFilter); 
}

function saveCallLogs() {
    localStorage.setItem("callLogs", JSON.stringify(allCallLogs));
}

function loadCallLogs() {
    const saved = localStorage.getItem("callLogs");
    if (saved) {
        allCallLogs.push(...JSON.parse(saved));
        renderCallLogs(); 
    }
}

function renderCallLogs(filter = "All") {
    callLogList.innerHTML = "";
    const filtered = filter === "All" ? allCallLogs : allCallLogs.filter(log => log.type === filter);
    for (const log of filtered) {
        const li = document.createElement("li");
        const badge = log.type === "Missed" ? '<span class="missed-badge">Missed</span>' : "";
        li.innerHTML = `${log.type} call with <strong>${log.user}</strong> at ${log.time} ${badge}`;
        callLogList.appendChild(li);
    }
}

const allCallLogs = []; 

document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.type;
        renderCallLogs(currentFilter);
    });
});


function triggerIncomingCall() {
    const user = randomContacts[Math.floor(Math.random() * randomContacts.length)];
    incomingUser.textContent = user;
    incomingCall.style.display = "flex";
    ringtone.play();

    ringTimeout = setTimeout(() => {
        incomingCall.style.display = "none";
        stopRingtone();
        logCall(user, "Missed");
    }, 100000);
}

acceptCall.addEventListener("click", () => {
    incomingCall.style.display = "none";
    stopRingtone();
    clearTimeout(ringTimeout);
    logCall(incomingUser.textContent, "Received");
    alert("✅ Call connected!");
});

document.querySelectorAll("#contactList li").forEach(li => {
    li.addEventListener("click", () => {
        document.querySelectorAll("#contactList li").forEach(el => el.classList.remove("active"));
        li.classList.add("active");
        loadChat(li.dataset.name);
    });
});

searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toLowerCase();
    document.querySelectorAll("#contactList li").forEach(li => {
        const name = li.dataset.name.toLowerCase();
        li.style.display = name.includes(filter) ? "flex" : "none";
    });
});

messageContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    messageContainer.style.border = "2px dashed #128c7e";
});

messageContainer.addEventListener("dragleave", () => {
    messageContainer.style.border = "none";
});

messageContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    messageContainer.style.border = "none";
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imageMessage = {
                type: "image",
                text: event.target.result,
                time: getCurrentTime(),
                sender: "You"
            };
            users[activeUser].push(imageMessage);
            saveLocalStorage();
            renderMessages();
            updateSidebar();
        };
        reader.readAsDataURL(file);
    }
});

loadLocalStorage();
loadChat(activeUser);
updateSidebar();
