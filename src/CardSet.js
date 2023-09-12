import * as THREE from 'three'
import CardA from './core/CardA'
import CardB from './core/CardB'
import { CopyShader } from './core/CopyShader'

export default class CardSet {
  constructor(_option) {
    this.time = _option.time
    this.sizes = _option.sizes
    this.camera = _option.camera
    this.renderer = _option.renderer

    this.list = []
  }

  setDOM() {
    const cardDOM = document.createElement('div')

    cardDOM.className = 'cardDOM'
    cardDOM.style.backgroundColor = 'rgba(0, 0, 0, 0.0)'
    cardDOM.style.border = '1px solid white'
    cardDOM.style.display = 'none'
    cardDOM.style.position = 'absolute'
    document.body.appendChild(cardDOM)

    return cardDOM
  }

  create(mode, mouse, center) {
    let viewer
    const dom = this.setDOM()

    if (mode === 'cardA') viewer = new CardA({ renderer: this.renderer, canvas: dom })
    if (mode === 'cardB') viewer = new CardB({ renderer: this.renderer, canvas: dom })

    const geometry = new THREE.PlaneGeometry(1, 1)
    const material = new CopyShader()
    material.uniforms.tDiffuse.value = viewer.buffer.texture

    const card = new THREE.Mesh(geometry, material)
    card.position.copy(center)
    card.userData = { center, mode, viewer, dom, w: 1, h: 1 }

    viewer.render()
    this.list.push(card)

    return card
  }

  updateCanvas(card) {
    if (!card) return

    const { width, height } = this.sizes.viewport
    const { center, dom, w, h } = card.userData

    const bl = new THREE.Vector3(center.x - w / 2, center.y - h / 2, 0)
    const tr = new THREE.Vector3(center.x + w / 2, center.y + h / 2, 0)
    // bottom-left (-1, -1) top-right (1, 1)
    const pbl = bl.clone().project(this.camera.instance)
    const ptr = tr.clone().project(this.camera.instance)

    dom.style.left = `${ (pbl.x + 1) * width * 0.5 }px`
    dom.style.bottom = `${ (pbl.y + 1) * height * 0.5 }px`
    dom.style.width = `${ (ptr.x - pbl.x) * width * 0.5 }px`
    dom.style.height = `${ (ptr.y - pbl.y) * height * 0.5 }px`
    dom.style.display = 'inline'
  }

  hideCanvas(card) {
    const { dom } = card.userData
    dom.style.display = 'none'
  }
}
