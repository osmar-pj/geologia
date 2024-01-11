  <script setup>

  </script>

  <template>
      <section class="L-Home">
      <form action="" onSubmit="{handleSubmit}">
        <div class="login-container">
          <div class="login-c-header">
            <h1>Bienvenido</h1>
            <h4>Bienvenido, por favor ingrese sus datos</h4>
          </div>
          <div class="login-c-body">
            <div class="Login-imputs-item">
              <label>Usuario</label>
              <div class="imputs-i-input">
                <!-- <img src="imgs/i-f-user.svg" alt="" /> -->
                <input
                  type="username"
                  name="username"
                  placeholder="Ej. Name Carlos"
                  required=""
                  value=""
                  onChange=""
                />
              </div>
            </div>            
            <div class="Login-imputs-item">
              <label>Contraseña</label>
              <div class="imputs-i-input">
                <!-- <img src="imgs/i-f-pass.svg" alt="" /> -->
                <input
                  type="password"
                  name="password"
                  placeholder="Ej. Name Carlos"
                  required=""
                  value=""
                  onChange=""
                />
              </div>
            </div>
            
          </div>
          <div class="login-c-footer">
            <button class="btn-success" type="">Ingresar</button>
            <p>
              Al ingresar, acepta los Términos de servicio y la Política de
              privacidad.
            </p>
          </div>
        </div>
      </form>
    </section>
  </template>

  <style lang="scss">
  .Home {
    display: grid;
    place-items: center;
    .login-container {
      margin: 0 auto;
      background-color: var(--grey-light);
      max-width: 500px;
      width: 100%;
      padding: 1rem;
      border-radius: 1rem;
      .input-class {
        max-width: 300px;
        width: 100%;
        height: 25px;
        background-color: var(--grey-light);
        color: black;
        border-radius: 8px;
        padding: 12px 14px;
      }
    }
  }
  .L-Home {
    padding: 10vh 10vw;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: var(--grey-light-1);
    .login-container {
      max-width: 400px;
      width: 100%;
      display: flex;
      flex-direction: column;
      background-color: var(--white);
      border-radius: 15px;
      box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.09);
      .login-c-header {
        padding: 2.5rem 2.5rem 2rem 2.5rem;
        text-align: center;
        h4 {
          padding-top: 0.5rem;
          color: var(--grey-2);
          font-weight: normal;
        }
      }
      .login-c-body {
        padding: 0 2.5rem;
        background-color: var(--black-light-1);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .login-c-footer {
        padding: 2rem 2.5rem 2.5rem 2.5rem;
        background-color: var(--black-light-1);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        p {
          color: var(--grey-1);
          font-size: clamp(7px, 8vw, 12px);
        }
      }
    }
  }

  .Login-imputs-item {
    label {
      font-size: clamp(5px, 8vw, 10px);
      font-weight: 500;
      // @include md {
      //   font-size: clamp(6px, 8vw, 12px);
      // }
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

  .btn-success {
    background-color: var(--secondary);
    &:hover {
      background-color: var(--primary);
    }
  }
  </style>