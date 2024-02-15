<script setup>

import { defineProps } from "vue";
const props = defineProps(["data"]);
console.log(props.data);
</script>

<template>
  <div className="modalContent-Succes">
    <div className="modalHeader">
      <div className="success-checkmark">
        <div className="check-cont">
          <div className="check-circle"></div>
          <label className="check-icon"></label>
        </div>
      </div>
    </div>
    <div className="modalBody">
      <small>Se creo la pila</small> 
      <h2 className="success">
        {{ data.pila.pila }}
      </h2>
      <small>éxitosamente</small> 
  
    </div>
    <div className="modalFooter">
      <span>© 2023 Gunjop</span>
    </div>
  </div>
</template>

<style lang="scss">
.modalContent-Succes {
  max-width: 210px;
  width: 100%;
  background-color: var(--white);
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  .modalHeader {
    width: 100%;
    text-align: center;
    svg {
      height: 4rem;
      fill: #f1c100;
    }
   
    .success {
      &::before {
        background-color: var(--primary);
      }
    }
  }

  .modalBody {
    width: 100%;
    text-align: center;
    padding: .5rem 0 1rem 0;
    h2 {
      font-size: clamp(9px, 8vw, 18px);
      color: var(--black);
      font-weight: 600;
      line-height: 1.3rem;
     
    }
  }
  .modalFooter {
    display: flex;
    justify-content: center;
    gap: 1rem;
    span {
      position: relative;
      color: var(--grey-2);
      font-size: clamp(6.5px, 8vw, 10px);
      cursor: pointer;      
    }
  }
}



</style>
