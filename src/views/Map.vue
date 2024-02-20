<script setup>
import { ref, markRaw, onMounted, computed, inject } from "vue";
import FabricCanvas from "../components/FabricCanvas.vue";
import { fabric } from "fabric";
import { useStore } from "vuex";
import { Subject, merge } from "rxjs";
import { useToast } from "primevue/usetoast";
import Bind from "../icons/Bind.vue";
import CEdit from "../icons/CEdit.vue";
import Delete from "../icons/Delete.vue";
import ISave from "../icons/ISave.vue";
import Totals from "../components/Totals.vue";
import IPila from "../prueba/IPila.vue";
import IGiba from "../prueba/IGiba.vue";
import IDesmonte from "../maps/IDesmonte.vue";
import ICC from "../prueba/ICC.vue";
import IC1 from "../prueba/IC1.vue";
import IC2 from "../prueba/IC2.vue";
import ICalendar from "../icons/ICalendar.vue";
import GeneratePDF from "../components/GeneratePDF.vue";
import CanchaModal from "../components/CanchaModal.vue";
import MapInfo from "../components/MapInfo.vue";

const socket = inject("socket");
const pila$ = new Subject();
const store = useStore();
const toast = useToast();
const url = import.meta.env.VITE_API_URL;
// const canvas = computed(() => store.state.canvas)
const canvas = ref();
const pilas = computed(() => store.state.rumaTotal);
const trips = ref([]);
const ubication = ref("");
const ubicationId = ref("");
const ubicationType = ref("");
const visibleMerge = ref(false);
const visibleDate = ref(false);
const nonePilaSelected = ref(false);
const unlessOnePilaSelected = ref(false);
const thereAreUnlessTwoPilasSelected = ref(false);
const thereArePilasWithLey = ref(false);
const thereAreSameMining = ref(false);
const thereAreSameDominio = ref(false);
const access = ref(true);
const mergeAvailable = ref(false);
const pilasSelected = ref([]);

const panels = computed(() => store.state.panels);

const openCalendar = ref(false);
const dataModalCalendar = ref(null);
const colquicocha = ref();
const cancha1 = ref();
const cancha2 = ref();

class CustomRect extends fabric.Rect {
  constructor(options) {
    super(options);
    this.cod_tableta = options.cod_tableta;
    this.ton = options.ton;
    this.mining = options.mining;
  }
}

const handleCreated = async (fabricCanvas) => {
  console.log("Canvas Created");
  await store.dispatch("pila_total");
  canvas.value = fabricCanvas;
  await createSVGRect(fabricCanvas);
  pilas.value
    .filter((i) => i.typePila == "Pila")
    .forEach((i) => {
      const pilaSVG = document.getElementById(i._id);
      const svgElem = new fabric.loadSVGFromString(
        pilaSVG.outerHTML,
        (objects, options) => {
          const obj = fabric.util.groupSVGElements(objects, options);
          obj.set({
            left: i.x,
            top: i.y,
            scaleX: .25,
            scaleY: .25,
            selectable: true,
          });
          obj.type = i._id;
          obj.pila = i;
          canvas.value.add(obj);
        }
      );
    });
  pilas.value
    .filter((i) => i.typePila == "Giba")
    .forEach((i) => {
      const gibaSVG = document.getElementById(i._id);
      const svgElem = new fabric.loadSVGFromString(
        gibaSVG.outerHTML,
        (objects, options) => {
          const obj = fabric.util.groupSVGElements(objects, options);
          obj.set({
            left: i.x,
            top: i.y,
            scaleX: .25,
            scaleY: .25,
            selectable: true,
          });
          obj.type = i._id;
          obj.pila = i;
          canvas.value.add(obj);
        }
      );
    });
  await panelsSVG();
  // canvas.value.hasControls = false
  // canvas.value.hasBorders = true
  canvas.value.renderAll();
};

const panelsSVG = () => {
  const positionPanels = [
    { x: 1550, y: 50, type: "Cancha 1" },
    { x: 1100, y: 350, type: "Cancha 2" },
    { x: 240, y: 30, type: "Cancha Colquicocha" },
  ]
  panels.value.forEach((p, i) => {
    const panelSVG = document.getElementById(p.index);
    const svgElem = new fabric.loadSVGFromString(
      panelSVG.outerHTML,
      (objects, options) => {
        const obj = fabric.util.groupSVGElements(objects, options);
        obj.set({
          left: positionPanels[i].x,
          top: positionPanels[i].y,
          scaleX: 1.1,
          scaleY: 1.1,
          selectable: false,
        });
        obj.type = p.ubication;
        canvas.value.add(obj);
      }
    )
  })
}

