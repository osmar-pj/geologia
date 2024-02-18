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
