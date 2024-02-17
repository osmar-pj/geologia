<script setup></script>

<template>
  <div className="c-header">
    <div className="header-left">
      <button onClick="{handleOnClick}" className="header-l-menu">
        <div className="header-l-menu">
          <input
            hidden=""
            className="check-icon"
            id="check-icon"
            name="check-icon"
            type="checkbox"
          />
          <label className="burger" htmlFor="burger">
            <input type="checkbox" id="burger" />
            <span></span>
            <span></span>
            <span></span>
          </label>
        </div>
      </button>
      
    </div>

    <div className="header-right">
       <span> > Regresar al Dashboard</span> 
    </div>
  </div>
</template>

<style lang="scss">


.burger {
  position: relative;
  width: 20px;
  height: 15px;
  background: transparent;
  cursor: pointer;
  display: block;
}

.burger input {
  display: none;
}

.burger span {
  display: block;
  position: absolute;
  height: 2px;
  width: 100%;
  background: black;
  border-radius: 5px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: 0.25s ease-in-out;
}

.burger span:nth-of-type(1) {
  top: 0px;
  transform-origin: left center;
}

.burger span:nth-of-type(2) {
  top: 50%;
  transform: translateY(-50%);
  transform-origin: left center;
}

.burger span:nth-of-type(3) {
  top: 100%;
  transform-origin: left center;
  transform: translateY(-100%);
}

.burger input:checked ~ span:nth-of-type(1) {
  transform: rotate(45deg);
  top: 0px;
  left: 2px;
}

.burger input:checked ~ span:nth-of-type(2) {
  width: 0%;
  opacity: 0;
}

.burger input:checked ~ span:nth-of-type(3) {
  transform: rotate(-45deg);
  top: 15px;
  left: 2px;
}

.dropdown-menu {
  position: absolute;
  background-color: var(--white);
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  top: 160%;
  right: 0;
  min-width: 180px;
  padding: 1.5rem;
  z-index: 5;
  .dropdown-m-body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-bottom: 1rem;
    .dropdown-m-b-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background-color: #ff6a00;
      color: var(--white);
      font-size: clamp(5px, 8vw, 18px);
      font-weight: 500;
      //   @include md {
      //     width: 60px;
      //     height: 60px;
      //     font-size: clamp(7px, 8vw, 28px);
      //     line-height: 1rem;
      //   }
    }
    .dropdown-m-b-names {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      span {
        text-transform: capitalize;
        font-size: clamp(7px, 8vw, 20px);
        font-weight: 600;
      }
      h4 {
        color: var(--grey-1);
        font-weight: normal;
      }
    }
    .dropdown-m-b-info {
      display: none;
      gap: 1.5rem;
      .dropdown-m-b-item {
        h4 {
          font-weight: normal;
          padding-bottom: 0.1rem;
        }
        h5 {
          color: var(--grey-1);
        }
        &:nth-child(1) {
          border-right: 1px solid var(--grey-light-2);
          padding-right: 1.5rem;
        }
      }
      //   @include md {
      //     display: flex;
      //   }
    }
    // @include md {
    //   padding-bottom: 1.5rem;
    //   gap: 1rem;
    // }
  }
  .dropdown-m-footer {
    padding-top: 1rem;
    border-top: 1px solid var(--grey-light-2);
    span {
      cursor: pointer;
      font-size: clamp(7px, 8vw, 12px);
      &:hover {
        color: var(--secondary);
      }
      //   @include md {
      //     font-size: clamp(7px, 8vw, 14.5px);
      //   }
    }
    // @include md {
    //   padding-top: 1.5rem;
    // }
  }
  //   @include md {
  //     min-width: 250px;
  //     padding: 1.5rem 2.5rem;
  //   }
}
</style>
