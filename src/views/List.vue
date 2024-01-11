<script setup>
const title = "Lista de Viajes";
</script>

<template>
  <div class="c-global-header">
    <div class="global-h-title">
      <button class="h-title-btn">
        <!-- <img src="imgs/i-drop.svg" alt="" /> -->
      </button>
      <div>
        <h1>{{ title }}</h1>
      </div>
    </div>
    <div class="global-h-button">
      <button>+ Crear nuevo</button>
    </div>
  </div>
  <div class="c-global-content">
    <div class="global-c-content">
      <div class="users-c-c-filters">
        <div class="c-c-filters-search">
          <!-- <img src="imgs/i-search.svg" alt="" /> -->
          <input
            type="text"
            value="{filtering}"
            placeholder="Buscar por nombre, email, rol..."
          />
        </div>
        <div class="c-c-filters-items">
          Items:
          <select>
            <option>5</option>
            <option>10</option>
            <option>15</option>
          </select>
        </div>
      </div>

      <div class="users-c-c-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Fecha</th>
              <th>Operador</th>
              <th>Placa</th>
              <th>Tonelada</th>
              <th>Mineral</th>
              <th>Tajo</th>
            </tr>
            ))}
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="td-user">
                  <div class="t-name">
                    <h4>#1</h4>
                  </div>
                </div>
              </td>
              <td>12/12/2024</td>
              <td>
                <div class="td-user">
                  <span class="t-siglas" style="{spanStyle}">
                   CP
                  </span>
                  <div class="t-name">
                    <h4>Carlos Pablo</h4>
                    <h5 class="t-2">Pedro Solis</h5>
                  </div>
                </div>
              </td>
              <td>
                <div class="td-user">
                  <div class="t-name">
                    <h4>LOC .#26</h4>
                    <h5>automovil</h5>
                  </div>
                </div>
              </td>
              <td>
                <div class="td-user">
                  <div class="t-name">
                    <h4>80</h4>
                    <h5>toneladas</h5>
                  </div>
                </div>
              </td>
              <td>
                <div class="td-user">
                  <div class="t-name">
                    <h4>80</h4>
                    <h5>toneladas</h5>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>1</td>
              <td>12/12/2024</td>
              <td>Codoaldo Deudor Meza</td>
              <td>Loc #26</td>
              <td>80 TM</td>
              <td>TJ2345_1P</td>
            </tr>
            <tr>
              <td>1</td>
              <td>12/12/2024</td>
              <td>Codoaldo Deudor Meza</td>
              <td>Loc #26</td>
              <td>80 TM</td>
              <td>TJ2345_1P</td>
            </tr>
            <tr>
              <td>1</td>
              <td>12/12/2024</td>
              <td>Codoaldo Deudor Meza</td>
              <td>Loc #26</td>
              <td>80 TM</td>
              <td>TJ2345_1P</td>
            </tr>
            <tr>
              <td>1</td>
              <td>12/12/2024</td>
              <td>Codoaldo Deudor Meza</td>
              <td>Loc #26</td>
              <td>80 TM</td>
              <td>TJ2345_1P</td>
            </tr>
            <tr>
              <td>1</td>
              <td>12/12/2024</td>
              <td>Codoaldo Deudor Meza</td>
              <td>Loc #26</td>
              <td>80 TM</td>
              <td>TJ2345_1P</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="users-c-c-footer">
        <div class="c-c-footer-item"></div>
        <div class="c-c-footer-page">
          <button>
            <!-- <img src="imgs/i-drop.svg" alt="" /> -->
          </button>
          <span class=""> Página <strong> 2 de 10 </strong> </span>
          <button>
            <!-- <img src="imgs/i-drop.svg" alt="" /> -->
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.c-global-header {
  width: 100%;
  height: 15%;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 0.5px solid var(--grey-light-2);
  .global-h-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    .h-title-btn {
      height: 40px;
      width: 40px;
      padding: 0.1rem 0.8rem;
      border: 0.5px solid var(--grey-light-2);
      img {
        width: 0.8rem;
        transform: rotate(90deg);
      }
    }
  }
  .global-h-button {
    button {
      background-color: var(--secondary);
      &:hover {
        background-color: var(--primary);
      }
    }
  }
  //   @include md {
  //     padding: 1.5rem 5rem;
  //   }
}

