<script setup>
import { ref, onMounted, defineEmits } from "vue";
import { fabric } from "fabric";
const canvasRef = ref();
const emit = defineEmits([
  "canvas-created",
  "mouse:dblclick",
  "click:selected",
  "toggle:object",
]);

const deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

onMounted(() => {
  const canvas = new fabric.Canvas(canvasRef.value);

   // Configuraciones globales para objetos de tela
   fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = 'red';
    fabric.Object.prototype.cornerStyle = 'circle';
    fabric.Object.prototype.borderColor = 'red';
    fabric.Object.prototype.padding = '25';

  // Crear un objeto rectángulo
  const rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: 'blue',
    width: 50,
    height: 50
  });

  // Crear un objeto de imagen con el icono de eliminación
  fabric.Image.fromURL(deleteIcon, function(img) {
    img.scaleToWidth(50);
    img.scaleToHeight(50);
    img.set({
      left: 200,
      top: 200,
      selectable: false
    });

    // Añadir objetos al canvas
    canvas.add(rect, img);
    canvas.renderAll();
  });
  canvas.on("mouse:dblclick", (e) => {
    emit("mouse:dblclick", e);
  });
  canvas.on("selection:created", (e) => {
    emit("click:selected", e);
  });
  canvas.on("selection:updated", (e) => {
    emit("click:selected", e);
  });
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
