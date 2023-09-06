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
      let mode
      console.log(this.controls.numKeyPress)
      if (this.controls.numKeyPress[0]) mode = 'cardA'
      if (this.controls.numKeyPress[1]) mode = 'cardB'
      if (!mode) return

      const intersects = this.controls.getRayCast([ this.whiteBoard.container ])
      if (!intersects.length) return

      const pos = intersects[0].point
      const center = new THREE.Vector3(pos.x, pos.y, 0)
      const card = this.cardSet.create(mode, this.controls.mouse, center)
      this.container.add(card)

      this.time.trigger('tick')
    })
  }
}

