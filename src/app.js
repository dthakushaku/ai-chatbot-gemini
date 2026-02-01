const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector("#message-input");

const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");

// API setup
// const API_KEY = "PASTE-YOUR-API-KEY";
// const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
// Nơi lấy API https://aistudio.google.com/api-keys

const API_KEY = "PASTE-YOUR-API-KEY";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`;

// khởi tạo dữ liệu tin nhắn người dùng và tệp
const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null,
    },
};
// Lưu trữ lịch sử trò chuyện
const chatHistory = [];
const initialInputHeight = messageInput.scrollHeight;


closeChatbot.addEventListener("click", () => { document.body.classList.remove("show-chatbot") });
chatbotToggler.addEventListener("click", () => { document.body.classList.toggle("show-chatbot") });