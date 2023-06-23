"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNew = exports.sendTranslatedMessage = exports.generateRandomInteger = exports.getNewsByCategory = exports.sendNewsCategory = exports.toTitleCase = exports.removeCommand = exports.sendDevContact = exports.sendAudio = exports.sendImage = exports.sendMessage = exports.sendNewsList = void 0;
const axios_1 = __importDefault(require("axios"));
const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WA_TOKEN}`
    }
};
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
exports.toTitleCase = toTitleCase;
const sendMessage = (number, message, wmaid) => __awaiter(void 0, void 0, void 0, function* () {
    if (wmaid) {
        axios_1.default.post(`https://graph.facebook.com/v14.0/${process.env.WAID}/messages`, {
            messaging_product: 'whatsapp',
            context: {
                message_id: wmaid
            },
            to: number,
            type: "text",
            text: {
                "body": message,
            }
        }, axiosConfig)
            .then(function (response) {
            return true;
        })
            .catch(function (error) {
            console.log(error);
        });
    }
    else {
        axios_1.default.post(`https://graph.facebook.com/v14.0/${process.env.WAID}/messages`, {
            messaging_product: 'whatsapp',
            to: number,
            type: "text",
            text: {
                "body": message,
            }
        }, axiosConfig)
            .then(function (response) {
            return true;
        })
            .catch(function (error) {
            console.log(error);
        });
    }
});
exports.sendMessage = sendMessage;
const sendTranslatedMessage = (number, message, wmaid, lang) => __awaiter(void 0, void 0, void 0, function* () {
    const isEn = lang == "en";
    const translatedMessage = yield axios_1.default.get("https://api.mymemory.translated.net/get", {
        params: {
            q: message,
            langpair: isEn ? "en-us|pt-pt" : "pt-pt|en-us"
        }
    });
    sendMessage(number, translatedMessage.data.responseData.translatedText, wmaid);
});
exports.sendTranslatedMessage = sendTranslatedMessage;
const sendNewsCategory = (number, wmaid) => __awaiter(void 0, void 0, void 0, function* () {
    axios_1.default.post(`https://graph.facebook.com/v14.0/${process.env.WAID}/messages`, {
        messaging_product: 'whatsapp',
        context: {
            message_id: wmaid
        },
        to: number,
        type: "interactive",
        interactive: {
            type: "button",
            header: {
                type: "text",
                text: "Notícias"
            },
            body: {
                text: "As notícias são retiradas do site *Kabum Digital*\n\nSelecione uma opção"
            },
            footer: {
                text: "https://kabum.digital/"
            },
            action: {
                buttons: [
                    {
                        type: "reply",
                        reply: {
                            id: "news.mostread",
                            title: "Mais lidas"
                        }
                    },
                    {
                        type: "reply",
                        reply: {
                            id: "news.random",
                            title: "Aleatórias"
                        }
                    },
                    {
                        type: "reply",
                        reply: {
                            id: "news.latest",
                            title: "Última notícia"
                        }
                    }
                ]
            }
        }
    }, axiosConfig)
        .then(function (response) {
        return true;
    })
        .catch(function (error) {
        console.log(error);
    });
});
exports.sendNewsCategory = sendNewsCategory;
const sendNew = (link, destination, wmaid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield getNew(link);
        let caption = `*${post.title}*\n\n\n`;
        post.content.map((item) => {
            caption += `${item}\n\n`;
        });
        caption += `\n${post.link}`;
        sendImage(destination, post.image, caption, wmaid);
    }
    catch (err) {
        console.log(err);
    }
});
exports.sendNew = sendNew;
const sendNewsList = (number, wmaid, posts) => __awaiter(void 0, void 0, void 0, function* () {
    const sections = posts.map((item) => {
        const DESCRIPTION_LIMIT = 68;
        const aboveTitleDescription = DESCRIPTION_LIMIT < item.title.length;
        const dotsOrEmpyDescription = aboveTitleDescription ? "..." : "";
        return {
            title: posts.indexOf(item) + 1,
            rows: [
                {
                    id: item.link,
                    title: "Ler mais",
                    description: item.title.substring(0, DESCRIPTION_LIMIT) + dotsOrEmpyDescription
                }
            ]
        };
    });
    axios_1.default.post(`https://graph.facebook.com/v14.0/${process.env.WAID}/messages`, {
        messaging_product: 'whatsapp',
        context: {
            message_id: wmaid
        },
        to: number,
        type: "interactive",
        interactive: {
            type: "list",
            header: {
                type: "text",
                text: "Noticias"
            },
            body: {
                text: "Selecione uma noticia."
            },
            action: {
                button: "Ver noticias",
                sections,
            }
        }
    }, axiosConfig)
        .then(function (response) {
        return true;
    })
        .catch(function (error) {
        console.log(error);
    });
});
exports.sendNewsList = sendNewsList;
const getNew = (link) => __awaiter(void 0, void 0, void 0, function* () {
    const id = link.replace("https://kabum.digital/", "");
    const data = yield axios_1.default.get(`https://kabum-digital.herokuapp.com/post/${id}`)
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        const post = res.data.post;
        return post;
    })).catch(err => {
        throw new Error("Erro");
    });
    return data;
});
const sendAudio = (number, link, wmaid) => __awaiter(void 0, void 0, void 0, function* () {
    axios_1.default.post(`https://graph.facebook.com/v14.0/${process.env.WAID}/messages`, {
        messaging_product: 'whatsapp',
        context: {
            message_id: wmaid
        },
        to: number,
        type: "audio",
        audio: {
            link: link,
        }
    }, axiosConfig)
        .then(function (response) {
        return true;
    })
        .catch(function (error) {
        console.log(error);
    });
});
exports.sendAudio = sendAudio;
const sendImage = (number, link, caption, wmaid) => __awaiter(void 0, void 0, void 0, function* () {
    axios_1.default.post(`https://graph.facebook.com/v14.0/${process.env.WAID}/messages`, {
        messaging_product: 'whatsapp',
        context: {
            message_id: wmaid
        },
        to: number,
        type: "image",
        image: {
            link: link,
            caption: caption
        }
    }, axiosConfig)
        .then(function (response) {
        return true;
    })
        .catch(function (error) {
        console.log(error);
    });
});
exports.sendImage = sendImage;
const sendDevContact = (number, wmaid) => __awaiter(void 0, void 0, void 0, function* () {
    axios_1.default.post(`https://graph.facebook.com/v14.0/${process.env.WAID}/messages`, {
        messaging_product: 'whatsapp',
        context: {
            message_id: wmaid
        },
        to: number,
        type: "contacts",
        contacts: [
            {
                "birthday": "2006-04-14",
                "emails": [
                    {
                        "email": "jeffersunde72@gmail.com",
                        "type": "WORK"
                    }
                ],
                "name": {
                    "first_name": "Jeffer",
                    "formatted_name": "Jeffer Marcelino",
                    "last_name": "Sunde"
                },
                "org": {
                    "company": "CEG Microsystems",
                    "department": "Tech",
                    "title": "Developer"
                },
                "phones": [
                    {
                        "phone": "+258 84 399 7730",
                        "type": "WORK",
                        "wa_id": "258843997730"
                    },
                    {
                        "phone": "+258 87 012 6103",
                        "type": "HOME"
                    }
                ],
                "urls": [
                    {
                        "url": "https://github.com/JefferMarcelino",
                        "type": "WORK"
                    }
                ]
            }
        ]
    }, axiosConfig)
        .then(function (response) {
        return true;
    })
        .catch(function (error) {
        console.log(error);
    });
});
exports.sendDevContact = sendDevContact;
const removeCommand = (command, text) => {
    const slipted = text.split(" ");
    let params = "";
    slipted.forEach(item => {
        if (item.toLowerCase() !== command) {
            params += ` ${item}`;
        }
    });
    return params.trim();
};
exports.removeCommand = removeCommand;
const getNewsByCategory = (category) => __awaiter(void 0, void 0, void 0, function* () {
    if (category == "mostread") {
        const data = axios_1.default.get("https://kabum-digital.herokuapp.com/mostread")
            .then((res) => __awaiter(void 0, void 0, void 0, function* () {
            const posts = res.data.posts;
            return posts;
        })).catch(err => {
            throw new Error("Erro");
        });
        return data;
    }
    else if (category == "random") {
        const data = axios_1.default.get("https://kabum-digital.herokuapp.com/random")
            .then((res) => __awaiter(void 0, void 0, void 0, function* () {
            const posts = res.data.posts;
            return posts;
        })).catch(err => {
            throw new Error("Erro");
        });
        return data;
    }
});
exports.getNewsByCategory = getNewsByCategory;
const generateRandomInteger = (max) => {
    return Math.floor(Math.random() * max) + 1;
};
exports.generateRandomInteger = generateRandomInteger;
