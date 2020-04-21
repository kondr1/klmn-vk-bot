const md5File = require('md5-file')
const fs = require('fs')

async function getFolderHashes (directoryPath) {
  try {
    const files = fs.readdirSync(directoryPath)
    const res = []
    for (const file of files) {
      const hash = await md5File(file)
      res.push({ file, hash })
    }
    return res
  } catch (err) {
    console.log('Unable to scan directory: ' + err)
  }
}

module.exports = getFolderHashes
