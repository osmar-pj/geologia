
export const formatDate = (value) => {
    return value
      ? new Date(value).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "";
  };
  
  export const formatFixed = (value) => {
    const valuesRedondo = Math.round(value * 100) / 100
    const valueFixed = valuesRedondo.toFixed(2)
    const valueFormatted = valueFixed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return value ? valueFormatted : "";
  };
  
  export const formatArrayField = (value, field, row) => {
    const result = value !== null ? value : row[field];
      const isArr = Array.isArray(result)
      if (isArr) {
        const listValues = `
          ${result[0]}, ${result[1]} 
        `
        return listValues
      } else {
        return result
      }
  };

  export const createArray = (nro, word) => {
    const arr = []
    for (let i = 0; i < nro; i++) {
        arr.push(word)
    }
    return arr
}