<script setup>
import { ref, markRaw, onMounted, computed } from "vue";
import FabricCanvas from "../components/FabricCanvas.vue";
import { fabric } from 'fabric'
import { useStore } from "vuex";
import IPlus from "../icons/IPlus.vue";
import Bind from "../icons/Bind.vue";
import CEdit from "../icons/CEdit.vue";
import Delete from "../icons/Delete.vue";
import ISave from "../icons/ISave.vue";

class CustomCircle extends fabric.Circle {
  constructor(options) {
    super(options)
    this.cod_tableta = options.cod_tableta
    this.ton = options.ton
    this.mining = options.mining
  }
}

class CustomText extends fabric.Textbox {
  constructor(text, options) {
    super(text, options)
    this.cod_tableta = options.cod_tableta
    this.ton = options.ton
    this.mining = options.mining
  }
}
const visible = ref(false)
const rumas = computed(() => {
  return  [
    { ley_ag: 2.66, cod_tableta: '12', ton: 15000, mining: 'Yumpag', x: 100, y: 50 },
    { ley_ag: 2.78, cod_tableta: '4', ton: 500, mining: 'Uchucchacua', x: 100, y: 50 },
    { ley_ag: 21.23, cod_tableta: 'E1', ton: 1200, mining: 'Uchucchacua', x: 100, y: 50 },
    { ley_ag: 19.23, cod_tableta: 'E1', ton: 1700, mining: 'Uchucchacua', x: 100, y: 50 },
    { ley_ag: 9.12, cod_tableta: 'E2', ton: 11500, mining: 'Uchucchacua', x: 100, y:50 }
  ]
})
const canvas = ref()

onMounted(() => {
  canvas.value.forEachObject((o) => {
    o.hasBorders = false
    o.selectable = false
  })
})
const handleCreated = (fabricCanvas) => {
  canvas.value = fabricCanvas
  const max = 24000
  const min = 200
  rumas.value.forEach((r) => {
    const d = (r.ton - min)*100/(max - min)
    const d2 = Math.floor((r.ton - min)*85/(max - min))
    const delta = Math.floor(10 + (r.ton - min)*100/(max - min))
    const delta_left = r.ton*0.65 / min
    const circle = new CustomCircle({
      radius: delta,
      fill: '#ffd435',
      left: r.x,
      top: r.y
    })
    const text = new CustomText('', {
      text: `${r.ley_ag}\n${r.cod_tableta}\n${r.ton}t`,
      fontSize: Math.log(delta) * 4,
      fill: 'gray',
      textAlign: 'center',
      left: r.x + delta_left,
      top: r.y + d2 - 10
    })
    const group = new fabric.Group([circle, text], {
    })
    // add new feature to group call id
    group.id = r.cod_tableta
    canvas.value.add(markRaw(group))
  })
  canvas.value.hasControls = false
  canvas.value.hasBorders = false
  canvas.value.selectable = false
  canvas.value.renderAll()
}


const handleClick = () => {
  // crea el circulo nnuevo
  if (!canvas.value) return
  const circle = new fabric.Circle({
    radius: 50,
    fill: 'blue',
    left: 50,
    top: 50
  })

  const text = new fabric.Text('new', {
    fontSize: 15,
    fill: 'white',
    textAlign: 'center',
    left: 80,
    top: 60
  })

  const group = new fabric.Group([circle, text], {
    left: 150,
    top: 150
  })
  group.hasControls = false
  group.hasBorders = false
  group.selectable = true
  visible.value = true
  canvas.value.add(markRaw(group))
  canvas.value.renderAll()
}

const handleSelect = (e) => {
  // console.log('selected', e)
  
}
const handleUpdate = (e) => {
  const objectsSelected = canvas.value.getActiveObjects() 
  console.log(objectsSelected.map(o => {
    return [o.id, o.left, o.top]
  }))
}

const handleMove = (e) => {
  console.log(e)
}

const edit = () => {
  canvas.value.forEachObject((o) => {
    o.hasBorders = true
    o.selectable = true
    o.hasControls = false
  })
}

