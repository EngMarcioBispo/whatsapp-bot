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
exports.getWeatherByCords = exports.getWeatherByCityName = void 0;
const axios_1 = __importDefault(require("axios"));
const getLatAndLonByCityName = (city) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield axios_1.default.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city.replace(" ", "%20")}&limit=1&appid=${process.env.WEATHER_API}&lang=pt`)
        .then(function (response) {
        return response.data[0];
    })
        .then((response) => __awaiter(void 0, void 0, void 0, function* () {
        return { lat: response.lat, lon: response.lon };
    }))
        .catch((error) => {
        return error;
    });
    return data;
});
const getWeatherByCords = (lat, lon) => __awaiter(void 0, void 0, void 0, function* () {
    const weather = yield axios_1.default.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API}&units=metric&lang=pt`)
        .then(function (response) {
        return response.data;
    })
        .then((response) => __awaiter(void 0, void 0, void 0, function* () {
        return response;
    }))
        .catch((error) => {
        console.log(error);
    });
    return weather;
});
exports.getWeatherByCords = getWeatherByCords;
const getWeatherByCityName = (city) => __awaiter(void 0, void 0, void 0, function* () {
    const { lat, lon } = yield getLatAndLonByCityName(city);
    const weather = yield getWeatherByCords(lat, lon);
    return weather;
});
exports.getWeatherByCityName = getWeatherByCityName;
