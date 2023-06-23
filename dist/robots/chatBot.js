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
const axios_1 = __importDefault(require("axios"));
const emoji_1 = require("@nlpjs/emoji");
const basic_1 = require("@nlpjs/basic");
const core_1 = require("@nlpjs/core");
const functions_1 = require("./functions");
const corpus_pt_json_1 = __importDefault(require("./corpus-pt.json"));
const normalizer = new core_1.Normalizer();
let manager;
function train(nlp) {
    return __awaiter(this, void 0, void 0, function* () {
        const dock = yield (0, basic_1.dockStart)({ use: ["Basic", "LangPt"] });
        nlp = dock.get('nlp');
        yield nlp.addCorpus(corpus_pt_json_1.default);
        nlp.addLanguage("pt");
        yield nlp.train();
        return nlp;
    });
}
function compute(nlp, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        msg = normalizer.normalize(msg);
        const reply = yield nlp.process((0, emoji_1.removeEmojis)(msg));
        return reply;
    });
}
// The input given to the bot
const chatBot = (number, name, input, wamid) => __awaiter(void 0, void 0, void 0, function* () {
    train(manager)
        .then((nlp) => __awaiter(void 0, void 0, void 0, function* () {
        const answer = yield compute(nlp, input);
        if (answer.intent == "usuario.precisadeconselhos") {
            axios_1.default.get("https://api.adviceslip.com/advice")
                .then((res) => __awaiter(void 0, void 0, void 0, function* () {
                (0, functions_1.sendTranslatedMessage)(number, `${res.data.slip.advice}`, wamid, "en");
            })).catch(err => {
                (0, functions_1.sendMessage)(number, "Not available", wamid);
            });
        }
        else if (answer.intent == "piada") {
            axios_1.default.get("https://v2.jokeapi.dev/joke/Any")
                .then((res) => __awaiter(void 0, void 0, void 0, function* () {
                if (res.data.type == "single") {
                    (0, functions_1.sendTranslatedMessage)(number, `*Category:* ${res.data.category}\n\n${res.data.joke}`, wamid, "en");
                }
                else {
                    (0, functions_1.sendTranslatedMessage)(number, `*Category:* ${res.data.category}\n\n${res.data.setup}\n*R:* ${res.data.delivery}`, wamid, "en");
                }
            })).catch(err => {
                (0, functions_1.sendMessage)(number, "Indisponivel.", wamid);
            });
        }
        else if (answer.intent == "noticias") {
            yield (0, functions_1.sendNewsCategory)(number, wamid);
        }
        else if (answer.intent == "None" || answer.intent == "jeffer") {
            (0, functions_1.sendMessage)(number, `${answer.answer}`, wamid);
        }
        else if (answer.intent == "usuario.informacao") {
            (0, functions_1.sendMessage)(number, `${answer.answer.replace(/{{name}}/gi, name)}`, wamid);
        }
        else if (answer.intent == "usuario.tedio") {
            axios_1.default.get("https://www.boredapi.com/api/activity")
                .then((res) => __awaiter(void 0, void 0, void 0, function* () {
                (0, functions_1.sendTranslatedMessage)(number, `*Type:* ${(0, functions_1.toTitleCase)(res.data.type)}\n*Participants:* ${res.data.participants}\n*Activity:* ${res.data.activity}`, wamid, "en");
            })).catch(err => {
                (0, functions_1.sendMessage)(number, "Indisponivel.", wamid);
            });
        }
        else if (answer.intent == "citacoes") {
            axios_1.default.get("https://api.fisenko.net/v1/quotes/en/random")
                .then((res) => __awaiter(void 0, void 0, void 0, function* () {
                (0, functions_1.sendTranslatedMessage)(number, `${res.data.text} - _${res.data.author.name}_`, wamid, "en");
            })).catch(err => {
                (0, functions_1.sendMessage)(number, "Indisponivel", wamid);
            });
        }
        else if (answer.intent == "citacoes.programacao") {
            axios_1.default.get("https://programming-quotes-api.herokuapp.com/quotes/random")
                .then((res) => __awaiter(void 0, void 0, void 0, function* () {
                (0, functions_1.sendTranslatedMessage)(number, `${res.data.en} - _${res.data.author}_`, wamid, "en");
            })).catch(err => {
                (0, functions_1.sendMessage)(number, "Indisponivel", wamid);
            });
        }
        else if (answer.intent == "usuario.fome") {
            const res = yield axios_1.default.get("https://foodish-api.herokuapp.com/api/");
            try {
                (0, functions_1.sendImage)(number, `${res.data.image}`, `${answer.answer}`, wamid);
            }
            catch (err) {
                (0, functions_1.sendMessage)(number, `Not available`, wamid);
            }
        }
        else {
            (0, functions_1.sendMessage)(number, `${answer.answer}`, wamid);
        }
    }))
        .catch(err => console.log(err));
});
exports.default = chatBot;
