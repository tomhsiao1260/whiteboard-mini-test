import * as THREE from 'three'
import ViewerCore from './core/ViewerCore'
import { CopyShader } from './core/CopyShader'

export default class CardSet {
  constructor(_option) {
    this.time = _option.time
    this.sizes = _option.sizes
    this.camera = _option.camera
    this.renderer = _option.renderer

    this.list = []
    this.focusCard = null
    this.$card = document.createElement('div')

    this.setDOM()
    this.setViewer()
  }

  setDOM() {
    this.$card.className = 'cardDOM'
    this.$card.style.backgroundColor = 'rgba(0, 0, 0, 0.0)'
    this.$card.style.border = '1px solid white'
    this.$card.style.display = 'none'
    this.$card.style.position = 'absolute'
    document.body.appendChild(this.$card)
  }

  setViewer() {
    const { width, height } = this.sizes.viewport
    this.viewer = new ViewerCore({ renderer: this.renderer, canvas: this.$card })
  }

  create(mouse, center) {
    const { width, height } = this.sizes.viewport
    const canvas = this.$card
    const geometry = new THREE.PlaneGeometry(1, 1)
    const material = new CopyShader()
    const card = new THREE.Mesh(geometry, material)

    material.uniforms.tDiffuse.value = this.viewer.buffer.texture
    card.userData = { center, canvas, w: 1, h: 1 }
    card.position.copy(center)
    this.focusCard = card
    this.list.push(card)

    this.updateViewer(this.viewer, mouse)

    return card
  }

  updateViewer(viewer, mouse) {
    const loadingDIV = this.setLoadingText(mouse)

    this.viewer.render()
    this.time.trigger('tick')
    loadingDIV.style.display = 'none'
  }

  updateAllBuffer() {
    this.viewer.render()
    this.time.trigger('tick')
  }

  setLoadingText(mouse) {
    const loadingDIV = document.createElement('div')
    loadingDIV.className = 'loadingCard'
    loadingDIV.innerText = 'Loading ...'
    loadingDIV.style.left = `${100 * (1 + mouse.x) / 2}%`
    loadingDIV.style.top = `${100 * (1 - mouse.y) / 2}%`
    loadingDIV.style.display = 'inline'
    document.body.appendChild(loadingDIV)

    return loadingDIV
  }

  updateDOM(card) {
    if (!card) return

    const { width, height } = this.sizes.viewport
    const { center, canvas, w, h } = card.userData

    const bl = new THREE.Vector3(center.x - w / 2, center.y - h / 2, 0)
    const tr = new THREE.Vector3(center.x + w / 2, center.y + h / 2, 0)
    // bottom-left (-1, -1) top-right (1, 1)
    const pbl = bl.clone().project(this.camera.instance)
    const ptr = tr.clone().project(this.camera.instance)

    this.$card.style.left = `${ (pbl.x + 1) * width * 0.5 }px`
    this.$card.style.bottom = `${ (pbl.y + 1) * height * 0.5 }px`
    this.$card.style.width = `${ (ptr.x - pbl.x) * width * 0.5 }px`
    this.$card.style.height = `${ (ptr.y - pbl.y) * height * 0.5 }px`
    this.$card.style.display = 'inline'
  }

  hideCanvas() {
    this.$card.style.display = 'none'
  }
}
