<script setup>
import { ref, onMounted, defineEmits } from "vue";
import { fabric } from "fabric";
const canvasRef = ref();
const emit = defineEmits([
  "canvas-created",
  // "mouse:dblclick",
  "click:selected",
  "click:updated",
]);

onMounted(() => {
  const canvas = new fabric.Canvas(canvasRef.value);
   // Configuraciones globales para objetos de tela
  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerColor = 'red';
  fabric.Object.prototype.cornerStyle = 'circle';
  fabric.Object.prototype.borderColor = 'red';
  fabric.Object.prototype.padding = '5';

  // canvas.on("mouse:dblclick", (e) => {
  //   emit("mouse:dblclick", e);
  // });
  canvas.on("selection:created", (e) => {
    emit("click:selected", e);
  });
  canvas.on("selection:updated", (e) => {
    emit("click:selected", e);
  });
  canvas.on('object:modified', (e) => {
        emit('click:updated', e)
    })
  emit("canvas-created", canvas);
});
</script>

<template>
  <canvas ref="canvasRef" width="1900" height="1000"></canvas>
</template>

<style lang="scss">
canvas {
  border: 1px solid var(--grey-light-22);
  border-radius: 8px;
  width: 100% !important; 
  height: 100% !important;
  font-family: "Saira", sans-serif ;
}

.canvas-container{
    width: 100% !important; 
    height: 100% !important;
}
</style>
