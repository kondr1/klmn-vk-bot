const { VK } = require('vk-io')
const { runChrome, downloadFiles } = require('./chrome')
const getHashes = require('./hash')
const mongo = require('./mongo')

const vk = new VK({
  token: process.env.TOKEN,
  pollingGroupId: process.env.GROUP_ID,
  webhookSecret: process.env.SECRET,
  webhookConfirmation: process.env.CONFIRM
})

vk.updates.hear(/охлади/i, context => {
  context.send({ message: 'Траханье охлаждено' })
  context.sendPhotos('https://sun9-72.userapi.com/c635103/v635103336/5bd0c/JghR3bL4SGY.jpg')
})

vk.updates.hear(/чекни/i, async context => {
  await runChrome()
  await downloadFiles()
  const hashs = await getHashes(process.env.OUTDIR)
  for (const h of hashs) {
    const ok = (await mongo()).checkFile(h.file)
    if (!ok) {
      context.send({ message: `Файлик ${h.file} обновился` })
    }
  }
})

vk.updates.start({
  webhook: {
    path: '/',
    port: process.env.PORT
  }
}).catch(console.error)
