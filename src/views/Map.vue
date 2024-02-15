<script setup>
import { ref, markRaw, onMounted, computed, inject } from "vue"
import FabricCanvas from "../components/FabricCanvas.vue"
import { fabric } from "fabric"
import { useStore } from "vuex"
import { Subject, merge } from "rxjs"
import { useToast } from "primevue/usetoast"
import Bind from "../icons/Bind.vue"
import CEdit from "../icons/CEdit.vue"
import Delete from "../icons/Delete.vue"
import ISave from "../icons/ISave.vue"
import Totals from "../components/Totals.vue"
import IPila from "../maps/IPila.vue"
import IGiba from "../maps/IGiba.vue"
import IDesmonte from "../maps/IDesmonte.vue"
import ICC from "../maps/ICC.vue"
import IC1 from "../maps/IC1.vue"
import IC2 from "../maps/IC2.vue"
import ICalendar from "../icons/ICalendar.vue"
import GeneratePDF from "../components/GeneratePDF.vue"

const socket = inject("socket")
const pila$ = new Subject()
const store = useStore()
const toast = useToast()
const url = import.meta.env.VITE_API_URL
// const canvas = computed(() => store.state.canvas)
const canvas = ref()
const pilas = computed(() => store.state.rumaTotal)
const trips = ref([])
const weights = computed(() => store.state.weights)
const ubication = ref("")
const visibleMerge = ref(false)
const visibleDate = ref(false)
const nonePilaSelected = ref(false)
const unlessOnePilaSelected = ref(false)
const thereAreUnlessTwoPilasSelected = ref(false)
const thereArePilasWithLey = ref(false)
const thereAreSameMining = ref(false)
const thereAreSameDominio = ref(false)
const access = ref(true)
const mergeAvailable = ref(false)
const pilasSelected = ref([])
const colquicocha = ref()
const cancha1 = ref()
const cancha2 = ref()

class CustomRect extends fabric.Rect {
  constructor(options) {
    super(options)
    this.cod_tableta = options.cod_tableta
    this.ton = options.ton
    this.mining = options.mining
  }
}

const handleCreated = async (fabricCanvas) => {
  await sendFilter()
  await store.dispatch("pila_total")
  colquicocha.value  = document.getElementById("icc")
  cancha1.value = document.getElementById("ic1")
  cancha2.value = document.getElementById("ic2")
  await createSVGRect(fabricCanvas)
  await setWeights()
  await createSVGLetters()
  await createSVGData()
  canvas.value = fabricCanvas
  canvas.value.hasControls = false
  canvas.value.hasBorders = true
  canvas.value.renderAll()
}

const handleSelect = (e) => {
  const objectsSelected = canvas.value
    .getActiveObjects()
    .filter(
      (o) =>
        o.type !== "colquicocha" &&
        o.type !== "cancha2" &&
        o.type !== "cancha1" &&
        o.type !== "letrero1" &&
        o.type !== "letrero2" &&
        o.type !== "letrero3"
    )
  canvas.value.forEachObject((o) => {
    o.hasBorders = true
    o.selectable = true
    o.hasControls = true
    o.lockUniScaling = true
    o.lockRotation = true
  })
  canvas.value
    .getObjects()
    .filter(
      (o) =>
        o.type === "colquicocha" ||
        o.type === "cancha2" ||
        o.type === "cancha1" ||
        o.type === "letrero1" ||
        o.type === "letrero2" ||
        o.type === "letrero3"
    )
    .forEach((o) => {
      o.selectable = false
      o.hasControls = false
      o.hasBorders = false
    })
  pilasSelected.value = objectsSelected
  console.log("Pilas Selected", pilasSelected.value.map(i => i.pila.mining))
  nonePilaSelected.value = pilasSelected.value.length === 0
  unlessOnePilaSelected.value = pilasSelected.value.length > 0
  thereAreUnlessTwoPilasSelected.value = pilasSelected.value.length > 1
  thereArePilasWithLey.value = pilasSelected.value.every((o) => o.pila.ley_ag)
  thereAreSameMining.value = pilasSelected.value.every(
    (o) => o.pila.mining === pilasSelected.value[0].pila.mining
  )
  thereAreSameDominio.value = pilasSelected.value.every(
    (o) => modaData(o.pila.dominio) === modaData(pilasSelected.value[0].pila.dominio)
  )
  if (unlessOnePilaSelected.value) {
    console.log("1 o mas")
    visibleDate.value = true
  }
  if (thereAreUnlessTwoPilasSelected.value) {
    console.log("2 o mas")
    visibleMerge.value = true
  }
  if (nonePilaSelected.value) {
    console.log("Ninguna")
    visibleMerge.value = false
    visibleDate.value = false
  }
}

