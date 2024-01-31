
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
    return value ? parseFloat(value).toFixed(2) : "";
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