const pptr = require('puppeteer')
const fs = require('fs')
const path = require('path')

let browser = null
let page = null

const sleep = t => new Promise((resolve) => setTimeout(() => resolve(), t))

async function runChrome () {
  if (browser && browser.isConnected()) {
    if (!page.isClosed()) {
      return true
    } else {
      page = await browser.newPage()
      return true
    }
  }
  browser = await pptr.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })

  await browser.on('targetcreated', async () => {
    const pageList = await browser.pages()
    console.log(pageList.length)
    pageList.forEach((page) => {
      page._client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: process.env.OUTDIR
      })
    })
  })

  page = await browser.newPage()
  return true
}

async function downloadFiles () {
  await page.goto(process.env.HOMEWORK_URL)
  const links = await page.$x('//div[@id=\'content\']//a')
  for (const a of links) {
    await sleep(1543)
    await a.click({ button: 'middle' })
  }
}

async function cleanFolder () {
  fs.readdir(process.env.OUTDIR, (err, files) => {
    if (err) throw err

    for (const file of files) {
      fs.unlink(path.join(process.env.OUTDIR, file), err => {
        if (err) throw err
      })
    }
  })
}

module.exports = {
  runChrome,
  downloadFiles,
  cleanFolder
}
