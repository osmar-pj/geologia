<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="injectedSvg" dataSrc="/icons/route01StrokeRounded.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#000000">
<circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></circle>
<circle cx="6" cy="19" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></circle>
<path d="M12 5H8.5C6.567 5 5 6.567 5 8.5C5 10.433 6.567 12 8.5 12H15.5C17.433 12 19 13.567 19 15.5C19 17.433 17.433 19 15.5 19H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
</svg>
</template>

<script>
export default {
  name: "IList",
  props: {
    color: {
      type: String,
      default: "#fff", // Valor por defecto, puedes ajustarlo según tus necesidades
    },
  },
};
</script>
