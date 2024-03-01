<script setup>
import { ref, computed, inject } from "vue";
import { fabric } from "fabric";
import { useStore } from "vuex";
import { Subject, merge } from "rxjs";
import { useToast } from "primevue/usetoast";
import FabricCanvas from "../components/FabricCanvas.vue";
import Bind from "../icons/Bind.vue";
import CEdit from "../icons/CEdit.vue";
import Delete from "../icons/Delete.vue";
import ISave from "../icons/ISave.vue";
import Totals from "../components/Totals.vue";
import IPila from "../maps/IPila.vue";
import ICenter from "../icons/ICenter.vue";
import IResample from "../icons/IResample.vue";
import IDesmonte from "../maps/IDesmonte.vue";
import ICalendar from "../icons/ICalendar.vue";
import IPanel from "../maps/IPanel.vue";
import GeneratePDF from "../components/GeneratePDF.vue";
import CanchaModal from "../components/CanchaModal.vue";
import MapInfo from "../components/MapInfo.vue";
import zoneCC from "../prueba/zoneCC.vue";
import zoneC1 from "../prueba/zoneC1.vue";
import zoneC2 from "../prueba/zoneC2.vue";

const showOCModal = ref(false);
const openModal = () => {
  showOCModal.value = true;
};

const socket = inject("socket");
const pila$ = new Subject();
const store = useStore();
const toast = useToast();
const url = import.meta.env.VITE_API_URL;

const canvas = ref();
const pilas = computed(() => store.state.rumaTotal);
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
const mergeAvailable = ref(false);
const pilasSelected = ref([]);
const panels = computed(() => store.state.panels);
const openCalendar = ref(false);
const dataModalCalendar = ref(null);
const moveAvailable = ref(false);

class CustomRect extends fabric.Rect {
  constructor(options) {
    super(options);
    this.cod_tableta = options.cod_tableta;
    this.ton = options.ton;
    this.mining = options.mining;
  }
}
// CORREGIR LA BD DESDE UN INICIO EL COD TABLETA EN LOS TRIPS
const scaleXOfPila = 5;
const scaleYOfPila = 5;

const handleCreated = async (fabricCanvas) => {
  console.log("Canvas Created");
  await store.dispatch("pila_total");
  await store.dispatch("get_config");
  canvas.value = fabricCanvas;
  await createSVGRect();
  const imgMap = document.getElementById("map");
  const svgMap = new fabric.Image(imgMap, {
    left: 35,
    top: 110,
    scaleX: 0.7,
    scaleY: 0.9,
    selectable: false,
    hasBorders: false,
    hasControls: false,
  });
  svgMap.type = "map";
  canvas.value.add(svgMap);
  pilas.value
    // .filter((i) => i.typePila == "Pila")
    .forEach((i) => {
      const pilaSVG = document.getElementById(i._id);
      const svgElem = new fabric.loadSVGFromString(
        pilaSVG.outerHTML,
        (objects, options) => {
          const obj = fabric.util.groupSVGElements(objects, options);
          obj.set({
            left: i.x,
            top: i.y,
            scaleX: scaleXOfPila,
            scaleY: scaleYOfPila,
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
  // await createSVGRect()
  canvas.value.renderAll();
};

const panelsSVG = () => {
  const positionPanels = [
    { x: 240, y: 130, type: "Cancha Colquicocha" },
    { x: 1600, y: 170, type: "Cancha 1" },
    { x: 1100, y: 520, type: "Cancha 2" },
  ];
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
    );
  });
};

const handleSelect = (e) => {
  const objectsSelected = canvas.value
    .getActiveObjects()
    .filter(
      (o) =>
        o.type !== "cc1" &&
        o.type !== "cc2" &&
        o.type !== "c2" &&
        o.type !== "c1" &&
        o.type !== "Cancha Colquicocha" &&
        o.type !== "Cancha 2" &&
        o.type !== "Cancha 1" &&
        o.type !== "map"
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
        o.type === "cc1" ||
        o.type === "cc2" ||
        o.type === "c2" ||
        o.type === "c1" ||
        o.type === "Cancha Colquicocha" ||
        o.type === "Cancha 2" ||
        o.type === "Cancha 1" ||
        o.type === "map"
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
<<<<<<< HEAD
      console.log("Correcto")
      const length = pilasSelected.value.length
=======
      console.log("Correcto");
      // const length = pilasSelected.value.length
>>>>>>> 68b7eba743f311d4878453a8bfffefa8aa1e2e13
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
  // console.log('SOCKET', data)
  const pilasFound = data.map((i) => {
    const pila = pilas.value.find((p) => p._id === i._id);
    return pila;
  });
  // Limpia canvas de las viejas pilas
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
            scaleX: scaleXOfPila,
            scaleY: scaleYOfPila,
            selectable: true,
          });
          obj.type = pila._id;
          obj.pila = pila;
          canvas.value.add(obj);
        }
      );
    });
  }
  await store.commit("setWeights", pilas.value);
  const panels = canvas.value
    .getObjects()
    .filter((o) => o.type.includes("Cancha"));
  panels.forEach((p) => {
    canvas.value.remove(p);
  });
  await panelsSVG();
});
const updatePilas = async (pilasFound, data) => {
  pilasFound.forEach((pila, index) => {
    pila.stock = data[index].stock;
    pila.tonh = data[index].tonh;
    pila.ton = data[index].tonh * 0.94;
    pila.travels = data[index].travels;
    pila.tajo = data[index].tajo;
    pila.cod_despacho = data[index].cod_despacho;
    pila.statusPila = data[index].statusPila;
    pila.history = data[index].history;
    pila.date_abastecimiento = data[index].date_abastecimiento;
    pila.ubication = data[index].ubication;
    pila.ley_ag = data[index].ley_ag;
    pila.ley_fe = data[index].ley_fe;
    pila.ley_mn = data[index].ley_mns;
    pila.ley_pb = data[index].ley_pb;
    pila.ley_zn = data[index].ley_zn;
    pila.tmh_ag = data[index].tmh_ag;
    pila.tmh_fe = data[index].tmh_fe;
    pila.tmh_mn = data[index].tmh_mn;
    pila.tmh_pb = data[index].tmh_pb;
    pila.tmh_zn = data[index].tmh_zn;
    pila.x = data[index].x;
    pila.y = data[index].y;
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
        scaleX: scaleXOfPila,
        scaleY: scaleYOfPila,
        selectable: true,
      });
      obj.type = pila._id;
      obj.pila = pila;
      canvas.value.add(obj);
    }
  );
});

