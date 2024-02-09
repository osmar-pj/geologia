<script setup>
import { ref, markRaw, onMounted, computed, inject } from "vue"
import FabricCanvas from "../components/FabricCanvas.vue"
import { fabric } from 'fabric'
import { useStore } from "vuex"
import { Subject, merge } from "rxjs"
import IPlus from "../icons/IPlus.vue"
import Bind from "../icons/Bind.vue"
import CEdit from "../icons/CEdit.vue"
import Delete from "../icons/Delete.vue"
import ISave from "../icons/ISave.vue"
import { useToast } from 'primevue/usetoast'
import Totals from "../components/Totals.vue"
import IPila from "../maps/IPila.vue"
import IGiba from "../maps/IGiba.vue"
import ICC from "../maps/ICC.vue"
import IC1 from "../maps/IC1.vue"
import IC2 from "../maps/IC2.vue"

const socket = inject("socket")
const pila$ = new Subject()
const store = useStore();
const url = import.meta.env.VITE_API_URL
const route = 'map'
const access = ref(false)
const mergeAvailable = ref(false)

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
    this.fontFamily = options.fontFamily || "Rubik"
  }
}

class CustomRect extends fabric.Rect {
  constructor(options) {
    super(options)
    this.cod_tableta = options.cod_tableta
    this.ton = options.ton
    this.mining = options.mining
  }
}

class CustomPolygon extends fabric.Polygon {
  constructor(options) {
    super(options)
  }
}

// const canvas = computed(() => store.state.canvas)
const canvas = ref()
const pilas = computed(() => store.state.rumaTotal)
const trips = computed(() => store.state.dataListGeneral)
const weights = computed(() => store.state.weights)
const ubication = ref('')

socket.on("pilas", async (data) => {
  console.log("socket Data", data)
  const pilasFound = data.map((i) => {
    const pila = pilas.value.find((p) => p._id === i._id)
    return pila
  })
  pilasFound.length > 0
    ? updatePilas(pilasFound, data)
    : console.log("No se encontraron pilas")
  await store.dispatch("pila_total")
  weights.value.stock = {
    total: pilas.value.reduce((a, b) => a + b.stock, 0),
    colquicocha: pilas.value.filter(p => p.ubication == 'Cancha Colquicocha').reduce((a, b) => a + b.stock, 0),
    cancha1: pilas.value.filter(p => p.ubication == 'Cancha 1').reduce((a, b) => a + b.stock, 0),
    cancha2: pilas.value.filter(p => p.ubication == 'Cancha 2').reduce((a, b) => a + b.stock, 0)
  }
  weights.value.tonh = pilas.value.reduce((a, b) => a + b.tonh, 0)
  weights.value.ton = pilas.value.reduce((a, b) => a + b.ton, 0)
  await store.commit('setWeights', weights.value)
})

const updatePilas = async (pilasFound, data) => {
  pilasFound.forEach((pila, index) => {
    pila.stock = data[index].stock
    pila.tonh = data[index].tonh
    pila.ton = data[index].tonh * 0.94
    pila$.next(pila)
  })
  if (!access.value) {
    createSVGData()
    access.value = false
  }
}

const visible = ref(false)
onMounted(async () => {
  await store.dispatch("pila_total")
  // canvas.value.forEachObject((o) => {
  //   o.hasBorders = false
  //   o.selectable = false
  // })
})
const modaData = (data) => {
  if (data.length === 0) return ''
    const dataCount = {}
    let max = 0
    let moda = 0
    data.forEach((i) => {
        if (dataCount[i]) {
            dataCount[i]++
        } else {
            dataCount[i] = 1
        }
    })
    for (const i in dataCount) {
        if (dataCount[i] > max) {
            moda = i
            max = dataCount[i]
        }
    }
    return moda
}
const chooseMiningShadesColor = (mining) => {
  // if (mining) return 'fff'
  return mining == 'YUMPAG' ? '#215E08' : '#5C1E05'
}
const chooseMiningMainColor = (mining) => {
  // if (mining) return 'fff'
  return mining == 'YUMPAG' ? '#42B017' : '#E06500'
}
const chooseDominioShadeColor = (dominios) => {
  const dominio = modaData(dominios)
  switch (dominio) {
    case 'Polimetálico':
      return '#2B67FF'
    case 'Ag/Alabandita':
      return '#FF2B3D'
    case 'Ag/Carbonatos':
      return '#FFCC00'
    default:
      return '#224422'
  }
}
const chooseDominioMainColor = (dominios) => {
  const dominio = modaData(dominios)
  switch (dominio) {
    case 'Polimetálico':
      return '#6DA0FF'
    case 'Ag/Alabandita':
      return '#FF6D7A'
    case 'Ag/Carbonatos':
      return '#FFE375'
    default:
      return '#334433'
  }
}