const handleSelect = (e) => {
  const objectsSelected = canvas.value
    .getActiveObjects()
    .filter(
      (o) =>
        o.type !== "colquicocha" &&
        o.type !== "cancha2" &&
        o.type !== "cancha1" &&
        o.type !== "panel_colquicocha" &&
        o.type !== "panel_cancha2" &&
        o.type !== "panel_cancha1"
    );
  canvas.value.forEachObject((o) => {
    o.hasBorders = true;
    o.selectable = true;
    o.hasControls = true;
    o.lockUniScaling = true;
    o.lockRotation = true;
  });
  canvas.value
    .getObjects()
    .filter(
      (o) =>
        o.type === "colquicocha" ||
        o.type === "cancha2" ||
        o.type === "cancha1" ||
        o.type === "panel_colquicocha" ||
        o.type === "panel_cancha2" ||
        o.type === "panel_cancha1"
    )
    .forEach((o) => {
      o.selectable = false;
      o.hasControls = false;
      o.hasBorders = false;
    });
  pilasSelected.value = objectsSelected;
  nonePilaSelected.value = pilasSelected.value.length === 0;
  unlessOnePilaSelected.value = pilasSelected.value.length > 0;
  thereAreUnlessTwoPilasSelected.value = pilasSelected.value.length > 1;
  thereArePilasWithLey.value = pilasSelected.value.every((o) => o.pila.ley_ag);
  thereAreSameMining.value = pilasSelected.value.every(
    (o) => o.pila.mining === pilasSelected.value[0].pila.mining
  );
  thereAreSameDominio.value = pilasSelected.value.every(
    (o) =>
      modaData(o.pila.dominio) === modaData(pilasSelected.value[0].pila.dominio)
  );
  if (unlessOnePilaSelected.value) {
    // console.log("1 o mas")
    visibleDate.value = true;
  }
  if (thereAreUnlessTwoPilasSelected.value) {
    // console.log("2 o mas")
    visibleMerge.value = true;
  }
  if (nonePilaSelected.value) {
    // console.log("Ninguna")
    visibleMerge.value = false;
    visibleDate.value = false;
  }
};

const mergePilas = async () => {
  if (!thereArePilasWithLey.value) {
    visibleMerge.value = false;
    mergeAvailable.value = false;
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Una o mas leyes aun no fueron calculadas",
      life: 3000,
    });
    return;
  }
  if (!thereAreSameMining.value) {
    visibleMerge.value = false;
    mergeAvailable.value = false;
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Las pilas seleccionadas no son de la misma mina",
      life: 3000,
    });
    return;
  }
  if (!thereAreSameDominio.value) {
    visibleMerge.value = false;
    mergeAvailable.value = false;
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Las pilas seleccionadas no son del mismo dominio",
      life: 3000,
    });
    return;
  }
  const tolerance = 1;
  const leyes = pilasSelected.value.map((o) => o.pila.ley_ag);
  const promedio = leyes.reduce((a, b) => a + b) / leyes.length;
  const differences = leyes.map((ley) => Math.abs(ley - promedio));
  const maxDifference = Math.max(...differences);
  if (maxDifference > tolerance) {
    visibleMerge.value = false;
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Las pilas no tienen leyes similares",
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
      console.log("Data", pilasSelected.value);
      console.log("Correcto");
      // const length = pilasSelected.value.length;
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
        // x: 100,
        // y: 100,
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
        tmh_ag: pilasSelected.value.reduce((a, b) => a + b.pila.tmh_ag, 0),
        tmh_fe: pilasSelected.value.reduce((a, b) => a + b.pila.tmh_fe, 0),
        tmh_mn: pilasSelected.value.reduce((a, b) => a + b.pila.tmh_mn, 0),
        tmh_pb: pilasSelected.value.reduce((a, b) => a + b.pila.tmh_pb, 0),
        tmh_zn: pilasSelected.value.reduce((a, b) => a + b.pila.tmh_zn, 0),
      };
      await store.dispatch("ruma_update", data);
      pilasSelected.value.forEach(async (p) => {
        p.data = {
          statusBelong: "Belong",
          statusPila: "Finalizado",
          history: [
            ...p.pila.history,
            {
              work: "UPDATE Se unio con otra pila",
              date: new Date(),
              user: store.state.user.name,
            },
          ],
        };
        await store.dispatch("ruma_update", p);
      });
    } else {
      console.log("error");
    }
  } catch (error) {
    console.error("Error al crear la Pila:", error);
  }
};