const createSVGRect = () => {
  const colquicocha1 = new CustomRect({
    left: 20 + 35,
    top: 225 + 110,
    width: 530,
    height: 290,
    fill: "transparent",
    // stroke: "black",
    // strokeWidth: 2,
    selectable: false,
    hasBorders: false,
    hasControls: false,
    angle: 0,
  });
  colquicocha1.type = "cc1";
  canvas.value.add(colquicocha1);
  const colquicocha2 = new CustomRect({
    left: 210 + 35,
    top: 420 + 110,
    width: 790,
    height: 280,
    fill: "transparent",
    // stroke: "black",
    // strokeWidth: 2,
    selectable: false,
    hasBorders: false,
    hasControls: false,
    angle: 12,
  });
  colquicocha2.type = "cc2";
  canvas.value.add(colquicocha2);
  const cancha2 = new CustomRect({
    left: 1000 + 35,
    top: 690 + 110,
    width: 600,
    height: 160,
    fill: "transparent",
    // stroke: "black",
    // strokeWidth: 2,
    selectable: false,
    hasBorders: false,
    hasControls: false,
    angle: -18,
  });
  cancha2.type = "c2";
  canvas.value.add(cancha2);
  const cancha1 = new CustomRect({
    left: 1670 + 35,
    top: 220 + 110,
    width: 130,
    height: 260,
    fill: "transparent",
    // stroke: "black",
    // strokeWidth: 2,
    selectable: false,
    hasBorders: false,
    hasControls: false,
  });
  cancha1.type = "c1";
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
  // await store.dispatch("pila_total")
};
const moving = async (e) => {
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
    const colquicocha1 = canvas.value
      .getObjects()
      .find((o) => o.type === "cc1");
    if (colquicocha1 && objectSelected.intersectsWithObject(colquicocha1)) {
      // console.log("Colquicocha")
      ubication.value = "Cancha Colquicocha";
      ubicationId.value = "icc";
      ubicationType.value = "cc1";
      return;
    }
    const colquicocha2 = canvas.value
      .getObjects()
      .find((o) => o.type === "cc2");
    if (colquicocha2 && objectSelected.intersectsWithObject(colquicocha2)) {
      // console.log("Colquicocha")
      ubication.value = "Cancha Colquicocha";
      ubicationId.value = "icc";
      ubicationType.value = "cc2";
      return;
    }
    const cancha2 = canvas.value.getObjects().find((o) => o.type === "c2");
    if (cancha2 && objectSelected.intersectsWithObject(cancha2)) {
      // console.log("Cancha2")
      ubication.value = "Cancha 2";
      ubicationId.value = "ic2";
      ubicationType.value = "c2";
      return;
    }
    const cancha1 = canvas.value.getObjects().find((o) => o.type === "c1");
    if (cancha1 && objectSelected.intersectsWithObject(cancha1)) {
      // console.log("Cancha1")
      ubication.value = "Cancha 1";
      ubicationId.value = "ic1";
      ubicationType.value = "c1";
      return;
    }
  }
};