const mergePilas = async () => {
  console.log("mergePilas", thereArePilasWithLey.value, thereAreSameMining.value, thereAreSameDominio.value)
  if (!thereArePilasWithLey.value) {
    visibleMerge.value = false
    mergeAvailable.value = false
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Una o mas leyes aun no fueron calculadas",
      life: 3000,
    })
    return
  }
  if (!thereAreSameMining.value) {
    visibleMerge.value = false
    mergeAvailable.value = false
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Las pilas seleccionadas no son de la misma mina",
      life: 3000,
    })
    return
  }
  if (!thereAreSameDominio.value) {
    visibleMerge.value = false
    mergeAvailable.value = false
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Las pilas seleccionadas no son del mismo dominio",
      life: 3000,
    })
    return
  }
  const tolerance = 0.5
  const leyes = pilasSelected.value.map((o) => o.pila.ley_ag)
  const promedio = leyes.reduce((a, b) => a + b) / leyes.length
  const differences = leyes.map((ley) => Math.abs(ley - promedio))
  const maxDifference = Math.max(...differences);
  if (maxDifference > tolerance) {
    visibleMerge.value = false;
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se puede unir",
      life: 3000,
    });
    return;
  }
  toast.add({
    severity: "success",
    summary: "Union de pilas",
    detail: "Las leyes de las pilas son similares",
    life: 3000,
  });
  const mining = pilasSelected.value.map((p) => p.pila.mining)[0];
  try {
    const response = await fetch(`${url}/pila`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mining: mining }),
    });
    const data = await response.json();
    if (data.status === true) {
      console.log("Correcto")
      const length = pilasSelected.value.length;
      const tonh_total = pilasSelected.value.reduce(
        (a, b) => a + b.pila.tonh,
        0
      );
      data.data = {
        tonh: tonh_total,
        ton: pilasSelected.value.reduce((a, b) => a + b.pila.ton, 0),
        stock: pilasSelected.value.reduce((a, b) => a + b.pila.stock, 0),
        mining: mining,
        dominio: pilasSelected.value.reduce((a, b) => {
          return [...a, ...b.pila.dominio];
        }, []),
        travels: pilasSelected.value.reduce((a, b) => {
          return [...a, ...b.pila.travels];
        }, []),
        tajo: pilasSelected.value.reduce((a, b) => {
          return [...a, ...b.pila.tajo];
        }, []),
        cod_despacho: pilasSelected.value.reduce((a, b) => {
          return [...a, ...b.pila.cod_despacho];
        }, []),
        x: pilasSelected.value.reduce((a, b) => a + b.pila.x, 0) / length,
        y: pilasSelected.value.reduce((a, b) => a + b.pila.y, 0) / length,
        pilas_merged: pilasSelected.value.map((p) => p.pila._id),
        statusPila: "waitDateAbastecimiento",
        history: [
          ...data.pila.history,
          {
            work: `UPDATE se crea a partir de ${pilasSelected.value.length} pilas`,
            date: new Date(),
            user: store.state.user,
          },
        ],
        ley_ag:
          pilasSelected.value.reduce((a, b) => a + b.pila.tmh_ag, 0) /
          tonh_total,
        ley_fe:
          pilasSelected.value.reduce((a, b) => a + b.pila.tmh_fe, 0) /
          tonh_total,
        ley_mn:
          pilasSelected.value.reduce((a, b) => a + b.pila.tmh_mn, 0) /
          tonh_total,
        ley_pb:
          pilasSelected.value.reduce((a, b) => a + b.pila.tmh_pb, 0) /
          tonh_total,
        ley_zn:
          pilasSelected.value.reduce((a, b) => a + b.pila.tmh_zn, 0) /
          tonh_total,
      }
      await store.dispatch("ruma_update", data)
      pilasSelected.value.forEach(async (p) => {
        p.data = {
          statusBelong: "Belong",
          statusPila: "Finalizado",
          history: [
            ...p.pila.history,
            {
              work: "Se unio con otra pila",
              date: new Date(),
              user: store.state.user._id,
            },
          ],
        }
        access.value = false
        await store.dispatch("ruma_update", p)
      })
      remove()
    } else {
      console.log("error")
    }
  } catch (error) {
    console.error("Error al crear la Pila:", error)
  }
}