const editRuma = () => {
  const ruma = {
    ley_ag: 9.66,
    cod_tableta: '12',
    ton: 11000,
    mining: 'Yumpag',
    x: 50,
    y: 300
  }
  rumas.value.push(ruma)
  // update canvas value text on 5 index
  console.log(canvas.value.getActiveObject())
  const text = canvas.value.getActiveObject().item(1)
  text.set('text', `${ruma.ley_ag}\n${ruma.cod_tableta}\n${ruma.ton}t`)

  canvas.value.renderAll()
}

const unir = () => {
  const group = new fabric.Group(canvas.value.getObjects(), {
    left: 150,
    top: 100
  })
  canvas.value.clear()
  canvas.value.add(group)
  canvas.value.renderAll()
}

const save = () => {
  canvas.value.forEachObject((o) => {
    o.hasBorders = false
    o.selectable = false
    o.hasControls = false
  })
  canvas.value.renderAll()
  visible.value = false
}

const remove = () => {
  canvas.value.getActiveObjects().forEach((o) => {
    canvas.value.remove(o)
  })
  canvas.value.discardActiveObject()
  canvas.value.renderAll()
}

</script>

<template>
  <div class="c-global-header">
    <div class="global-h-title">
      <div class="g-h-t-primary">
        <h1>Mapa de Rumas</h1>
        <span></span>
      </div>
      <span>| Dia terminado en Mina </span>
    </div>
  </div>
  <div></div>
  <div class="c-global-container-map">
    <div class="global-map-button">
      <Button
        outlined
        class="btn-map"
        @click="handleClick"
        v-tooltip.right="{
          value: 'Crear',
          pt: {
            arrow: {
              style: {
                borderRightColor: 'var(--primary-color)',
              },
            },
          },
        }"
      >
        <IPlus />
      </Button>
      <Button
        outlined
        class="btn-map"
        @click="edit"
        v-tooltip.right="{
          value: 'Editar',
          pt: {
            arrow: {
              style: {
                borderRightColor: 'var(--primary-color)',
              },
            },
          },
        }"
        ><CEdit />
      </Button>
      <Button
        outlined
        class="btn-map"
        @click="unir"
        v-tooltip.right="{
          value: 'Unir',
          pt: {
            arrow: {
              style: {
                borderRightColor: 'var(--primary-color)',
              },
            },
          },
        }"
        ><Bind />
      </Button>
      <Button
      outlined
        class="btn-map"
        @click="editRuma"
        v-if="visible"
        v-tooltip.right="{
          value: 'Editar Ruma',
          pt: {
            arrow: {
              style: {
                borderRightColor: 'var(--primary-color)',
              },
            },
          },
        }"
        ><CEdit />
      </Button>
      <Button
        outlined
        class="btn-map"
        @click="save"
        v-tooltip.right="{
          value: 'Guardar',
          pt: {
            arrow: {
              style: {
                borderRightColor: 'var(--primary-color)',
              },
            },
          },
        }"
        ><ISave />
      </Button>
      <Button
        outlined
        class="btn-map"
        @click="remove"
        v-tooltip.right="{
          value: 'Eliminar',
          pt: {
            arrow: {
              style: {
                borderRightColor: 'var(--primary-color)',
              },
            },
          },
        }"
        ><Delete />
      </Button>
    </div>
    <FabricCanvas
      @canvas-created="handleCreated"     
      @click:selected="handleSelect"
    />
  </div>
</template>

<style lang="scss">
.global-map-button {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  position: absolute;
  padding: 5px;
  border-radius: 0 0 8px 0;
  z-index: 1;
  background-color: var(--white);
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.02);
  top: 5px;
  left: 5px;
  .btn-map {
    color: var(--grey-2);
    background-color: var(--grey-light-1);
    height: 40px;
    width: 40px;
    border-radius: 8px;
    padding: 0;
    display: grid;
    place-items: center;
    svg {
      width: 1.5rem;
      height: 1.5rem;
      color: var(--grey-2);
      fill: transparent;
      stroke-width: 1.6;
    }
    &:hover {
      background-color: var(--primary);
      svg {
        color: var(--white);
        fill: transparent;
      }
    }
  }
}
.c-global-container-map {
  margin: 0 2.5rem;
  flex: 1 1;
  position: relative;
}
</style>
