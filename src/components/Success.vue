<script setup></script>

<template>
  <div className="modalContent-Succes">
    <div className="modalHeader">
      <div className="success-checkmark">
        <div className="check-cont">
          <div className="check-circle"></div>
          <label className="check-icon"></label>
        </div>
      </div>
      <h2 className="success">
        Proceso <br />
        Terminado!
      </h2>
    </div>
    <div className="modalBody">
      <p>El viaje realizado ha sido completado con éxito.</p>
    </div>
    <div className="modalFooter">
      <span>Ver lista de viajes</span>
    </div>
  </div>
</template>

<style lang="scss">
.modalContent-Succes {
  max-width: 250px;
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
    h2 {
      color: var(--black);
      font-weight: 600;
      padding-top: 1rem;
      line-height: 1.3rem;
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
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .modalFooter {
    display: flex;
    justify-content: center;
    gap: 1rem;
    span {
      position: relative;
      color: var(--black);
      font-size: clamp(6.5px, 8vw, 10px);
      cursor: pointer;
      &::before {
        position: absolute;
        content: "";
        background-color: var(--black);
        width: 100%;
        height: 0.05px;
        top: 100%;
      }
    }
  }
}

.modal-oops {
  max-width: 300px;
}

.check-cont {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.check-circle {
  position: relative;
  height: 50px;
  width: 50px;
  border: 2px solid var(--white);
  border-radius: 50%;
  animation: rotate 1s linear forwards;
}

@keyframes rotate {
  0% {
    border-left-color: #e67e22;
  }
  30% {
    border-left-color: yellow;
  }

  55% {
    border-left-color: #e67e22;
  }

  75% {
    border-left-color: yellow;
  }

  100% {
    transform: rotate(360deg);
    background-color: var(--primary);
  }
}

.check-icon {
  position: absolute;
  content: "";
  transform: scaleX(-1) rotate(135deg);
  height: 22px;
  width: 12px;
  border-top: 4px solid var(--white);
  border-right: 4px solid var(--white);
  transform-origin: left top;
  animation: check-icon 2s ease-in-out;
  top: 53%;
  left: 44%;
}

@keyframes check-icon {
  0% {
    height: 0;
    width: 0;
    opacity: 0;
  }

  20% {
    height: 0;
    width: 12px;
    opacity: 1;
  }

  40% {
    height: 22px;
    width: 12px;
    opacity: 1;
  }

  100% {
    height: 22px;
    width: 12px;
    opacity: 1;
  }
}
</style>
