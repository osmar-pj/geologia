<scrip setup></scrip>
<template>
  <div className="H-left-totals">
    <div className="Item-w-total">
      <div className="w-w-body">
        <div className="w-w-cont-icon"></div>
        <div className="w-w-cont-content">
          <div className="w-w-value">
            <h1>123,340</h1>
            <span>TMH</span>
          </div>
        </div>
      </div>
      <div className="w-w-calc">
        <div className="calc-item">
          <span className="t-porcent"> 123,340 </span>
        </div>
        <div className="calc-item">
          <span className="t-porcent"> 123,340 TMH </span>
        </div>
      </div>
    </div>
    <div className="Item-w-total">
      <div className="w-w-body">
        <div className="w-w-cont-icon"></div>
        <div className="w-w-cont-content">
          <div className="w-w-value">
            <h1>123,340</h1>
            <span>TMS</span>
          </div>
        </div>
      </div>
      <div className="w-w-calc">
        <div className="calc-item">
          <div className="t-icon"></div>
          <span className="t-porcent"> 123,340 TMS </span>
        </div>
        <div className="calc-item">
          <div className="t-icon"></div>
          <span className="t-porcent"> 123,340 TMS </span>
        </div>
      </div>
    </div>
    <div className="Item-w-total">
      <div className="w-w-body">
        <div className="w-w-cont-icon"></div>
        <div className="w-w-cont-content">
          <div className="w-w-value">
            <h1>123,340</h1>
            <span> viajes / 10 vag </span>
          </div>
        </div>
      </div>
      <div className="w-w-calc">
        <div className="calc-item">
          <div className="t-icon"></div>
          <span className="t-porcent"> 34 vag </span>
        </div>
        <div className="calc-item">
          <div className="t-icon"></div>
          <span className="t-porcent"> 23 vag </span>
        </div>
      </div>
    </div>
    <div className="Item-w-total">
      <div className="w-w-body">
        <div className="w-w-cont-icon"></div>
        <div className="w-w-cont-content">
          <div className="w-w-value">
            <h1>123,340</h1>
            <span>min/ciclo</span>
          </div>
        </div>
      </div>
      <div className="w-w-calc">
        <div className="calc-item">
          <span className="t-porcent t-min"> Min: 5 m/c </span>
        </div>
        <div className="calc-item">
          <div className="t-icon"></div>
          <span className="t-porcent t-max"> Max:20 m/c </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "../mixins.scss";
.H-left-totals {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  .Item-w-total {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.8rem;
    background-color: var(--grey-light-11);
    box-shadow: var(--bs);
    border-radius: var(--br-xl);
    padding: 1.5rem 1.5rem;
    position: relative;
    .w-w-brech {
      position: absolute;
      top: 12px;
      right: 15px;
      font-size: clamp(5px, 8vw, 12px);
      font-weight: 600;
      background: var(--secondary);
      color: var(--black);
      border-radius: var(--br-s);
      padding: 2px 8px;
    }
    .w-w-body {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      .w-w-cont-icon {
        display: grid;
        place-items: center;
        svg {
          width: 2.5rem;
          height: 2.5rem;
        }
        img {
          width: 2.5rem;
          height: 2.5rem;
        }
      }
      .w-w-cont-content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        .w-w-value {
          display: flex;
          align-items: flex-end;
          gap: 0.3rem;
          h1 {
            color: var(--black);
          }
          span {
            font-size: clamp(5px, 8vw, 14px);
            color: var(--grey);
          }
        }
      }
    }
    .w-w-calc {
      display: flex;
      align-items: center;
      gap: 1rem;
      .calc-item {
        display: flex;
        align-items: center;
        gap: 0.3rem;

        .t-icon {
          display: grid;
          place-items: center;
        }
        img {
          width: 1.3rem;
          height: 1.3rem;
        }
        span {
          font-size: clamp(5px, 8vw, 13px);
          color: var(--black);
          font-weight: 500;
        }
      }
    }
   
  }
}

