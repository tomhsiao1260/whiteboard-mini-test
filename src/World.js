import * as THREE from 'three'

import WhiteBoard from './WhiteBoard'
import CardSet from './CardSet'
// import GUIPanel from './GUIPanel'
import Controls from './Controls'

export default class World {
  constructor(_option) {
    this.time = _option.time
    this.sizes = _option.sizes
    this.camera = _option.camera
    this.renderer = _option.renderer

    this.container = new THREE.Object3D()
    this.container.matrixAutoUpdate = false

    this.start()
  }

  start() {
    this.setControls()
    this.setWhiteBoard()
    this.setCard()
  }

  setControls() {
    this.controls = new Controls({
      time: this.time,
      sizes: this.sizes,
      camera: this.camera,
    })
  }

  setWhiteBoard() {
    this.whiteBoard = new WhiteBoard({
    })
    this.container.add(this.whiteBoard.container)

    this.time.trigger('tick')
  }

  setCard() {
    this.cardSet = new CardSet({
      time: this.time,
      sizes: this.sizes,
      camera: this.camera,
      renderer: this.renderer,
    })

    // generate a card when clicking
    this.time.on('mouseDown', () => {
      if (!this.controls.spacePress) return

      const intersects = this.controls.getRayCast([ this.whiteBoard.container ])
      if (!intersects.length) return

      const pos = intersects[0].point
      const center = new THREE.Vector3(pos.x, pos.y, 0)
      const card = this.cardSet.create(this.controls.mouse, center)
      this.container.add(card)

      this.time.trigger('tick')
    })

    // show mouse pointer when hoving on a card
    this.time.on('mouseMove', () => {
      const intersects = this.controls.getRayCast(this.cardSet.list)

      if (!intersects.length) {
        document.body.style.cursor = 'auto'
        this.camera.controls.enablePan = true
        return
      }
      document.body.style.cursor = 'pointer'
      this.camera.controls.enablePan = false

      const card = intersects[0].object
      this.cardSet.focusCard = card
      this.cardSet.updateDOM(card)
    })

    // update card's scene
    this.cardSet.viewer.controls.addEventListener('change', () => this.cardSet.updateAllBuffer())
    // make div window fit into the current focusing card
    this.time.on('tick', () => { this.cardSet.updateDOM(this.cardSet.focusCard) })
  }
}

