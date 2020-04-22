
const MongoClient = require('mongodb').MongoClient

const collectionName1 = 'hashes'

let client = new MongoClient(process.env.MONGODB_URI)

async function mongo () {
  if (client && !client.isConnected()) {
    try {
      client = await client.connect()
    } catch (err) {
      // YOU CAN'T HANDLE THE ERROR WITH SIMPLE PRINT AND DON'T DO ANYTHING !!!
      console.error(`haha error handling go brrr: ${err} `)
    }
  }

  const db = client.db()

  return {
    async checkFile (filename, hash) {
      let results

      try {
        results = await db.collection(collectionName1)
          .find({ filename })
          .toArray()
      } catch (err) {
        console.error(`haha error handling go brrr: ${err} `)
      }

      if (results && results.length > 0) {
        console.log(`${filename} hash ${hash} in mongo is ${results[0].hash}`)
        if (results[0].hash !== hash) {
          db.collection(collectionName1).updateOne(results[0], { $set: { hash: hash } })
        } else {
          return true
        }
      } else {
        console.log(`${filename} hash ${hash} not in db`)
        try {
          db.collection(collectionName1).insertOne({
            filename: filename,
            hash: hash
          })
        } catch (err) {
          console.error(`haha error handling go brrr: ${err} `)
        }
      }
    }
  }
}

module.exports = mongo