socket.on("pilas", async (data) => {
  const pilasFound = data.map((i) => {
    const pila = pilas.value.find((p) => p._id === i._id);
    return pila;
  });
  pilasFound.forEach((pila) => {
    const oldPila = canvas.value.getObjects().find((o) => o.type === pila._id);
    if (oldPila) {
      canvas.value.remove(oldPila);
    }
  });
  const isPilasFinalized = data.every((p) => p.statusPila === "Finalizado");
  if (isPilasFinalized) {
    await store.dispatch("pila_total");
  }
  pilasFound.length > 0
    ? await updatePilas(pilasFound, data)
    : console.log("No se encontraron pilas");
  await store.commit("getRumaTotal", pilas.value);
  await store.commit("setWeights", pilas.value);
  if (!isPilasFinalized) {
    pilasFound.forEach((pila) => {
      const pilaSVG = document.getElementById(pila._id);
      const svgElem = new fabric.loadSVGFromString(
        pilaSVG.outerHTML,
        (objects, options) => {
          const obj = fabric.util.groupSVGElements(objects, options);
          obj.set({
            left: pila.x,
            top: pila.y,
            scaleX: 0.3,
            scaleY: 0.3,
            selectable: true,
          });
          obj.type = pila._id;
          obj.pila = pila;
          canvas.value.add(obj);
        }
      );
    });
  }
  const panels = canvas.value
    .getObjects()
    .filter((o) => o.type.includes("panel"));
  panels.forEach((p) => {
    //
    canvas.value.remove(p);
  });
  await panelsSVG();
});
const updatePilas = async (pilasFound, data) => {
  pilasFound.forEach((pila, index) => {
    pila.stock = data[index].stock;
    pila.tonh = data[index].tonh;
    pila.ton = data[index].tonh * 0.94;
    pila.ley_ag = data[index].ley_ag;
    pila.ley_fe = data[index].ley_fe;
    pila.ley_mn = data[index].ley_mn;
    pila.ley_pb = data[index].ley_pb;
    pila.ley_zn = data[index].ley_zn;
    pila.tmh_ag = data[index].tmh_ag;
    pila.tmh_fe = data[index].tmh_fe;
    pila.tmh_mn = data[index].tmh_mn;
    pila.tmh_pb = data[index].tmh_pb;
    pila.tmh_zn = data[index].tmh_zn;
    pila.travels = data[index].travels;
    pila.tajo = data[index].tajo;
    pila.cod_despacho = data[index].cod_despacho;
    pila.x = data[index].x;
    pila.y = data[index].y;
    pila.ubication = data[index].ubication;
    pila.mining = data[index].mining;
    pila.dominio = data[index].dominio;
    pila$.next(pila);
  });
};
socket.on("newPila", async (data) => {
  await store.commit("addDataRumaList", data);
  const pila = pilas.value.find((p) => p._id === data._id);
  const pilaSVG = document.getElementById(pila._id);
  const svgElem = new fabric.loadSVGFromString(
    pilaSVG.outerHTML,
    (objects, options) => {
      const obj = fabric.util.groupSVGElements(objects, options);
      obj.set({
        left: pila.x,
        top: pila.y,
        scaleX: 0.3,
        scaleY: 0.3,
        selectable: true,
      });
      obj.type = pila._id;
      obj.pila = pila;
      canvas.value.add(obj);
    }
  );
});

