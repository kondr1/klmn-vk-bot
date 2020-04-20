const md5File = require('md5-file')
const fs = require('fs')

// const getCurrentHashExample = (filename) => {
//   return 'kek'
// }

// const actionExample = (filePath) => {
//   console.log(filePath)
// }

const calcHash = (directoryPath, filename, getCurrentHash, action) => {
  const filePath = `${directoryPath}/${filename}`
  md5File(filePath)
    .then((hash) => {
      if (getCurrentHash(filename) !== hash) {
        action(filename)
      }
    })
    .catch((reason) => {
      console.log(`Error: ${reason}`)
    })
}

export const checkFileUpdates = (directoryPath, getCurrentHash, action) => {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.log('Unable to scan directory: ' + err)
    }
    files.forEach((file) => {
      calcHash(directoryPath, file, getCurrentHash, action)
    })
  })
}

// checkFileUpdates('src', getCurrentHashExample, actionExample)