.w-Wagon {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1rem 1rem;
  background-color: var(--background);
  .H-cont-top {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 1rem;

    .H-cont-left {
      flex-basis: 0;
      flex-grow: 999;
      min-width: 60%;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .H-left-details {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        .Item-d-cont {
          flex: 1 1 450px;
          background-color: var(--black-light-1);
          box-shadow: var(--bs);
          border-radius: var(--br-xl);
          padding: 1.5rem 2rem;
          display: grid;
          place-items: center;
          min-height: 200px;
          .I-c-body-day {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            gap: 1rem;

            .info-title {
              text-align: center;
              width: 100%;
              display: flex;
              justify-content: space-between;
              h3 {
                color: var(--grey);
                strong {
                  color: var(--black);
                }
              }
            }
            .info-body {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 1rem 1rem;
              flex-wrap: wrap;
              width: 100%;
              .circular-progress {
                flex: 0 1 180px;
                position: relative;
                height: 180px;
                width: 180px;
                border-radius: 50%;
                background: conic-gradient(
                  var(--primary)
                    calc((360deg / var(--max-value)) * var(--current-value)),
                  var(--black-light-2) 0deg
                );
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                &::before {
                  content: "";
                  position: absolute;
                  height: 130px;
                  width: 130px;
                  border-radius: 50%;
                  background-color: var(--black-light-1);
                }
                span {
                  color: var(--black);
                  font-size: clamp(5px, 8vw, 20px);
                  font-weight: bold;
                
                  padding-top: 15px;
                  &:nth-child(2) {
                    font-size: clamp(5px, 8vw, 14px);
                    color: var(--grey);
                    padding-top: 0;
                  }
                }
              }
              .info-text {
                flex: 0 0 180px;
                display: flex;
                flex-direction: column;
                gap: 1rem;
                border-radius: 10px;
                background-color: var(--grey-light);
                padding: 0.8rem;
                .info-text-best {
                  background: var(--secondary);
                  border-radius: var(--br-s);
                  font-weight: 600;
                  text-align: center;
                  padding: 4px 10px;
                  span {
                    font-size: clamp(5px, 8vw, 10px);
                    strong {
                      font-size: clamp(5px, 8vw, 15px);
                    }
                  }
                }
                .info-text-container {
                  display: flex;
                  flex-direction: column;
                  gap: 0.5rem;
                  .i-itemT {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    max-width: 200px;
                    width: 100%;
                    img {
                      width: 2rem;
                      height: 2rem;
                    }

                    .i-itemT-value {
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      text-align: center;
                      gap: 0.2rem;
                      h3 {
                        font-weight: 600;
                        font-size: clamp(5px, 8vw, 10px);
                        strong {
                          font-size: clamp(5px, 8vw, 15px);
                        }
                      }
                      span {
                        color: var(--grey);
                        font-size: clamp(5px, 8vw, 10px);
                        font-weight: 600;
                        line-height: 0.6rem;
                      }
                    }
                  }
                }
                @include md {
                  flex: 0 0 150px;
                }
              }
            }
          }
          .I-c-body-week {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: auto;
            gap: 1rem;
            max-width: 550px;
            width: 100%;
            .graf-week {
              width: 100%;
              display: flex;
              flex-direction: column;
              gap: 1rem;
              .g-w-num {
                h2 {
                  font-weight: bold;
                }
                .g-w-num-value {
                  display: flex;
                  align-items: flex-end;
                  gap: 0.3rem;
                  span {
                    color: var(--grey);
                    font-size: clamp(5px, 8vw, 16px);
                    font-weight: 500;
                  }
                }
                p {
                  color: var(--grey);
                  font-size: clamp(5px, 8vw, 12px);
                }
              }
              .g-w-graf {
                width: 100%;
                height: 200px;
              }
            }
            .info-week-prom {
              display: flex;
              flex-direction: column;
              gap: 1rem;
              .i-item-title {
                h3 {
                  color: var(--black);
                }
              }
              .i-item-body {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                .i-itemT {
                  display: flex;
                  align-items: center;
                  gap: 1rem;
                  img {
                    width: 2rem;
                    height: 2rem;
                  }
                  .i-itemT-value {
                    display: flex;
                    flex-direction: column;
                    gap: 0.1rem;
                    span {
                      color: var(--grey);
                      font-size: clamp(5px, 8vw, 10px);
                    }
                    h4 {
                      padding-top: 0.2rem;
                      font-size: clamp(5px, 8vw, 15px);
                      color: var(--black);
                      font-weight: 800;
                    }
                  }
                }
              }
            }
          }
          .I-c-body-bestweek {
            width: 100%;
            display: flex;
            align-items: center;
            flex-direction: column;
            gap: 1.5rem;
            .title-bestweek {
              text-align: center;
              span {
                color: var(--black);
                font-weight: bold;
                font-size: clamp(6px, 8vw, 10px);
                background-color: rgba(255, 255, 255, 0.486);
                border-radius: var(--br-s);
                padding: 2px 10px;
              }
              h3 {
                color: var(--black);
                font-weight: bold;
              }
            }
            .info-bestweek {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 0.5rem;
              .i-item-title {
                h3 {
                  color: var(--black);
                }
              }
              .i-itemT {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                flex: 0 1 130px;
                img {
                  width: 2rem;
                  height: 2rem;
                }
                .i-itemT-value {
                  display: flex;
                  flex-direction: column;
                  gap: 0.1rem;
                  text-align: center;
                  max-width: 200px;
                  width: 100%;
                  span {
                    color: var(--black);
                    font-size: clamp(5px, 8vw, 10px);
                  }
                  h4 {
                    padding-top: 0.2rem;
                    font-size: clamp(5px, 8vw, 16px);
                    color: var(--black);
                    font-weight: 800;
                  }
                }
                @include md {
                  flex: none;
                }
              }
              @include md {
                flex-direction: column;
              }
            }
          }

          .I-c-body-trucks {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            .trucks-item {
              flex: 1 1 350px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 1rem;
              .trucks-info {
                display: flex;
                flex-direction: column;
                gap: 0.3rem;
                h1 {
                  font-size: clamp(5px, 8vw, 18px);
                  line-height: 1.2rem;
                }
                .trucks-i-detall {
                  display: flex;

                  gap: 0.3rem;
                  svg {
                    height: 0.8rem;
                    width: 0.8rem;
                    fill: var(--black);
                  }
                  span {
                    font-weight: 600;
                    color: var(--grey);
                    font-size: clamp(5px, 8vw, 12px);
                  }
                }
              }
              .trucks-circle {
                position: relative;
                height: 75px;
                width: 75px;
                border-radius: 50%;
                background: conic-gradient(
                  var(--grey)
                    calc((360deg / var(--max-value)) * var(--current-value)),
                  var(--grey-light) 0deg
                );
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                &::before {
                  content: "";
                  position: absolute;
                  height: 60px;
                  width: 60px;
                  border-radius: 50%;
                  background-color: var(--black);
                 
                }
                &::after {
                  content: "";
                  position: absolute;
                  height: 70px;
                  width: 70px;
                  border-radius: 50%;
                  background-color: var(--black-light-1);
                 
                }
                span {
                  color: var(--grey-light);
                  font-size: clamp(5px, 8vw, 12px);
                  font-weight: normal;
                

                  strong {
                    font-weight: 500;
                    font-size: clamp(5px, 8vw, 13px);
                    color: var(--white);
                  }
                }
              }
            }
          }
        }
      }
      .H-cont-location {
        border-radius: var(--br-xl);
        padding: 1.5rem 2rem;
        background-color: var(--black-light-1);
        box-shadow: var(--bs);
        width: 100%;
        height: 300px;
        @include md {
          height: 200px;
        }
      }
    }
    .H-cont-right {
      flex-basis: 22rem;
      flex-grow: 1;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;

      .H-right-news {
        flex: 1 1 450px;
        background-color: var(--black-light-1);
        box-shadow: var(--bs);
        border-radius: var(--br-xl);
        height: 58vh;
        .Item-n-cont {
          padding: 1.5rem 2rem;
          height: 100%;
          display: grid;
          grid-template-rows: auto 1fr;
          .I-c-body {
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            padding-right: 0.8rem;
            overflow-x: auto;
            display: grid;
            gap: 1.5rem;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            padding-right: 0.8rem;
            .news-item {
              display: flex;
              gap: 0.5rem;
              position: relative;
              .nw-i-header {
                font-size: clamp(5px, 8vw, 12px);
                color: var(--grey);
                font-weight: 400;
                width: 20px;
                display: grid;
                place-items: center;

                &::before {
                  content: "";
                  width: 1px;
                  height: 100%;
                  background-color: var(--black-light-2);
                }
                &::after {
                  content: "";
                  width: 1px;
                  height: 100%;
                  background-color: var(--black-light-2);
                }
              }
              .nw-i-body {
                display: flex;
                flex-direction: column;
                gap: 0.3rem;
                width: 100%;
                padding: 0.8rem 0;
                .nw-i-b-name {
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  span {
                    font-weight: 500;
                    color: var(--grey);
                    font-size: clamp(5px, 8vw, 12px);
                  }
                  .nw-i-b-i-ubication {
                    background-color: #fff1da;
                    border-radius: 6px;
                    padding: 5px 8px;
                    display: flex;
                    align-items: center;
                    gap: 0.2rem;
                    svg {
                      height: 0.8rem;
                      width: 0.8rem;
                      fill: #ca881d;
                    }
                    .nw-i-ubication-text {
                      font-weight: 400;
                      font-size: clamp(5px, 8vw, 11px);
                      color: #ca881d;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      max-width: 120px;
                    }
                  }
                }
                .nw-i-b-info {
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  gap: 1rem;
                  h4 {
                    font-weight: 500;
                    color: var(--black);
                  }

                  .nw-i-b-i-info {
                    display: flex;
                    justify-content: space-between;
                    gap: 0.5rem;
                    width: 100%;
                    border-bottom: 2px solid var(--black-light-2);
                    padding-bottom: 0.3rem;
                    span {
                      font-weight: 600;
                      font-size: clamp(5px, 8vw, 13px);
                      color: var(--grey);
                      strong {
                        color: var(--black);
                      }
                    }
                  }
                  .nw-i-b-n-name {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    justify-content: center;
                    height: 50px;
                    width: 50px;
                    background-color: var(--grey-light);
                    border-radius: 8px;
                    padding: 1rem;
                    span {
                      font-weight: 600;
                      line-height: 1rem;
                      &:nth-child(1) {
                        font-size: clamp(5px, 8vw, 10px);
                        line-height: 1rem;
                      }
                      &:nth-child(2) {
                        font-size: clamp(5px, 8vw, 16px);
                      }
                    }
                  }

                  h4 {
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    -webkit-line-clamp: 2;
                    /* Puedes agregar estilos adicionales según sea necesario */
                    text-overflow: ellipsis;
                    white-space: normal;
                  }
                  .nw-i-b-i-items {
                    min-width: 70px;
                    display: flex;
                    gap: 0.5rem;
                    text-align: right;
                    justify-content: flex-end;
                    span {
                      font-weight: 500;
                      color: var(--black);
                      font-size: clamp(5px, 8vw, 10px);
                      strong {
                        font-size: clamp(5px, 8vw, 13px);
                        font-weight: 500;
                      }
                    }
                  }
                }
                .nw-i-b-ubication {
                  background-color: #fff1da;
                  border-radius: 6px;
                  padding: 5px 8px;
                  display: flex;
                  align-items: center;
                  gap: 0.2rem;
                  margin-top: 0.5rem;
                  svg {
                    height: 0.8rem;
                    width: 0.8rem;
                    fill: #ca881d;
                  }
                  span {
                    font-weight: 400;
                    font-size: clamp(5px, 8vw, 11px);
                    color: #ca881d;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 250px;
                  }
                }
              }
              &:not(:last-child):after {
                content: "";
                position: absolute;
                right: 0;
                bottom: -15px;
                width: 95%;
                height: 1px;
                background-color: #ccc;
              }
            }
          }
        }
      }
      .H-right-events {
        flex: 1 1 450px;
        background-color: var(--black-light-1);
        box-shadow: var(--bs);
        border-radius: var(--br-xl);
        height: 35vh;
        .Item-g-cont {
          padding: 1.5rem 2rem;
          height: 100%;
          display: grid;
          grid-template-rows: auto 1fr;
          .I-c-body {
            overflow-x: auto;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
            padding-right: 0.8rem;
            &::-webkit-scrollbar-track {
              background: var(--white);
            }
            .events-item {
              display: flex;
              flex-direction: column;
              gap: 0.8rem;
              border: 1px solid var(--black-light-2);
              border-radius: var(--br-s);
              padding: 1rem 1.2rem;
              color: var(--black);
              border-right: 8px solid #f35959;
              .ev-i-header {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                span {
                  font-weight: 400;
                  color: var(--grey);
                  font-size: clamp(5px, 8vw, 12px);
                  &:nth-child(2) {
                    background-color: #ffe3e3;
                    border-radius: 6px;
                    padding: 5px 8px;
                    font-size: clamp(5px, 8vw, 11px);
                    font-weight: 400;
                    color: #8e0909;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 150px;
                  }
                }
              }

              .ev-i-navbar {
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
                width: 100%;
                background-color: var(--grey-light);
                border-radius: 8px;
                padding: 0.5rem 1rem;
                span {
                  font-weight: 600;
                  line-height: 1rem;
                  font-size: clamp(5px, 8vw, 16px);
                  text-transform: uppercase;
                }
              }
              .ev-i-body {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                padding-left: 20px;
                .item-error {
                  position: relative;
                  h4 {
                    font-weight: 500;
                    text-transform: lowercase;
                    &::first-letter {
                      text-transform: uppercase;
                    }
                  }
                  h6 {
                    color: var(--grey);
                  }
                  &::before {
                    content: "";
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    position: absolute;
                    top: 4px;
                    left: -15px;
                    background-color: var(--grey);
                  }
                  &::after {
                    content: "";
                    width: 1px;
                    height: 100%;
                    border-radius: 50%;
                    position: absolute;
                    top: 4px;
                    left: -13px;

                    background-image: repeating-linear-gradient(
                      to bottom,
                      var(--grey),
                      var(--grey) 2px,
                      transparent 2px,
                      transparent 4px
                    );
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .H-cont-bottom {
    border-radius: var(--br-xl);
    padding: 1.5rem 2rem;
    background-color: var(--black-light-1);
    box-shadow: var(--bs);
    width: 100%;
    min-height: 500px;

    @include md {
      min-height: 200px;
    }
  }
  @include md {
    padding: 1.5rem 2rem;
  }
}

.I-c-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  width: 100%;
  .c-header-name {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    h5 {
      color: var(--grey);
      font-size: clamp(5px, 8vw, 12px);
      strong {
        color: var(--black);
        font-size: clamp(5px, 8vw, 16px);
      }
    }
    .c-h-n-lenght {
      background-color: var(--grey-light);
      color: var(--grey) !important;
      font-size: clamp(5px, 8vw, 13px);
      padding: 3px 5px;
      border-radius: 5px;
      font-weight: 600;
    }
  }
  svg {
    fill: var(--grey);
  }
}

@keyframes Aumentar {
  0% {
    width: 0%;
  }
  100% {
    width: var(--w);
  }
}

.recharts-layer {
  font-size: clamp(5px, 8vw, 11px);
  color: var(--grey);
  font-weight: 500;
}

.custom-tooltip {
  background-color: #1e1d2a;
  padding: 12px 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  .custom-t-item {
    display: flex;
    align-items: flex-end;
    gap: 0.2rem;
    p {
      font-size: clamp(5px, 8vw, 11px);
      line-height: 1rem;
      color: var(--black-light-2);
    }
    span {
      font-size: clamp(5px, 8vw, 10px);
      color: var(--white);
      line-height: 0.5rem;

      strong {
        font-size: clamp(5px, 8vw, 14px);
        line-height: 1.1rem;
      }
    }
    &:nth-child(1) {
      span {
        color: #f3bd5a;
      }
    }
    &:nth-child(2) {
      span {
        color: #3a80fa;
      }
    }
  }
}

.circular-graf {
  height: 180px;
  width: 270px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    position: absolute;
 
    width: 5.3rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.gauge {
  width: 100%;
  max-width: 200px;
  font-family: "Roboto", sans-serif;
  font-size: 32px;
  color: #004033;
}

.gauge__body {
  width: 100%;
  height: 0;
  padding-bottom: 50%;
  background: #dedee1;
  position: relative;
  border-top-left-radius: 100% 200%;
  border-top-right-radius: 100% 200%;
  overflow: hidden;
}

.gauge__fill {
  position: absolute;
  top: 100%;
  left: 0;
  width: inherit;
  height: 100%;
  transform-origin: center top;
  transform: rotate(0turn);
  transition: transform 0.2s ease-out;
}

.gauge-day {
  background: rgb(247, 188, 27);
}

.gauge-evening {
  background: var(--primary);
}

.gauge__cover {
  width: 75%;
  height: 150%;
  background: #ffffff;
  border-radius: 50%;
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);

  /* Text */
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 25%;
  box-sizing: border-box;
}

.title {
  h1 {
    font-size: clamp(10px, 8vw, 32px);
    font-weight: bold;
    line-height: 2rem;
  }
  h3 {
    padding-top: 0.5rem;
    color: var(--grey);
  }
}

.td-location {
  svg {
    height: 0.9rem;
    width: 0.9rem;
    fill: #e93b5a;
  }
  span {
    font-weight: 600;
    color: #e93b5a;
    font-size: clamp(5px, 8vw, 14px);
    text-transform: uppercase;
  }
}

.td-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  svg {
    height: 0.9rem;
    width: 0.9rem;
    fill: var(--black);
  }

  span {
    font-weight: 600;
    color: var(--black);
    font-size: clamp(5px, 8vw, 14px);
  }
}

.chart-b {
  overflow: hidden;
  width: 100%;
  height: auto;
  position: relative;
  border-radius: 4px;

  .bar-leyend {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.4rem;
    .b-l-text {
      font-size: clamp(6px, 8vw, 12px);
      font-weight: 200;
      position: relative;
      --background: 0;
      &::before {
        position: absolute;
        content: "";
        width: 2px;
        height: 100%;
        top: 100%;
      }
      &:nth-child(1) {
        &::before {
          left: 0;
          background-color: var(--background);
        }
      }
      &:nth-child(2) {
        &::before {
          right: 0;
          background-color: var(--background);
        }
      }
    }
  }

  .bar-container {
    display: flex;
    width: 100%;
    height: 15px;
    .bar {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: clamp(6px, 8vw, 12px);
      font-weight: 200;
      height: 100%;
    }
  }
}

.container_table {
  width: 100%;
  background-color: white;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: 30px;
  gap: 0.5rem 0.5rem;
}

.container_table_Loc {
  width: 100%;
  background-color: white;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 30px;
  gap: 0.5rem 0.5rem;
}

.table_header {
  font-size: clamp(6px, 8vw, 13px);
  line-height: 1.1rem;
  color: var(--grey);
}

.t-min,
.t-max {
  border-radius: 8px;
  padding: 3px 6px;
  font-weight: 500;
}

.t-max {
  background-color: #ffd3d3;
  color: #9e0d08 !important;
}

.t-min {
  background-color: #d3ffe2;
  color: #089e36 !important;
}

.I-c-header-day {
  h3 {
    color: var(--grey);
    strong {
      color: var(--black);
    }
  }
  &:nth-child(2) {
    padding-bottom: 1rem;
  }
}

.Container-table {
  border-radius: 10px;
  border: 1px solid #ccc;
  &::-webkit-scrollbar-track {
    background: var(--white);
  }

  table {
    width: 100%;
    color: var(--black);
    font-size: clamp(5px, 8vw, 14px);
    line-height: 0.7rem;
    font-weight: normal;
    border-collapse: separate !important;
    border-spacing: 0;
    white-space: nowrap;
    // background-color: var(--white);
  }

  thead {
    background: var(--primary);
    color: var(--white);
    font-size: clamp(6px, 8vw, 13px);
    position: sticky;
    top: 0;
   
    margin-bottom: 10px;
  }

  tbody {
   
  }
  th {
    font-weight: 300;
    padding: 20px 10px;
  }

  td {
    text-align: center;
    padding: 13.4px 10px;
  }
  table > tbody > tr > td {
    border-top: 1px solid #ddd;
  }
}

.Container-table2 {
  width: 100%;
  overflow: auto;
  height: 100%;

  table {
    width: 100%;
    color: var(--black);
    font-size: clamp(5px, 8vw, 14px);
    line-height: 0.7rem;
    font-weight: normal;
    border-collapse: separate !important;
    border-spacing: 0;
    white-space: nowrap;
  }

  thead {
    font-size: clamp(6px, 8vw, 12px);
    position: sticky;
    top: 0;
 
    color: var(--grey);
    background-color: var(--white);
  }
  tbody {
  
    font-weight: 600;
  }
  th {
    padding: 0.8rem 0.5rem;
    font-weight: 600;
  }

  td {
    text-align: center;
    padding: 12px 10px;
  }
  table > tbody > tr > td {
    border-top: 1px solid #ddd;
  }
  th:nth-child(1),
  td:nth-child(1) {
    width: 40px;
  }
  th:nth-child(2),
  td:nth-child(2) {
    width: 120px;
  }
  .v-min {
    width: 120px;
  }
}

.td-name {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 0.15rem;
  h4 {
    text-transform: capitalize;
    font-weight: bold;
    font-size: clamp(6px, 8vw, 12px);
    @include md {
      font-size: clamp(6px, 8vw, 14px);
    }
  }
  h5 {
    font-size: clamp(6px, 8vw, 10px) !important;
    font-weight: 600;
    strong {
      font-size: clamp(5px, 8vw, 13.5px);
    }

    @include md {
      font-size: clamp(6px, 8vw, 13px);
    }
  }
}

.btn-more {
  padding: 2px 10px;
  font-size: clamp(5px, 8vw, 12px);
  border-radius: 8px;
  border: 1px solid var(--black-light-2);
  color: var(--black);
  font-weight: 600;
  height: 30px;
  &:hover {
    background-color: var(--grey-light);
  }
}
.null {
  color: var(--black);
  text-align: center;
  font-weight: 500;
}

.chartContainer {
  flex: 1 1 500px !important;
}

.best-week {
  position: relative;
  background: var(--secondary) !important;
  flex: 1 1 180px !important;
  display: grid;
  place-items: center;
  padding: 1rem !important;

  .icono-best {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: var(--black);
    border: 5px solid var(--background);
    color: var(--white);
    
    display: grid;
    place-items: center;
    svg {
      fill: #f8e839;
      width: 1rem;
      height: 1rem;
    }
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    z-index: 2;
  }

  &::before {
    top: 0px;
    right: 40px;
    background-color: transparent;
    box-shadow: 8px -8px 0 var(--background);
  }

  &::after {
    top: 40px;
    right: 0px;
    background-color: transparent;
    box-shadow: 8px -8px 0 var(--background);
  }
  @include md {
    flex: 0 1 180px !important;
  }
}

.recharts-wrapper {
  max-width: 500px !important;
  width: 100% !important;
}

.cont-filter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  .select-title {
    font-weight: 600;
  }
  .select-items {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }
}

@keyframes fillAnimation {
  0% {
    transform: rotate(-45deg);
  }
  50% {
    transform: rotate(135deg);
  }
}

@keyframes fillGraphAnimation {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
}

.recharts-responsive-container {
  display: grid;
  place-items: center;
}

.vehicles {
  height: 440px !important;
}


</style>