const createSVGRect = (fc) => {
  canvas.value = fc;
  const colquicocha = new CustomRect({
    left: 140,
    top: 130,
    width: 950,
    height: 350,
    fill: "transparent",
    stroke: "black",
    strokeWidth: 2,
    selectable: false,
    angle: 25,
  });
  colquicocha.type = "colquicocha";
  canvas.value.add(colquicocha);
  const cancha2 = new CustomRect({
    left: 1000,
    top: 620,
    width: 580,
    height: 150,
    fill: "transparent",
    stroke: "black",
    strokeWidth: 2,
    selectable: false,
    angle: -15,
  });
  cancha2.type = "cancha2";
  canvas.value.add(cancha2);
  const cancha1 = new CustomRect({
    left: 1640,
    top: 250,
    width: 120,
    height: 200,
    fill: "transparent",
    stroke: "black",
    strokeWidth: 2,
    selectable: false,
  });
  cancha1.type = "cancha1";
  canvas.value.add(cancha1);
};

const modaData = (data) => {
  if (data.length === 0) return "";
  const dataCount = {};
  let max = 0;
  let moda = 0;
  data.forEach((i) => {
    if (dataCount[i]) {
      dataCount[i]++;
    } else {
      dataCount[i] = 1;
    }
  });
  for (const i in dataCount) {
    if (dataCount[i] > max) {
      moda = i;
      max = dataCount[i];
    }
  }
  return moda;
};
const chooseMiningShadesColor = (mining) => {
  return mining == "YUMPAG" ? "#215E08" : "#5C1E05";
};
const chooseMiningMainColor = (mining) => {
  return mining == "YUMPAG" ? "#42B017" : "#E06500";
};
const chooseDominioShadeColor = (dominios) => {
  const dominio = modaData(dominios);
  switch (dominio) {
    case "Polimetálico":
      return "#2B67FF";
    case "Ag/Alabandita":
      return "#FF2B3D";
    case "Ag/Carbonatos":
      return "#FFCC00";
    default:
      return "#224422";
  }
};
const chooseDominioMainColor = (dominios) => {
  const dominio = modaData(dominios);
  switch (dominio) {
    case "Polimetálico":
      return "#6DA0FF";
    case "Ag/Alabandita":
      return "#FF6D7A";
    case "Ag/Carbonatos":
      return "#FFE375";
    default:
      return "#334433";
  }
};

const empty = () => {
  console.log("Cleared");
  canvas.value.clear();
  // canvas.value.renderAll()
};
const handleMoveUpdatePosition = async () => {
  console.log("Updated");
  if (pilasSelected.value.length > 1) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Seleccione solo una pila",
      life: 3000,
    });
    return;
  }
  pilasSelected.value.forEach(async (p) => {
    p.data = {
      x: p.left,
      y: p.top,
      ubication: ubication.value,
    };
    await store.dispatch("ruma_update", p);
  });
  await store.dispatch("pila_total");
};
const moving = async (e) => {
  // console.log("Moving")
  if (thereAreUnlessTwoPilasSelected.value) {
    canvas.value.discardActiveObject();
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Debes mover una pila a la vez",
      life: 3000,
    });
    return;
  }
  const objectSelected = canvas.value.getActiveObject();
  if (objectSelected) {
    objectSelected.setCoords();
    const colquicocha = canvas.value
      .getObjects()
      .find((o) => o.type === "colquicocha");
    if (colquicocha && objectSelected.intersectsWithObject(colquicocha)) {
      // console.log("Colquicocha")
      ubication.value = "Cancha Colquicocha";
      ubicationId.value = "icc";
      ubicationType.value = "panel_colquicocha";
      return;
    }
    const cancha2 = canvas.value.getObjects().find((o) => o.type === "cancha2");
    if (cancha2 && objectSelected.intersectsWithObject(cancha2)) {
      // console.log("Cancha2")
      ubication.value = "Cancha 2";
      ubicationId.value = "ic2";
      ubicationType.value = "panel_cancha2";
      return;
    }
    const cancha1 = canvas.value.getObjects().find((o) => o.type === "cancha1");
    if (cancha1 && objectSelected.intersectsWithObject(cancha1)) {
      // console.log("Cancha1")
      ubication.value = "Cancha 1";
      ubicationId.value = "ic1";
      ubicationType.value = "panel_cancha1";
      return;
    }
  }
};