const createSVGData = () => {
  const pillas = pilas.value.filter(i => i.typePila == 'Pila')
  const gibas = pilas.value.filter(i => i.typePila == 'Giba')
  const p = pillas.forEach(i => {
    const pilaSVG = document.getElementById('pila')
    pilaSVG.querySelector('.stock').textContent = i.stock ? (i.stock).toFixed(1) : '-'
    pilaSVG.querySelector('.tableta').textContent = i.pila
    pilaSVG.querySelector('.ley').textContent = i.ley_ag ? (i.ley_ag).toFixed(2) : '-'
    pilaSVG.querySelector('.mining1').style.fill = chooseMiningMainColor(i.mining)
    pilaSVG.querySelector('.mining2').style.fill = chooseMiningShadesColor(i.mining)
    pilaSVG.querySelector('.dominio1').style.fill = chooseDominioMainColor(i.dominio)
    pilaSVG.querySelector('.dominio2').style.fill = chooseDominioShadeColor(i.dominio)
    const svgElem = new fabric.loadSVGFromString(pilaSVG.outerHTML, (objects, options) => {
      const obj = fabric.util.groupSVGElements(objects, options)
      obj.set({
        left: i.x,
        top: i.y,
        scaleX: 0.3,
        scaleY: 0.3,
        selectable: false
      })
      obj.pila = i
      canvas.value.add(obj)
    })
  })

  const g = gibas.forEach(i => {
    const gibaSVG = document.getElementById('giba')
    gibaSVG.querySelector('.stock').textContent = i.tonh ? (i.tonh).toFixed(1) : '-'
    gibaSVG.querySelector('.tableta').textContent = i.pila
    gibaSVG.querySelector('.ley').textContent = i.ley_ag ? (i.ley_ag).toFixed(2) : '-'
    gibaSVG.querySelector('.dominio1').style.fill = chooseDominioMainColor(i.dominio)
    gibaSVG.querySelector('.dominio2').style.fill = chooseDominioShadeColor(i.dominio)
    const svgElem = new fabric.loadSVGFromString(gibaSVG.outerHTML, (objects, options) => {
      const obj = fabric.util.groupSVGElements(objects, options)
      obj.set({
        left: i.x,
        top: i.y,
        scaleX: 0.3,
        scaleY: 0.3,
        selectable: false
      })
      obj.pila = i
      canvas.value.add(obj)
    })
  })
  canvas.value.renderAll()
  // return p, g
}

const createSVGRect = () => {
  const colquicocha = new CustomRect({
    left: 140,
    top: 130,
    width:950,
    height:350,
    fill: 'transparent',
    // stroke: 'black',
    strokeWidth: 2,
    selectable: false,
    angle: 25
  })
  colquicocha.type = 'colquicocha'
  canvas.value.add(colquicocha)
  const cancha2 = new CustomRect({
    left: 1050,
    top: 620,
    width: 580,
    height: 150,
    fill: 'transparent',
    // stroke: 'black',
    strokeWidth: 2,
    selectable: false,
    angle: -15
  })
  cancha2.type = 'cancha2'
  canvas.value.add(cancha2)
  const cancha1 = new CustomRect({
    left: 1740,
    top: 250,
    width: 120,
    height: 200,
    fill: 'transparent',
    // stroke: 'black',
    strokeWidth: 2,
    selectable: false
  })
  cancha1.type = 'cancha1'
  canvas.value.add(cancha1)
  canvas.value.renderAll()
}

