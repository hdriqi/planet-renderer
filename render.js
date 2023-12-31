const { createCanvas } = require('canvas')
const alea = require('alea')
const { createNoise2D } = require('simplex-noise')
const chroma = require('chroma-js')
const ColorHash = require('color-hash').default

const colorHash = new ColorHash()

const generatePlanetOnly = (seed, mrts, prts, arts) => {
  const canvas = createCanvas(256, 256)
  const ctx = canvas.getContext('2d')

  const SIZE = 256

  const imageData = ctx.createImageData(SIZE, SIZE)

  const prng = alea(seed)
  const data = imageData.data
  const noise2D = createNoise2D(prng)
  let t = 1

  const _amp = prng()

  const colors = chroma.scale([colorHash.hex(mrts.toString()), colorHash.hex(prts.toString()), colorHash.hex(arts.toString())]).colors(5)
  const bg = chroma('#000').rgba()

  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {
      let i = x + y * SIZE
      const dx = x - Math.floor(SIZE / 2)
      const dy = y - Math.floor(SIZE / 2)
      const distanceSqrd = dx ** 2 + dy ** 2
      if (distanceSqrd < ((((SIZE / 2) - 4) ** 2))) {
        const nx = x / SIZE - 0.5
        const ny = y / SIZE - 0.5
        let rgba = []
        function fbm_noise(amplitudes, nx, ny) {
          let sum = 0, sumOfAmplitudes = 0
          for (let octave = 0; octave < amplitudes.length; octave++) {
            let frequency = 1 << octave
            sum += amplitudes[octave] * noise2D(nx * frequency, ny * frequency)
            sumOfAmplitudes += amplitudes[octave]
          }
          return sum / sumOfAmplitudes;
        }

        let curAmp = Array(8).fill(1).map((v, i) => {
          // best
          // return i > 0 ? v * ((0.75) ** i) : v
          return i > 0 ? v * ((_amp) ** i) : v
        })

        const e = fbm_noise(curAmp, nx, ny)
        if (e > 0.5) {
          rgba = chroma(colors[0]).rgba()
          // rgba = chroma('white').rgba()
        }
        else if (e > 0.3) {
          rgba = chroma(colors[0]).darken(1).rgba()
          // rgba = chroma('white').darken(1).rgba()
        }
        else if (e > 0) {
          rgba = chroma(colors[0]).darken(2).rgba()
          // rgba = chroma('white').darken(2).rgba()
        }
        else {
          rgba = chroma(colors[4]).brighten().rgba()
        }
        data[i * 4 + 0] = rgba[0] // R value
        data[i * 4 + 1] = rgba[1]
        data[i * 4 + 2] = rgba[2]
        data[i * 4 + 3] = 255
      }
      else if (distanceSqrd <= (((SIZE / 2) ** 2))) {
        data[i * 4 + 0] = 0
        data[i * 4 + 1] = 0
        data[i * 4 + 2] = 0
        data[i * 4 + 3] = 255
      }
      else {
        data[i * 4 + 0] = bg[0]
        data[i * 4 + 1] = bg[1]
        data[i * 4 + 2] = bg[2]
        data[i * 4 + 3] = 0
      }
    }
    t++
  }
  ctx.fillStyle = `rgba(0,0,0,0)`
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // put planet
  ctx.putImageData(imageData, 0, 0)

  function addlight(ctx, x, y) {
    var grd = ctx.createRadialGradient(x, y, SIZE / 16, x, y, SIZE / 2)
    grd.addColorStop(0, "transparent")
    grd.addColorStop(1, "rgba(0,0,0,0.95)")
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, SIZE, SIZE)
  }

  ctx.globalCompositeOperation = "multiply"

  // put light
  addlight(ctx, canvas.width / 2, canvas.height / 2)

  // add transparent background
  ctx.globalCompositeOperation = "source-in"

  const planetImg = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const planetImgData = planetImg.data

  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {
      let i = x + y * SIZE
      const dx = x - Math.floor(SIZE / 2)
      const dy = y - Math.floor(SIZE / 2)
      const distanceSqrd = dx ** 2 + dy ** 2
      if (!(distanceSqrd < ((((SIZE / 2) - 4) ** 2)))) {
        planetImgData[i * 4 + 0] = 0
        planetImgData[i * 4 + 1] = 0
        planetImgData[i * 4 + 2] = 0
        planetImgData[i * 4 + 3] = 0
      }
    }
  }

  ctx.putImageData(planetImg, 0, 0)

  const buf = canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })

  return buf
}

