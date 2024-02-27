export const formatDate = (value) => {
  const date = new Date(value);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${hours}:${minutes}:${seconds}, ${getMonthName(
    date.getMonth() 
  )} ${day} ${year}`;
};

export const formatDateAbas = (value) => {
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${getMonthName(date.getMonth())} ${day}, ${year}`;
};

export const formatHour = (value) => {
  const date = new Date(value);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const getMonthName = (monthIndex) => {
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Oct",
    "Nov",
    "Dic",
  ];
  return months[monthIndex];
};

export const formatFixed = (value) => {
  const valuesRedondo = Math.round(value * 100) / 100;
  const valueFixed = valuesRedondo.toFixed(2);
  const valueFormatted = valueFixed
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return value ? valueFormatted : "";
};

export const formatArrayField = (value, field, row) => {
  const result = value !== null ? value : row[field];
  const isArr = Array.isArray(result);
  if (isArr) {
    const listValues = `
          ${result[0]}, ${result[1]} 
        `;
    return listValues;
  } else {
    return result;
  }
};

export const createArray = (nro, word) => {
  const arr = [];
  for (let i = 0; i < nro; i++) {
    arr.push(word);
  }
  return arr;
};

export const calculus = (pilas, vp_ag, vp_pb, vp_zn) => {
  const totalWeight = pilas
    .map((pila) => pila.tonh)
    .reduce((acc, curr) => acc + curr, 0);
  const tmh_ag = pilas
    .map((pila) => pila.tonh * pila.ley_ag)
    .reduce((acc, curr) => acc + curr, 0);
  const tmh_fe = pilas
    .map((pila) => pila.tonh * pila.ley_fe)
    .reduce((acc, curr) => acc + curr, 0);
  const tmh_mn = pilas
    .map((pila) => pila.tonh * pila.ley_mn)
    .reduce((acc, curr) => acc + curr, 0);
  const tmh_pb = pilas
    .map((pila) => pila.tonh * pila.ley_pb)
    .reduce((acc, curr) => acc + curr, 0);
  const tmh_zn = pilas
    .map((pila) => pila.tonh * pila.ley_zn)
    .reduce((acc, curr) => acc + curr, 0);
  const pilasCalculate = {
    ley_ag: tmh_ag / totalWeight,
    ley_pb: tmh_pb / totalWeight,
    ley_zn: tmh_zn / totalWeight,
  };
  const ag_rec = (x) => {
    if (x < 2.8) {
      return x * 0.28877;
    } else {
      return 0.0422 * Math.log(x) + 0.768505;
    }
  };
  const pb_rec = (x) => {
    if (x < 0.4) {
      return x * 2.2829;
    } else {
      return 0.0024 * x + 0.896;
    }
  };
  const zn_rec = (x) => {
    if (x < 0.55) {
      return x * 0.8564;
    } else if (x < 7.85) {
      return 0.14627 * Math.log(x) + 0.60619;
    } else {
      return 0.808;
    }
  };
  const nsr =
    ag_rec(pilasCalculate.ley_ag) * vp_ag * pilasCalculate.ley_ag +
    pb_rec(pilasCalculate.ley_pb) * vp_pb * pilasCalculate.ley_pb +
    zn_rec(pilasCalculate.ley_zn) * vp_zn * pilasCalculate.ley_zn;
  const ag_eq = nsr / (vp_ag * ag_rec(pilasCalculate.ley_ag));
  return {
    stock: totalWeight.toFixed(1),
    nsr: nsr.toFixed(2),
    ag_eq: ag_eq.toFixed(2),
  };
};