const handleCreated = async (fabricCanvas) => {
  await store.dispatch("pila_total")
  weights.value.stock = {
    total: pilas.value.reduce((a, b) => a + b.stock, 0),
    colquicocha: pilas.value.filter(p => p.ubication == 'Cancha Colquicocha').reduce((a, b) => a + b.stock, 0),
    cancha1: pilas.value.filter(p => p.ubication == 'Cancha 1').reduce((a, b) => a + b.stock, 0),
    cancha2: pilas.value.filter(p => p.ubication == 'Cancha 2').reduce((a, b) => a + b.stock, 0)
  }
  weights.value.tonh = pilas.value.reduce((a, b) => a + b.tonh, 0)
  weights.value.ton = pilas.value.reduce((a, b) => a + b.ton, 0)
  await store.commit('setWeights', weights.value)
  // await store.dispatch("pila_total")
  // pilas.value = store.state.rumaTotal
  canvas.value = fabricCanvas
  const colquicocha = document.getElementById('icc')
  const cancha2 = document.getElementById('ic2')
  const cancha1 = document.getElementById('ic1')
  colquicocha.querySelector('.icc').textContent = weights.value.stock.colquicocha.toFixed(2)
  cancha2.querySelector('.ic2').textContent = weights.value.stock.cancha2.toFixed(2)
  cancha1.querySelector('.ic1').textContent = weights.value.stock.cancha1.toFixed(2)
  const svgElem = new fabric.loadSVGFromString(colquicocha.outerHTML, (objects, options) => {
    const obj = fabric.util.groupSVGElements(objects, options)
    obj.set({
      left: 200,
      top: 110,
      scaleX: 1.5,
      scaleY: 1.5,
      selectable: false,
      opacity: 1
    })
    obj.type = 'letrero1'
    canvas.value.add(obj)
  })
  const svgElem2 = new fabric.loadSVGFromString(cancha2.outerHTML, (objects, options) => {
    const obj = fabric.util.groupSVGElements(objects, options)
    obj.set({
      left: 1100,
      top: 500,
      scaleX: 1.5,
      scaleY: 1.5,
      selectable: false
    })
    obj.type = 'letrero2'
    canvas.value.add(obj)
  })
  const svgElem3 = new fabric.loadSVGFromString(cancha1.outerHTML, (objects, options) => {
    const obj = fabric.util.groupSVGElements(objects, options)
    obj.set({
      left: 1700,
      top:150,
      scaleX: 1.5,
      scaleY: 1.5,
      selectable: false
    })
    obj.type = 'letrero3'
    canvas.value.add(obj)
  })
  createSVGRect()
  createSVGData()
  // canvas.value.hasControls = false
  canvas.value.hasBorders = true
  canvas.value.renderAll()
}

// const handleClick = (r) => {
//   // crea el circulo nnuevo
//   if (!canvas.value) return
//   const d = (r.tonh - min) * 100/(max - min)
//   const d2 = Math.floor((r.tonh - min) * 85/(max - min))
//   const delta = Math.floor(10 + (r.tonh - min)*100/(max - min))
//   const delta_left = r.tonh * 0.65 / min
//   const circle = new CustomCircle({
//     radius: delta + 10,
//     fill: selectColor(r.mining, r.dominio),
//     left: r.x,
//     top: r.y
//   })
//   const text = new CustomText('', {
//     text: `${r.ley_ag ? r.ley_ag.toFixed(2) : 0}\n${r.pila}\n${r.tonh}_T`,
//     fontSize: Math.log(delta) * 4.5,
//     fill: r.mining == 'YUMPAG' ? 'black' : 'white',
//     textAlign: 'center',
//     left: r.x + delta_left * 0.5,
//     top: r.y + d2 - 10
//   })
//   const group = new fabric.Group([circle, text], {
//   })
//   // add new feature to group call id
//   group.id = r._id
//   group.hasControls = false
//   group.hasBorders = false
//   group.selectable = true
//   visible.value = true
//   canvas.value.add(markRaw(group))
//   canvas.value.renderAll()
// }

const toast = useToast()

const empty = () => {
  canvas.value.clear()
  canvas.value.renderAll()
}

const moving = async (e) => {
  if (!mergeAvailable.value) return
  const objectSelected = canvas.value.getActiveObject()
  if (objectSelected) {
    objectSelected.setCoords()
    const colquicocha = canvas.value.getObjects().find((o) => o.type === 'colquicocha')
    if (colquicocha && objectSelected.intersectsWithObject(colquicocha)) {
      console.log('Colquicocha')
      ubication.value = 'Cancha Colquicocha'
      return
    }
    const cancha2 = canvas.value.getObjects().find((o) => o.type === 'cancha2')
    if (cancha2 && objectSelected.intersectsWithObject(cancha2)) {
      console.log('Cancha2')
      ubication.value = 'Cancha 2'
      return
    }
    const cancha1 = canvas.value.getObjects().find((o) => o.type === 'cancha1')
    if (cancha1 && objectSelected.intersectsWithObject(cancha1)) {
      console.log('Cancha1')
      ubication.value = 'Cancha 1'
      return
    }
  }
}

