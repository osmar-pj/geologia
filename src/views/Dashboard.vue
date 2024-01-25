<script setup>
import Graf from "../components/Graf.vue";

</script>

<template>
  <div class="c-global-header">
    <div class="global-h-title">
      <div class="g-h-t-primary">
        <h1>Total Guardia Semanal</h1>
      </div>
      <span>Hoy| Dia terminado en Mina </span>
    </div>
    <div class="global-h-button">
     
    </div>
  </div>
  <div class="c-global-c-content">
    <Graf />
  </div>
</template>

<style lang="scss">
.global-h-button {
  display: flex;
  gap: 1rem;
}
.c-global-header {
  width: 100%;
  padding: 1.5rem 2.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  .global-h-title {
    span {
      color: var(--grey-1);
      font-size: clamp(6px, 8vw, 14px);
      line-height: 1.1rem;
      font-weight: 400;
    }
    .g-h-t-primary {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
      span {
        color: var(--grey-2);
        font-size: clamp(6px, 8vw, 14px);
        font-weight: 600;
        line-height: 1.1rem;
        background-color: var(--grey-light-1);
        padding: 2px 5px;
        border-radius: 8px;
      }
    }
  }
  .global-h-button {
  }
  //   @include md {
  //     padding: 1.5rem 5rem;
  //   }
}

.c-global-c-content {
  display: flex;
  flex-direction: column;
  padding: 0 2.5rem;
  padding-bottom: 1rem;
  gap: 1rem;
  flex: 1 1;
  overflow: hidden;
  .users-c-c-filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    .c-c-filters-search {
      display: flex;
      position: relative;
      max-width: 300px;
      width: 100%;
      img {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 15px;
        width: 1rem;
      }
    }
    .c-c-filters-type {
      flex: 1 1 250px;
      label {
        font-size: clamp(5px, 8vw, 10px);
        font-weight: 500;
        //   @include md {
        //     font-size: clamp(6px, 8vw, 12px);
        //   }
      }
      .imputs-i-input {
        position: relative;
        img {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 15px;
          width: 1rem;
        }
      }
    }
    .c-c-filters-items {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: clamp(6px, 8vw, 14px);
      // @include md {
      //   font-size: clamp(6px, 8vw, 13px);
      // }
    }
  }

  .users-c-c-footer {
    display: flex;
    justify-content: space-between;
    .c-c-footer-page {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      button {
        height: 30px;
        width: 30px;
        padding: 0;
        border: 0.5px solid var(--grey-light-2);
        display: grid;
        place-items: center;
        border-radius: 5px;
        img {
          width: 0.7rem;
        }
        &:nth-child(1) {
          img {
            transform: rotate(90deg);
          }
        }
        &:nth-child(3) {
          img {
            transform: rotate(270deg);
          }
        }
        &:hover {
          background-color: #f3f3f4;
        }
      }
      span {
        display: flex;
        gap: 0.5rem;
        font-size: clamp(6px, 8vw, 12px);
        //   @include md {
        //     font-size: clamp(6px, 8vw, 13px);
        //   }
      }
    }
  }
  // @include md {
  //   padding: 3rem;
  // }
}
</style>
