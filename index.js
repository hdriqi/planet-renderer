require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const port = 8000
const render = require('./render')

const { MongoClient } = require('mongodb')

const client = new MongoClient(process.env.MONGO_URI)

app.use(cors())

app.get('/render/:id', async (req, res) => {
  const data = await client.db(process.env.DB).collection('planets').findOne({ nft_id: parseInt(req.params.id) })

  const buffer = render.main({
    seed: data.digest,
    id: data.nft_id,
    px: data.x,
    py: data.y,
    rts: data.rts,
    mrts: data.mrts,
    prts: data.prts,
    arts: data.arts
  })

  res.contentType('image/png')
  res.send(buffer)
})

app.get('/planets/:id', async (req, res) => {
  const data = await client.db(process.env.DB).collection('planets').findOne({ nft_id: parseInt(req.params.id) })

  const buffer = render.main({
    seed: data.digest,
    id: data.nft_id,
    px: data.x,
    py: data.y,
    rts: data.rts,
    mrts: data.mrts,
    prts: data.prts,
    arts: data.arts
  })

  res.contentType('image/png')
  res.send(buffer)
})

app.get('/planets-only/:id', async (req, res) => {
  console.log(process.env.DB)
  const data = await client.db(process.env.DB).collection('planets').findOne({ nft_id: parseInt(req.params.id) })
  console.log(data)

  const buffer = render.planetOnly({
    seed: data.digest,
    id: data.nft_id,
    px: data.x,
    py: data.y,
    rts: data.rts,
    mrts: data.mrts,
    prts: data.prts,
    arts: data.arts
  })

  res.contentType('image/png')
  res.send(buffer)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})