const handleSelect = (e) => {
  const objectsSelected = canvas.value.getActiveObjects()
  // console.log('ObjectsSelected', objectsSelected)
  const existLeyes = objectsSelected.every((o) => o.pila.ley_ag)
  if (!existLeyes) {
    visible.value = false
    mergeAvailable.value = false
    toast.add({ severity: 'error', summary: 'Error', detail: 'Una o mas leyes aun no fueron calculadas', life: 3000})
    return
  }
  if (objectsSelected.length > 1) {
    const tolerance = 0.5
    const leyes = objectsSelected.map((o) => o.pila.ley_ag)
    const promedio = leyes.reduce((a, b) => a + b) / leyes.length
    const differences = leyes.map((ley) => Math.abs(ley - promedio))
    const maxDifference = Math.max(...differences)
    if (maxDifference > tolerance) {
      visible.value = false
      mergeAvailable.value = false
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se puede unir', life: 3000})
      return
    }
    toast.add({ severity: 'success', summary: 'Union de pilas', detail: 'Las leyes de las pilas son similares', life: 3000})
    visible.value = true
    mergeAvailable.value = true
  } else {
    visible.value = false
    mergeAvailable.value = false
  }
}
const handleMoveUpdatePosition = async (e) => {
  const objectSelected = canvas.value.getActiveObject()
  if (objectSelected) {
    objectSelected.data = {
      x: objectSelected.left,
      y: objectSelected.top,
      ubication: ubication.value
    }
    access.value = true
    await store.dispatch("ruma_update", objectSelected)
  }
}

const mergePilas = async () => {
  const pilasSelected = canvas.value.getActiveObjects()
  // console.log('MergePilas', pilasSelected)
  try {
    // buttonClicked.value = true
    const response = await fetch(`${url}/pila`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({mining: 'YUMPAG'}),
    })
    const data = await response.json()
    if (data.status === true) {
      console.log("Correcto")
      await store.dispatch("pila_list")
      data.data = {
        tonh: pilasSelected.reduce((a, b) => a + b.pila.tonh, 0),
        ton: pilasSelected.reduce((a, b) => a + b.pila.ton, 0),
        stock: pilasSelected.reduce((a, b) => a + b.pila.stock, 0),
        // travels: pilasSelected.reduce((a, b) => a + b.pila.travels, 0),
        // tajo: pilasSelected.map(p => p.pila.tajo),
        mining: pilasSelected.map(p => p.pila.mining)[0],
        dominio: pilasSelected.map(p => {
          const arr = p.pila.dominio
          return [...arr]
        }),
        x: pilasSelected.reduce((a, b) => a + b.pila.x, 0) / pilasSelected.length,
        y: pilasSelected.reduce((a, b) => a + b.pila.y, 0) / pilasSelected.length,
        pilas_merged: pilasSelected.map((p) => p.pila._id),
        statusPila: 'waitDateAbastecimiento',
        history: [...data.pila.history, {work: 'Unidos', date: new Date(), user: store.state.user._id}],
        ley_ag: pilasSelected.reduce((a, b) => a + b.pila.ley_ag, 0) / pilasSelected.length,
        ley_fe: pilasSelected.reduce((a, b) => a + b.pila.ley_fe, 0) / pilasSelected.length,
        ley_mn: pilasSelected.reduce((a, b) => a + b.pila.ley_mn, 0) / pilasSelected.length,
        ley_pb: pilasSelected.reduce((a, b) => a + b.pila.ley_pb, 0) / pilasSelected.length,
        ley_zn: pilasSelected.reduce((a, b) => a + b.pila.ley_zn, 0) / pilasSelected.length,
        // cod_despacho: pilasSelected.map((p) => p.pila.cod_despacho),
      }
      await store.dispatch("ruma_update", data)
      pilasSelected.forEach(async (p) => {
        p.data = {
          statusBelong: "Belong",
          statusPila: "Finalizado",
          history: [...p.pila.history, {work: 'Se unio con otra pila', date: new Date(), user: store.state.user._id}]
        }
        await store.dispatch("ruma_update", p)
      })
      await store.dispatch("pila_total")
      pilas.value = store.state.rumaTotal
      // showForm.value = false
      setTimeout(() => {
        // showSuccessM.value = true
      }, 600)
      setTimeout(() => {
          // cerrarModal()
          // showForm.value = true
          // showSuccessM.value = false
        }, 2500)
      // buttonClicked.value = false
    } else {
      console.log("error")
      // buttonClicked.value = false
    }
  } catch (error) {
    console.error("Error al crear la Pila:", error)
  }
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
  pilas.value.push(ruma)
  // update canvas value text on 5 index
  const text = canvas.value.getActiveObject().item(1)
  text.set('text', `${ruma.ley_ag}\n${ruma.cod_tableta}\n${ruma.ton}t`)

  canvas.value.renderAll()
}

