const express = require('express')
const app = express()
const port = 8000
const render = require('./render')

app.get('/:id', (req, res) => {
  const buffer = render.main(req.params.id)
  res.contentType('image/png')
  res.send(buffer)
})

app.get('/gif/:id', (req, res) => {
  const buffer = render.gif(req.params.id)
  res.contentType('image/png')
  res.send(buffer)
})

app.get('/:id/:amp', (req, res) => {
  const buffer = render.main(req.params.id, req.params.amp)
  res.contentType('image/png')
  res.send(buffer)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})