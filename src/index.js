const VkBot = require('node-vk-bot-api')

const bot = new VkBot(process.env.TOKEN)

bot.command('/Углепластик охлади траханье', (ctx) => {
  ctx.reply('Траханье охлажденно')
})
bot.command('/start', (ctx) => {
  ctx.reply('Привет')
})

bot.startPolling()
