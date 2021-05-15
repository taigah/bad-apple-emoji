const $screen = document.querySelector('code')

async function load_sample() {
  return fetch('sample.raw')
    .then(res => res.blob())
    .then(blob => blob.arrayBuffer())
    .then(buffer => new Sample(new Uint8Array(buffer)))
}

function render_text_frame($screen, text) {
  $screen.textContent = text
}

class Sample {

  constructor(buffer) {
    this.buffer = buffer

    this.width = this.buffer[0]
    this.height = this.buffer[1]
    this.frameCount = (this.buffer.length - 2) / (this.width * this.height)
  }

  pixelValueAt(frame, i, j) {
    const w = this.width
    const h = this.height
    const index = 2 + frame * w * h + i * w + j
    return this.buffer[index] / 255
  }

  pixelSymbolAt(frame, i, j) {
    const value = this.pixelValueAt(frame, i, j)
    return value < 0.5 ? "⬛" : "⬜"
  }

  getLineAt(frame, i) {
    return Array(this.width).fill(0).map((_,j) => this.pixelSymbolAt(frame, i, j)).join('')
  }

  getFrameAt(frame) {
    return Array(this.height).fill(0).map((_,i) => this.getLineAt(frame, i)).join('\n')
  }

}

async function run () {
  const audio = document.getElementById('music')
  audio.play()

  const sample = await load_sample()

  let i = 0
  setInterval(() => {
    const frame = sample.getFrameAt(i)
    render_text_frame($screen, frame)
    i = (i + 1) % sample.frameCount
  }, 1000 / 25)
}

document.addEventListener('click', () => {
  document.querySelector('p').remove()
  run()
})