socket.on("pilas", async (data) => {
  console.log("socket Data", data)
  await store.dispatch("pila_total")
  const pilasFound = data.map((i) => {
    const pila = pilas.value.find((p) => p._id === i._id)
    return pila
  })
  pilasFound.length > 0
    ? updatePilas(pilasFound, data)
    : console.log("No se encontraron pilas")
  await store.dispatch("pila_total")
})
const updatePilas = async (pilasFound, data) => {
  pilasFound.forEach((pila, index) => {
    pila.stock = data[index].stock
    pila.tonh = data[index].tonh
    pila.ton = data[index].tonh * 0.94
    pila.ley_ag = data[index].ley_ag
    pila.x = data[index].x
    pila.y = data[index].y
    pila.ubication = data[index].ubication
    pila$.next(pila)
  })
  if (access.value) {
    createSVGData()
    setWeights()
    createSVGLetters()
  }
  access.value = true
  // canvas.value.renderAll()
}
socket.on("newPila", async (data) => {
  await store.commit("addDataRumaList", data)
  if (access.value) {
    createSVGData()
    setWeights()
    createSVGLetters()
  }
  access.value = true
  // canvas.value.renderAll()
})

const setWeights = async () => {
  const weights = {
    colquicocha_stock: pilas.value
      .filter((p) => p.ubication == "Cancha Colquicocha")
      .reduce((a, b) => a + b.stock, 0),
    cancha1_stock: pilas.value
      .filter((p) => p.ubication == "Cancha 1")
      .reduce((a, b) => a + b.stock, 0),
    cancha2_stock: pilas.value
      .filter((p) => p.ubication == "Cancha 2")
      .reduce((a, b) => a + b.stock, 0),
    tonh: pilas.value.reduce((a, b) => a + b.tonh, 0),
    ton: pilas.value.reduce((a, b) => a + b.ton, 0)
  }
  colquicocha.value.querySelector(".icc").textContent = 
    weights.colquicocha_stock.toFixed(1)
  cancha2.value.querySelector(".ic2").textContent =
    weights.cancha2_stock.toFixed(1)
  cancha1.value.querySelector(".ic1").textContent =
    weights.cancha1_stock.toFixed(1)
  await store.commit("setWeights", weights)
}

