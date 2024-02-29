<script setup>
import { ref, onMounted, defineEmits } from "vue"
import { fabric } from "fabric"
const canvasRef = ref()
const emit = defineEmits([
  "canvas-created",
  // "mouse:dblclick",
  "click:selected",
  "click:updated",
  "mouse:moving",
  "mouse:move"
])

onMounted(() => {
  const canvas = new fabric.Canvas(canvasRef.value)
   // Configuraciones globales para objetos de tela
  fabric.Object.prototype.transparentCorners = false
  fabric.Object.prototype.cornerColor = 'blue'
  fabric.Object.prototype.cornerStyle = 'circle'
  fabric.Object.prototype.borderColor = 'gray'
  fabric.Object.prototype.padding = '0'

  // canvas.on("mouse:dblclick", (e) => {
  //   emit("mouse:dblclick", e)
  // })
  canvas.on("selection:created", (e) => {
    emit("click:selected", e)
  })
  canvas.on("selection:updated", (e) => {
    emit("click:selected", e)
  })
  canvas.on('object:modified', (e) => {
    emit('click:updated', e)
  })
  canvas.on("selection:cleared", (e) => {
    emit("click:selected", e)
  })
  canvas.on("object:moving", (e) => {
    emit("mouse:moving", e)
  })
  canvas.on("mouse:move", (e) => {
    emit("mouse:move", e)
  })

  canvas.on('mouse:wheel', (e) => {
    let delta = e.e.deltaY
    let zoom = canvas.getZoom()
    zoom *= 0.999 ** delta
    if (zoom > 20) zoom = 20
    if (zoom < 0.01) zoom = 0.01
    canvas.zoomToPoint({ x: e.e.offsetX, y: e.e.offsetY }, zoom)
    e.e.preventDefault()
    e.e.stopPropagation()
  })
  emit("canvas-created", canvas)
})
</script>

<template>
  <canvas ref="canvasRef" width="1900" height="1000"></canvas>
</template>

<style lang="scss">
canvas {
  width: 100% !important;
  height: 100% !important;
}

.canvas-container{
  width: 100% !important;
  height: 100% !important;
}
</style>