const edit = () => {
  canvas.value.forEachObject((o) => {
    o.hasBorders = true;
    o.selectable = true;
    o.hasControls = true;
  });
};
const remove = () => {
  // canvas.value.remove(...canvas.value.getActiveObjects())
  pilasSelected.value.forEach(async (p) => {
    p.data = {
      statusPila: "Finalizado",
      history: [
        ...p.pila.history,
        {
          work: "UPDATE pila mal elaborada o en desuso",
          date: new Date(),
          user: store.state.user.name,
        },
      ],
    };
    await store.dispatch("ruma_update", p);
  });
  // canvas.value.renderAll()
};
const save = () => {
  canvas.value.forEachObject((o) => {
    o.hasBorders = false;
    o.selectable = false;
    o.hasControls = false;
  });
  canvas.value.renderAll();
  visibleMerge.value = false;
};
const getDataCalendar = (data) => {
  openCalendar.value = true;
  dataModalCalendar.value = data;
};
</script>

<template>
  <Totals />
  <GeneratePDF />
  <CanchaModal
    v-if="openCalendar"
    @cerrarModal="openCalendar = false"
    :data="dataModalCalendar"
  />
  <div v-show="false">
    <ICC :id="index" :ubication="ubication" :stock="tonh" :nsr="nsr" :ag_equiv="ag_eq" v-for="{ubication, nsr, ag_eq, tonh, index} in panels" />
    <IPila
      v-for="{
        ley_ag,
        stock,
        pila,
        mining,
        dominio,
        _id,
        pilas_merged,
      } in pilas.filter((i) => i.typePila == 'Pila')"
      :ley_ag="ley_ag"
      :stock="stock"
      :pila="pila"
      :mining1="chooseMiningMainColor(mining)"
      :mining2="chooseMiningShadesColor(mining)"
      :dominio1="chooseDominioMainColor(dominio)"
      :dominio2="chooseDominioShadeColor(dominio)"
      :id="_id"
      :merged="pilas_merged.length > 0 ? '*' : ''"
    />
    <IGiba
      v-for="{ ley_ag, stock, pila, mining, dominio, _id } in pilas.filter(
        (i) => i.typePila == 'Giba'
      )"
      :ley_ag="ley_ag"
      :stock="stock"
      :pila="pila"
      :mining1="chooseMiningMainColor(mining)"
      :mining2="chooseMiningShadesColor(mining)"
      :dominio1="chooseDominioMainColor(dominio)"
      :dominio2="chooseDominioShadeColor(dominio)"
      :id="_id"
    />
    <!-- <IDesmonte id="desmonte" v-for="desmonte in pilas.filter(i => i.typePila == 'Desmonte')" :pila="desmonte" :id="desmonte.cod_tableta"/> -->
    <!-- <ICC id="icc" :stock="colquicocha_stock" :nsr="cc_nsr" :ag_equiv="cc_ag_eq" />
    <IC1 id="ic1" :stock="cancha1_stock"  :nsr="c1_nsr" :ag_equiv="c1_ag_eq" />
    <IC2 id="ic2" :stock="cancha2_stock"  :nsr="c2_nsr" :ag_equiv="c2_ag_eq" /> -->
  </div>
  <Toast />
  <div class="c-global-container-map">
    <div class="global-map-button">
      <Button outlined class="btn-map" @click=""
        ><CEdit /><span> Remut. </span>
      </Button>
      <Button outlined class="btn-map" @click="edit"
        ><CEdit /><span> Editar </span>
      </Button>
      <Button
        outlined
        class="btn-map"
        @click.prevent="mergePilas"
        v-if="visibleMerge"
        ><Bind /><span> Unir </span>
      </Button>
      <Button
        outlined
        class="btn-map"
        v-if="visibleDate"
        @click.prevent="getDataCalendar(pilasSelected)"
        ><ICalendar /><span> Abstec. </span>
      </Button>
      <Button outlined class="btn-map" @click="save"
        ><ISave /><span> Guardar </span>
      </Button>
      <Button outlined class="btn-map" @click="remove"
        ><Delete /><span> Eliminar </span>
      </Button>
    </div>
    <div class="global-map-search">
      <input type="text" placeholder="Buscar" >
    </div>
    <Transition name="bounce">
      <MapInfo v-if="unlessOnePilaSelected" :data="pilasSelected"/>
  </Transition>
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
  flex: 1 1;
  position: relative;
  background-image: url("../assets/img/map-ruma.svg");
  background-size: contain;
  background-repeat: no-repeat;
  // background-position: center;
}
.global-map-search{
  display: flex;
  gap: 0.5rem;
  position: absolute;
  padding: 8px;
  border-radius: 10px;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.02);
  top: 10px;
  right: 0;
 
}
</style>