const edit = () => {
  moveAvailable.value = !moveAvailable.value;
  // canvas.value.forEachObject((o) => {
  //   o.hasBorders = true
  //   o.selectable = true
  //   o.hasControls = true;
  // });
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
const move = (e) => {
  if (e.e.buttons == 1 && pilasSelected.value.length == 0) {
    canvas.value.relativePan(new fabric.Point(e.e.movementX, e.e.movementY));
  }
};
</script>

<template>
  <h1>Pilas: {{ pilas.length }}</h1>
  <h1>Canvas: {{ canvas ? canvas.getObjects().length - 8 : 0 }}</h1>
  <!-- <Totals /> -->
  <button class="btn-success btn-GP" @click.prevent="openModal()">
    Generar PDF
  </button>
  <CanchaModal
    v-if="openCalendar"
    @cerrarModal="openCalendar = false"
    :data="dataModalCalendar"
  />
  <div v-show="false">
    <IPila
      v-for="{
        ley_ag,
        stock,
        pila,
        mining,
        dominio,
        _id,
        pilas_merged,
        statusPila,
        createdAt,
      } in pilas"
      :ley_ag="ley_ag"
      :stock="stock"
      :pila="pila"
      :mining1="chooseMiningMainColor(mining)"
      :mining2="chooseMiningShadesColor(mining)"
      :dominio1="chooseDominioMainColor(dominio)"
      :dominio2="chooseDominioShadeColor(dominio)"
      :id="_id"
      :isMerged="pilas_merged.length > 0"
      :statusPila="statusPila"
      :createdAt="createdAt"
    />
    <zoneCC id="cc" />
    <zoneC1 id="c1" />
    <zoneC2 id="c2" />
    <img src="../prueba/canchas.png" alt="" id="map" />
    <!-- <IMap id="map" /> -->
<<<<<<< HEAD
    <IPanel v-for="{ubication, total, index} in panels" :id="index" :ubication="ubication" :stock="total.stock" :nsr="total.nsr" :ag_equiv="total.ag_eq"/>
=======
    <IPanel
      v-for="{ ubication, total, index } in panels"
      :id="index"
      :ubication="ubication"
      :stock="total.stock"
      :nsr="total.nsr"
      :ag_equiv="total.ag_eq"
    />
    <!-- <ICC :id="index" :ubication="ubication" :stock="total.stock" :nsr="total.nsr" :ag_equiv="total.ag_eq" v-for="{ubication, total, index} in panels" /> -->
    <!-- <IDesmonte id="desmonte" v-for="desmonte in pilas.filter(i => i.typePila == 'Desmonte')" :pila="desmonte" :id="desmonte.cod_tableta"/> -->
>>>>>>> 68b7eba743f311d4878453a8bfffefa8aa1e2e13
  </div>
  <Toast />
  <div class="c-global-container-map">
    <div class="global-map-button">
      <Button outlined class="btn-map" @click=""
        ><IResample /><span> Remut. </span>
      </Button>
      <Button outlined class="btn-map" @click=""
        ><ICenter /><span> Restab. </span>
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
      <input type="text" placeholder="Buscar" />
    </div>
    <Transition name="bounce">
      <MapInfo v-if="unlessOnePilaSelected" :data="pilasSelected" />
    </Transition>
    <FabricCanvas
      @canvas-created="handleCreated"
      @click:selected="handleSelect"
      @click:updated="handleMoveUpdatePosition"
      @click:cleared="empty"
      @mouse:moving="moving"
      @mouse:wheel=""
      @mouse:move="move"
    />
    <div>
      <span class="loader"></span>
    </div>
  </div>
  <Transition :duration="550" name="nested">
    <GeneratePDF v-if="showOCModal" @cerrarModal="showOCModal = false" />
  </Transition>
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
  background-image: url("../prueba/fondo.png");
  background-size: cover;
  background-repeat: no-repeat;
  // background-position: center;
}
.global-map-search {
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
