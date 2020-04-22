const pptr = require('puppeteer')
const fs = require('fs')
const path = require('path')

let browser = null
let page = null

async function runChrome () {
  if (browser && browser.isConnected()) { return true }

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
  const pageList = await browser.pages()
  pageList.forEach(p => p.close())

  page = await browser.newPage()

  await page.goto(process.env.HOMEWORK_URL)

  const links = await page.$x('//div[@id=\'content\']//a')
  const hrefs = []
  for (const a of links) {
    const href = await (await a.getProperty('href')).jsonValue()
    console.log(href)
    await page.waitFor(1543)
    hrefs.push(href)
    await a.click({ button: 'middle' })
  }
  await page.waitFor(2000)
  return hrefs
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
