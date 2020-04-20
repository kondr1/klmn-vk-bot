const { VK } = require('vk-io')

const { runChrome, downloadFiles } = require('./chrome')

const vk = new VK({
  token: process.env.TOKEN,
  pollingGroupId: process.env.GROUP_ID
})

vk.updates.hear(/охлади/i, context => {
  context.send({ message: 'Траханье охлаждено' })
  context.sendPhotos('https://sun9-72.userapi.com/c635103/v635103336/5bd0c/JghR3bL4SGY.jpg')
})

vk.updates.hear(/чекни/i, async context => {
  await runChrome()
  await downloadFiles()
})

vk.updates.startPolling().catch(console.error)