// const ungroup = () => {
//   const group = canvas.value.getActiveObject()
//   group._restoreObjectsState()
//   canvas.value.remove(group)
//   canvas.value.add(...group._objects)
//   canvas.value.renderAll()
// }

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
  <Toast />
  <!-- <div class="c-global-header">
    <div class="global-h-title">
      <div class="g-h-t-primary">
        <h1>Mapa de pilas</h1>
        <span></span>
      </div>
      <span>| Dia terminado en Mina </span>
    </div>
  </div> -->
  <Totals/>
  <Button class="btn-success btn-GP" @click="() => $refs.html2Pdf.generatePdf()">Generate PDF</Button>
  <div v-show="false">
    <IPila id="pila"/>
    <IGiba id="giba"/>
    <ICC id="icc"/>
    <IC1 id="ic1"/>
    <IC2 id="ic2"/>
  </div>
  <div>
    <vue3-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="false"
      :preview-modal="true"
      :paginate-elements-by-height="0"
      :filename="`Geology report ${new Date().toLocaleDateString()}`"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-orientation="landscape"
      pdf-format="a4"
      :pdf-margins="{ top: 2.5 * 28.35, right: 2.5 * 28.35, bottom: 2.5 * 28.35, left: 2.5 * 28.35 }"
      pdf-content-width="calc(100% - (2.5 * 28.35 * 2))"
      ref="html2Pdf"
      >
      <template v-slot:pdf-content>
        <div class="pdf-content">
          <h1>Reporte de Geología</h1>
          <p>Este es un reporte de geología generado por el sistema de control de calidad de la mina.</p>
          <div class="tableContainer">
            <table class="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Stock</th>
                  <th>Toneladas</th>
                  <th>Ubicación</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pila in pilas.data" :key="pila._id">
                  <td>{{ pila.pila }}</td>
                  <td>{{ pila.stock }}</td>
                  <td>{{ pila.tonh }}</td>
                  <td>{{ pila.ubication }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </vue3-html2pdf>
  </div>
  <div class="c-global-container-map">
    <div class="global-map-button">
      <!-- <Button
        outlined
        class="btn-map"
        @click="handleClick"
        v-tooltip.bottom="{
          value: 'Crear',
          pt: {
            arrow: {
              style: {
                borderBottomColor: 'var(--primary-color)',
              },
            },
          },
        }"
      >
        <IPlus />
      </Button> -->
      <Button
        outlined
        class="btn-map"
        @click="edit"
        v-tooltip.bottom="{
          value: 'Editar',
          pt: {
            arrow: {
              style: {
                borderBottomColor: 'var(--primary-color)',
              },
            },
          },
        }"
        ><CEdit />
      </Button>
      <Button
        outlined
        class="btn-map"
        @click="mergePilas"
        v-if="visible"
        v-tooltip.bottom="{
          value: 'Unir',
          pt: {
            arrow: {
              style: {
                borderBottomColor: 'var(--primary-color)',
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
        v-tooltip.bottom="{
          value: 'Editar Ruma',
          pt: {
            arrow: {
              style: {
                borderBottomColor: 'var(--primary-color)',
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
        v-tooltip.bottom="{
          value: 'Guardar',
          pt: {
            arrow: {
              style: {
                borderBottomColor: 'var(--primary-color)',
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
        v-tooltip.bottom="{
          value: 'Eliminar',
          pt: {
            arrow: {
              style: {
                borderBottomColor: 'var(--primary-color)',
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
      @click:updated="handleMoveUpdatePosition"
      @click:cleared="empty"
      @mouse:moving="moving"
    />
  </div>
  
</template>

<style lang="scss">
.global-map-button {
  display: flex;
  gap: 0.5rem;
  position: absolute;
  padding: 8px;
  border-radius: 10px;
  z-index: 1;
  background-color: rgba(255,255,255,0.5);
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.02);
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
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
  background-image: url("../assets/img/map-ruma.svg");
  background-size: contain;
  background-repeat: no-repeat;
  // background-position: center;
}
.pdf-content {
  padding: 2rem;
  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  p {
    font-size: 1.5rem;
  }
}
.btn-GP{
  width: 200px !important;
  margin-left: 2rem;
}

.pdf-content {
  width: 90%;
  margin: 2.5cm;
}

.pdf-content h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.tableContainer {
  margin-bottom: 20px;
}
</style>
