const TelegramApi = require("node-telegram-bot-api");

const token = "6113351503:AAFWsIqxOpzMNj95wmPcfmsBrJTTmLdv70g";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const { gameOption, againOption } = require("./options");

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `I imagine a number from 0 to 9, you should try to guess what is the number @-@`
  );
  const numberRandom = Math.floor(Math.random() * 10);
  chats[chatId] = numberRandom;
  await bot.sendMessage(chatId, `Please guess...`, gameOption);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Welcome message ^-^" },
    { command: "/info", description: "Info about the project #_#" },
    { command: "/game", description: `Guess the number game` },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const userName = msg.chat.username;
    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tgram.ru/wiki/stickers/img/BongoCatb/gif/1.gif"
      );
      return bot.sendMessage(
        chatId,
        `Welcome my dear ${userName}, are you hear for canteen's menu?`
      );
    }
    if (text === "/info") {
      return bot.sendMessage(chatId, `This bot was created by @KaDmRo`);
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, `I don't undersand you :(`);
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `YOUR GUESS IS CORRECT, good job body!`,
        againOption
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Incorrect, number was ${chats[chatId]}:(`,
        againOption
      );
    }
  });
};

start();
