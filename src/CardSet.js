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
  }

  setDOM() {
    const cardDOM = document.createElement('div')

    cardDOM.className = 'cardDOM'
    cardDOM.style.backgroundColor = 'rgba(0, 0, 0, 0.0)'
    cardDOM.style.border = '1px solid white'
    cardDOM.style.display = 'none'
    cardDOM.style.position = 'absolute'
    // document.body.appendChild(this.$card)

    return cardDOM
  }

  create(mode, mouse, center) {
    let viewer
    const cardDOM = this.setDOM()

    if (mode === 'cardA') viewer = new CardA({ renderer: this.renderer, canvas: cardDOM })
    if (mode === 'cardB') viewer = new CardB({ renderer: this.renderer, canvas: cardDOM })

    const geometry = new THREE.PlaneGeometry(1, 1)
    const material = new CopyShader()
    material.uniforms.tDiffuse.value = viewer.buffer.texture

    const card = new THREE.Mesh(geometry, material)
    card.position.copy(center)
    card.userData = { mode, viewer }

    viewer.render()

    return card
  }
}