.c-global-content {
  width: 100%;
  height: 85%;
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;

  .global-c-content {
    background-color: var(--white);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 0px 13px 0px rgba(82, 63, 105, 0.05);
    padding: 1.5rem;
    gap: 1rem;
    height: 70vh;
    overflow: auto;
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
        .imputs-i-radio {
          display: flex;
          gap: 1rem;
          label {
            width: 100%;
            position: relative;
            border: 1px solid var(--grey-light-2);
            background-color: var(--white);
            padding: 5px 20px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.4s ease;
            font-size: clamp(6px, 8vw, 12px);
            font-weight: normal;
            color: var(--black);
            display: flex;
            align-items: center;
            height: 40px;
            &::before {
              content: "";
              border-radius: 50%;
              height: 10px;
              width: 10px;
              border: 1px solid var(--grey-light-2);
              margin-right: 15px;
              transition: all 0.4s ease;
            }
            // @include md {
            //   font-size: clamp(7px, 8vw, 14px);
            //   height: 45px;
            //   padding: 13px 20px;
            // }
          }

          input[type="radio"]:checked + label {
            background: var(--tertiary);
            border: 1px solid var(--secondary);
            color: var(--secondary);
          }

          input[type="radio"]:checked + label::before {
            background-color: var(--secondary);
          }
        }
      }
      .c-c-filters-items {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: clamp(6px, 8vw, 12px);
        // @include md {
        //   font-size: clamp(6px, 8vw, 13px);
        // }
      }
    }
    .users-c-c-table {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      overflow: auto;

      table {
        width: 100%;
        color: var(--black);
        font-size: clamp(5px, 8vw, 12px);
        line-height: 0.7rem;
        font-weight: normal;
        border-collapse: collapse;
        white-space: nowrap;
        // @include md {
        //   font-size: clamp(6px, 8vw, 14px);
        //   line-height: 1.1rem;
        // }
      }

      thead {
        color: var(--grey-1);
        text-align: left;
        background-color: var(--grey-light-1);
        font-size: clamp(6px, 8vw, 11px);
        position: sticky;
        top: 0;
        z-index: 1;
        // @include md {
        //   font-size: clamp(6px, 8vw, 12px);
        // }
      }

      th {
        padding: 15px;
        font-weight: normal !important;
        div {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          img {
            width: 0.5rem;
            // @include md {
            //   width: 0.6rem;
            // }
          }
          //   @include md {
          //     gap: 0.5rem;
          //   }
        }
      }

      td {
        padding: 13px 15px;

        // @include md {
        //   padding: 15px;
        // }
      }

      tbody tr {
        z-index: 99;
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
  //   @include md {
  //     gap: 1.5rem;
  //     padding: 1.5rem 5rem;
  //   }
}

.btns {
  display: flex;
  gap: 1rem;
  button {
    padding: 0;
    width: auto;
    display: grid;
    place-items: center;
    img {
      width: 1rem;
    }
    &:hover {
      transform: scale(1.4);
    }
  }
}

.td-user {
  display: flex;
  align-items: center;
  gap: 1rem;
  .t-siglas {
    width: 35px;
    height: 35px;
    background-color: #0092e6;
    color: var(--white);
    text-transform: uppercase;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: clamp(7px, 8vw, 16px);
  }
  .t-name {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    h4 {
      text-transform: capitalize;
    }
    h5 {
      text-transform: lowercase;
      font-size: clamp(6px, 8vw, 10px);
      //   @include md {
      //     font-size: clamp(6px, 8vw, 12px);
      //   }
    }
    h4 {
      font-weight: 500;
      font-size: clamp(6px, 8vw, 12px);
      //   @include md {
      //     font-size: clamp(6px, 8vw, 14px);
      //   }
    }
    .t-2 {
      text-transform: capitalize;
    }
  }
}

.td-cot {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  img {
    width: 1.1rem;
  }
  h4 {
    text-transform: uppercase;
    font-weight: 500;
    font-size: clamp(6px, 8vw, 12px);
    // @include md {
    //   font-size: clamp(6px, 8vw, 14px);
    // }
  }
}

.t-cort {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 150px;
  font-size: clamp(6px, 8vw, 14px);
}

.custom-select-quotes__control {
  height: 25px !important;
  box-shadow: none !important;
  cursor: pointer !important;
  border-radius: 8px !important;
  position: relative !important;
  min-height: 30px !important;
  min-width: 120px !important;
  //   @include md {
  //     min-height: 35px !important;
  //     min-width: 140px !important;
  //   }
  &:hover {
    border: 0.5px solid var(--secondary) !important;
  }
}

.custom-select-quotes__indicator-separator {
  display: none;
}
.custom-select-quotes__value-container {
  padding: 0 2.5px 0 12px !important;
  height: 25px !important;
  align-content: center !important;
  //   @include md {
  //     height: 30px !important;
  //   }
}
.custom-select-quotes__indicator {
  padding: 0 !important;
  align-items: center;
  svg {
    width: 12px;
    height: 12px;
    // @include md {
    //   width: 16px;
    //   height: 16px;
    // }
  }
}
.custom-select-quotes__indicators {
  padding: 0 12px 0 2.5px !important;
  height: 25px !important;
  align-content: center !important;
  //   @include md {
  //     height: 30px !important;
  //   }
}

.custom-select-quotes__option--is-selected {
  background-color: var(--tertiary) !important;
  color: var(--secondary) !important;
}

.pendiente-select {
  .custom-select-quotes__control {
    background-color: #ffefd6 !important;
    border: 1px #ffefd6 solid !important;
  }
  .custom-select-quotes__single-value {
    color: #9c3b00 !important;
  }

  .custom-select-quotes__indicator {
    svg {
      fill: #9c3b00;
    }
  }
}

.creado-select {
  .custom-select-quotes__control {
    background-color: #ebebeb !important;
    border: 1px #ebebeb solid !important;
  }
  .custom-select-quotes__single-value {
    color: #969696 !important;
  }

  .custom-select-quotes__indicator {
    svg {
      fill: #969696;
    }
  }
}

.enviado-select {
  .custom-select-quotes__control {
    background-color: #f8d6ff !important;
    border: 1px #f8d6ff solid !important;
  }
  .custom-select-quotes__single-value {
    color: #97009c !important;
  }

  .custom-select-quotes__indicator {
    svg {
      fill: #97009c;
    }
  }
}

.aprobado-select {
  .custom-select-quotes__control {
    background-color: #d6ffe2 !important;
    border: 1px #d6ffe2 solid !important;
  }
  .custom-select-quotes__single-value {
    color: #009c41 !important;
  }

  .custom-select-quotes__indicator {
    svg {
      fill: #009c41;
    }
  }
}
.cancelado-select {
  .custom-select-quotes__control {
    background-color: #d6ddff !important;
    border: 1px #d6ddff solid !important;
  }
  .custom-select-quotes__single-value {
    color: #000a9c !important;
  }

  .custom-select-quotes__indicator {
    svg {
      fill: #000a9c;
    }
  }
}
.rechazado-select {
  .custom-select-quotes__control {
    background-color: #ffd6d6 !important;
    border: 1px #ffd6d6 solid !important;
  }
  .custom-select-quotes__single-value {
    color: #9c0000 !important;
  }

  .custom-select-quotes__indicator {
    svg {
      fill: #9c0000;
    }
  }
}
</style>