const generatePlanet = (seed, id, px, py, rts, mrts, prts, arts) => {
  const canvas = createCanvas(333, 480)
  const ctx = canvas.getContext('2d')

  const SIZE = 256

  const imageData = ctx.createImageData(SIZE, SIZE)

  const prng = alea(seed)
  const data = imageData.data
  const noise2D = createNoise2D(prng)
  let t = 1

  const _amp = prng()

  const colors = chroma.scale([colorHash.hex(mrts.toString()), colorHash.hex(prts.toString()), colorHash.hex(arts.toString())]).colors(5)
  const bg = chroma('#000').rgba()

  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {
      let i = x + y * SIZE
      const dx = x - Math.floor(SIZE / 2)
      const dy = y - Math.floor(SIZE / 2)
      const distanceSqrd = dx ** 2 + dy ** 2
      if (distanceSqrd < ((((SIZE / 2) - 4) ** 2))) {
        const nx = x / SIZE - 0.5
        const ny = y / SIZE - 0.5
        let rgba = []
        function fbm_noise(amplitudes, nx, ny) {
          let sum = 0, sumOfAmplitudes = 0
          for (let octave = 0; octave < amplitudes.length; octave++) {
            let frequency = 1 << octave
            sum += amplitudes[octave] * noise2D(nx * frequency, ny * frequency)
            sumOfAmplitudes += amplitudes[octave]
          }
          return sum / sumOfAmplitudes;
        }

        let curAmp = Array(8).fill(1).map((v, i) => {
          // best
          // return i > 0 ? v * ((0.75) ** i) : v
          return i > 0 ? v * ((_amp) ** i) : v
        })

        const e = fbm_noise(curAmp, nx, ny)
        if (e > 0.5) {
          rgba = chroma(colors[0]).rgba()
          // rgba = chroma('white').rgba()
        }
        else if (e > 0.3) {
          rgba = chroma(colors[0]).darken(1).rgba()
          // rgba = chroma('white').darken(1).rgba()
        }
        else if (e > 0) {
          rgba = chroma(colors[0]).darken(2).rgba()
          // rgba = chroma('white').darken(2).rgba()
        }
        else {
          rgba = chroma(colors[4]).brighten().rgba()
        }
        data[i * 4 + 0] = rgba[0] // R value
        data[i * 4 + 1] = rgba[1]
        data[i * 4 + 2] = rgba[2]
        data[i * 4 + 3] = 255
      }
      else if (distanceSqrd <= (((SIZE / 2) ** 2))) {
        data[i * 4 + 0] = 0
        data[i * 4 + 1] = 0
        data[i * 4 + 2] = 0
        data[i * 4 + 3] = 255
      }
      else {
        data[i * 4 + 0] = bg[0]
        data[i * 4 + 1] = bg[1]
        data[i * 4 + 2] = bg[2]
        data[i * 4 + 3] = 255
      }
    }
    t++
  }
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // put planet
  ctx.putImageData(imageData, canvas.width / 2 - SIZE / 2, 8 * 8)

  // put NFT ID
  ctx.font = "bold 18px Inconsolata"
  ctx.fillStyle = "white"

  ctx.textAlign = "left"
  ctx.fillText(`#${id}`, 8 * 3, 8 * 4)

  ctx.textAlign = "right"
  ctx.fillText(`(${px}, ${py})`, canvas.width - (8 * 3), 8 * 4)

  // put Rates
  ctx.textAlign = "center"
  ctx.font = "14px Inconsolata"
  ctx.fillText(`RATES`, canvas.width / 2, canvas.height - (8 * 12))
  ctx.font = "bold 18px Inconsolata"
  ctx.fillText(`${rts} RTS`, canvas.width / 2, canvas.height - (8 * 12) + (1.5 * 14))

  // put materials
  ctx.textAlign = "center"
  ctx.font = "14px Inconsolata"
  ctx.fillText(`PLANT`, canvas.width / 2, canvas.height - (8 * 5))
  ctx.font = "bold 18px Inconsolata"
  ctx.fillText(`${prts} PRTS`, canvas.width / 2, canvas.height - (8 * 5) + (1.5 * 14))

  ctx.font = "14px Inconsolata"
  ctx.fillText(`MINERAL`, (8 * 7), canvas.height - (8 * 5))
  ctx.font = "bold 18px Inconsolata"
  ctx.fillText(`${mrts} MRTS`, (8 * 7), canvas.height - (8 * 5) + (1.5 * 14))

  ctx.font = "14px Inconsolata"
  ctx.fillText(`ANIMAL`, canvas.width - (8 * 7), canvas.height - (8 * 5))
  ctx.font = "bold 18px Inconsolata"
  ctx.fillText(`${arts} ARTS`, canvas.width - (8 * 7), canvas.height - (8 * 5) + (1.5 * 14))

  function addlight(ctx, x, y) {
    var grd = ctx.createRadialGradient(x, y, SIZE / 16, x, y, SIZE / 2)
    grd.addColorStop(0, "transparent")
    grd.addColorStop(1, "rgba(0,0,0,0.95)")
    ctx.fillStyle = grd
    ctx.fillRect(canvas.width / 2 - SIZE / 2, 8 * 8, SIZE, SIZE)
  }

  let stars = 250
  for (var i = 0; i < stars; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const radius = Math.random() * 1.2
    const dx = x - Math.floor(canvas.width / 2)
    const dy = y - 190
    const distanceSqrd = dx ** 2 + dy ** 2
    if (distanceSqrd > ((((SIZE + 20) / 2) ** 2))) {
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 360)
      ctx.fillStyle = 'hsla(200,100%,50%,0.8)'
      ctx.fill()
    }
  }

  ctx.globalCompositeOperation = "multiply"

  // put light
  addlight(ctx, canvas.width / 2, 190)

  const buf = canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })

  return buf
}

const main = ({
  seed, id, px, py, rts, mrts, prts, arts
}) => {
  return generatePlanet(seed, id, px, py, rts, mrts, prts, arts)
}

const planetOnly = ({
  seed, id, px, py, rts, mrts, prts, arts
}) => {
  return generatePlanetOnly(seed, id, px, py, rts, mrts, prts, arts)
}

const gif = (seed) => {
  return seed
}

module.exports = {
  main, gif, planetOnly
}