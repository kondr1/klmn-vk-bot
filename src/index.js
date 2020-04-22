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
  context.send('Ща чекну, погоди')
  try {
    await runChrome()
    await downloadFiles()
    const hashes = await getHashes(process.env.OUTDIR)
    if (hashes && hashes.length > 0) {
      context.send(`Лежит там ${hashes.length} файликов с задачами`)
      for (const h of hashes) {
        context.send(`${h.file}`)
      }
      context.send('Смотрю все ли там ок')
    }
    let haveNoUpdates = true
    for (const h of hashes) {
      const ok = (await mongo()).checkFile(h.file)
      if (!ok) {
        haveNoUpdates = false
        context.send({ message: `⚠ Файлик ${h.file} обновился ⚠` })
      }
    }
    if (haveNoUpdates) context.send('Ничего не поменялось, со времени предыдущей проверки, все норм 😎')
  } catch (err) {
    context.send('Чет у меня не получается чекнуть 😥')
  }
})

vk.updates.start({
  webhook: {
    path: '/',
    port: process.env.PORT
  }
}).catch(console.error)