// PDF content
const sendFilter = async () => {
  try {
    const response = await fetch(`${url}/trips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
      body: JSON.stringify({ arr: ["year", "month", "rango", "type"] }),
    })

    const data = await response.json()
    trips.value = data
    if (data.status === true) {
      console.log("correcto")
    }
  } catch (error) {
    console.error("Error al actualizar:", error)
  }
}

const modaData = (data) => {
  if (data.length === 0) return ""
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
  return mining == "YUMPAG" ? "#215E08" : "#5C1E05"
}
const chooseMiningMainColor = (mining) => {
  return mining == "YUMPAG" ? "#42B017" : "#E06500"
}
const chooseDominioShadeColor = (dominios) => {
  const dominio = modaData(dominios)
  switch (dominio) {
    case "Polimetálico":
      return "#2B67FF"
    case "Ag/Alabandita":
      return "#FF2B3D"
    case "Ag/Carbonatos":
      return "#FFCC00"
    default:
      return "#224422"
  }
}
const chooseDominioMainColor = (dominios) => {
  const dominio = modaData(dominios)
  switch (dominio) {
    case "Polimetálico":
      return "#6DA0FF"
    case "Ag/Alabandita":
      return "#FF6D7A"
    case "Ag/Carbonatos":
      return "#FFE375"
    default:
      return "#334433"
  }
}

const createSVGLetters = () => {
  const svgElem = new fabric.loadSVGFromString(
      colquicocha.value.outerHTML,
      (objects, options) => {
        const obj = fabric.util.groupSVGElements(objects, options)
        obj.set({
          left: 200,
          top: 110,
          scaleX: 1.5,
          scaleY: 1.5,
          selectable: false,
          opacity: 1,
        })
        obj.type = "letrero1"
        canvas.value.add(obj)
      }
    )
    const svgElem2 = new fabric.loadSVGFromString(
      cancha2.value.outerHTML,
      (objects, options) => {
        const obj = fabric.util.groupSVGElements(objects, options)
        obj.set({
          left: 1100,
          top: 500,
          scaleX: 1.5,
          scaleY: 1.5,
          selectable: false,
        })
        obj.type = "letrero2"
        canvas.value.add(obj)
      }
    )
    const svgElem3 = new fabric.loadSVGFromString(
      cancha1.value.outerHTML,
      (objects, options) => {
        const obj = fabric.util.groupSVGElements(objects, options)
        obj.set({
          left: 1700,
          top: 150,
          scaleX: 1.5,
          scaleY: 1.5,
          selectable: false,
        })
        obj.type = "letrero3"
        canvas.value.add(obj)
      }
    )
}
const createSVGData = () => {
  // const desmonte = pilas.value.filter((i) => i.typePila == "Desmonte")
  const pillas = pilas.value.filter((i) => i.typePila == "Pila")
  const gibas = pilas.value.filter((i) => i.typePila == "Giba")
  const p = pillas.forEach((i) => {
    const pilaSVG = document.getElementById("pila")
    pilaSVG.querySelector(".stock").textContent = i.stock
      ? i.stock.toFixed(1)
      : "-"
    pilaSVG.querySelector(".tableta").textContent = i.pila
    pilaSVG.querySelector(".ley").textContent = i.ley_ag
      ? i.ley_ag.toFixed(2)
      : "-"
    pilaSVG.querySelector(".mining1").style.fill = chooseMiningMainColor(
      i.mining
    )
    pilaSVG.querySelector(".mining2").style.fill = chooseMiningShadesColor(
      i.mining
    )
    pilaSVG.querySelector(".dominio1").style.fill = chooseDominioMainColor(
      i.dominio
    )
    pilaSVG.querySelector(".dominio2").style.fill = chooseDominioShadeColor(
      i.dominio
    )
    const svgElem = new fabric.loadSVGFromString(
      pilaSVG.outerHTML,
      (objects, options) => {
        const obj = fabric.util.groupSVGElements(objects, options)
        obj.set({
          left: i.x,
          top: i.y,
          scaleX: 0.3,
          scaleY: 0.3,
          selectable: false,
        })
        obj.pila = i
        canvas.value.add(obj)
      }
    )
  })
  const g = gibas.forEach((i) => {
    const gibaSVG = document.getElementById("giba")
    gibaSVG.querySelector(".stock").textContent = i.tonh
      ? i.tonh.toFixed(1)
      : "-"
    gibaSVG.querySelector(".tableta").textContent = i.pila
    gibaSVG.querySelector(".ley").textContent = i.ley_ag
      ? i.ley_ag.toFixed(2)
      : "-"
    gibaSVG.querySelector(".dominio1").style.fill = chooseDominioMainColor(
      i.dominio
    )
    gibaSVG.querySelector(".dominio2").style.fill = chooseDominioShadeColor(
      i.dominio
    )
    const svgElem = new fabric.loadSVGFromString(
      gibaSVG.outerHTML,
      (objects, options) => {
        const obj = fabric.util.groupSVGElements(objects, options)
        obj.set({
          left: i.x,
          top: i.y,
          scaleX: 0.3,
          scaleY: 0.3,
          selectable: false,
        })
        obj.pila = i
        canvas.value.add(obj)
      }
    )
  })
  console.log('CANVAS SVGDATA', canvas.value)
  // canvas.value.renderAll()
}
const createSVGRect = (fc) => {
  canvas.value = fc
  const __colquicocha = new CustomRect({
    left: 140,
    top: 130,
    width: 950,
    height: 350,
    fill: "transparent",
    // stroke: 'black',
    // strokeWidth: 2,
    selectable: false,
    angle: 25,
  })
  __colquicocha.type = "colquicocha"
  canvas.value.add(__colquicocha)
  const __cancha2 = new CustomRect({
    left: 1050,
    top: 620,
    width: 580,
    height: 150,
    fill: "transparent",
    // stroke: 'black',
    // strokeWidth: 2,
    selectable: false,
    angle: -15,
  })
  __cancha2.type = "cancha2"
  canvas.value.add(__cancha2)
  const __cancha1 = new CustomRect({
    left: 1740,
    top: 250,
    width: 120,
    height: 200,
    fill: "transparent",
    // stroke: 'black',
    // strokeWidth: 2,
    selectable: false,
  })
  __cancha1.type = "cancha1"
  canvas.value.add(__cancha1)
  // canvas.value.renderAll()
}

const empty = () => {
  console.log("Cleared")
  canvas.value.clear()
  // canvas.value.renderAll()
}
const handleMoveUpdatePosition = async () => {
  console.log("Updated")
  if (pilasSelected.value.length > 1) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Seleccione solo una pila",
      life: 3000
    })
    return
  }
  pilasSelected.value.forEach((p) => {
    p.data = {
      x: p.left,
      y: p.top,
      ubication: ubication.value,
    }
    access.value = false
    store.dispatch("ruma_update", p)
  })
}
const moving = async (e) => {
  console.log("Moving")
  if (thereAreUnlessTwoPilasSelected.value) {
    canvas.value.discardActiveObject()
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Debes mover una pila a la vez",
      life: 3000,
    })
    return
  }
  const objectSelected = canvas.value.getActiveObject()
  if (objectSelected) {
    objectSelected.setCoords()
    const colquicocha = canvas.value
      .getObjects()
      .find((o) => o.type === "colquicocha")
    if (colquicocha && objectSelected.intersectsWithObject(colquicocha)) {
      console.log("Colquicocha")
      ubication.value = "Cancha Colquicocha"
      return
    }
    const cancha2 = canvas.value.getObjects().find((o) => o.type === "cancha2")
    if (cancha2 && objectSelected.intersectsWithObject(cancha2)) {
      console.log("Cancha2")
      ubication.value = "Cancha 2"
      return
    }
    const cancha1 = canvas.value.getObjects().find((o) => o.type === "cancha1")
    if (cancha1 && objectSelected.intersectsWithObject(cancha1)) {
      console.log("Cancha1")
      ubication.value = "Cancha 1"
      return
    }
  }
}

const edit = () => {
  canvas.value.forEachObject((o) => {
    o.hasBorders = true
    o.selectable = true
    o.hasControls = true
  })
}

const editRuma = () => {
  const ruma = {
    ley_ag: 9.66,
    cod_tableta: "12",
    ton: 11000,
    mining: "Yumpag",
    x: 50,
    y: 300,
  }
  pilas.value.push(ruma)
  const text = canvas.value.getActiveObject().item(1)
  text.set("text", `${ruma.ley_ag}\n${ruma.cod_tableta}\n${ruma.ton}t`)

  // canvas.value.renderAll()
}

const save = () => {
  canvas.value.forEachObject((o) => {
    o.hasBorders = false
    o.selectable = false
    o.hasControls = false
  })
  canvas.value.renderAll()
  visibleMerge.value = false
}

const remove = () => {
  canvas.value.getActiveObjects().forEach((o) => {
    canvas.value.remove(o)
  })
  canvas.value.discardActiveObject()
  // canvas.value.renderAll()
}
</script>

<template>
  <Totals />
   <GeneratePDF /> 
  <div v-show="false">
    <IPila id="pila" />
    <IGiba id="giba" />
    <IDesmonte id="desmonte" />
    <ICC id="icc" />
    <IC1 id="ic1" />
    <IC2 id="ic2" />
  </div>
  <Toast />
  <div class="c-global-container-map">
    <div class="global-map-button">
      <Button outlined class="btn-map" @click="edit"
        ><CEdit /><span> Editar </span>
      </Button>
      <Button outlined class="btn-map" @click="mergePilas" v-if="visibleMerge"
        ><Bind /><span> Unir </span>
      </Button>
      <Button outlined class="btn-map" v-if="visibleDate"
        ><ICalendar /><span> Abstec. </span>
      </Button>
      <Button outlined class="btn-map" @click="save"
        ><ISave /><span> Guardar </span>
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
        ><Delete /><span> Eliminar </span>
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
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.02);
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  .btn-map {
    color: var(--grey-2);
    background-color: var(--grey-light-1);
    height: 60px;
    min-width: 60px;
    border-radius: 8px;
    padding: 0 0.8rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.2rem;
    svg {
      width: 1.5rem;
      height: 1.5rem;
      color: var(--grey-2);
      fill: transparent;
      stroke-width: 1.6;
    }
    span {
      font-size: clamp(5px, 8vw, 12px);
    }
    &:hover {
      background-color: var(--primary);
      svg {
        color: var(--white);
        fill: transparent;
      }
      span {
        color: var(--white);
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
</style>
