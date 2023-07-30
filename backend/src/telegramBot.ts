import TelegramBot from "node-telegram-bot-api";

export let bot: any;

//Create the bot
export function startBot() {
  
  if (!process.env.TELEGRAM_TOKEN) {
    console.log(
      "Plase the insert the telegram token in relative enviroment variable"
    );
    return;
  }
  bot = new TelegramBot(process.env.TELEGRAM_TOKEN);

  bot.onText(/\/start/, (msg: any) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Your chat ID is ${chatId}`);
  });

  bot.onText(/\/chatID/, (msg: any) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Your chat ID is ${chatId}`);
  });

  bot.startPolling();
}
