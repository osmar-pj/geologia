<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
const router = useRouter()
const store = useStore()
const code = ref('')
const login = async () => {
  try {
    await store.dispatch('auth_login', code.value)
    router.push('/')
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <section class="L-Home">
    <form action="" onSubmit="{handleSubmit}">
      <div class="login-container">
        <div class="login-c-header">
          <h1>Bienvenido de nuevo</h1>
          <h4>Bienvenido, por favor ingrese sus datos</h4>
        </div>
        <div class="login-c-body">                      
          <div class="Login-imputs-item">
            <label>Código de acceso</label>
            <div class="imputs-i-input">
              <!-- <img src="imgs/i-f-pass.svg" alt="" /> -->
              <input
                type="password"
                name="password"
                placeholder="Ingrese contraseña"
                required=""
                value=""
                onChange=""
                v-model="code"
                maxlength="8"
              />
            </div>
          </div>          
        </div>
        <div class="login-c-footer">
          <button class="btn-success" type=""  @click.prevent="login">Continuar</button>
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

.L-Home {
  padding: 10vh 10vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .login-container {
    max-width: 400px;
    width: 100%;
    display: flex;
    flex-direction: column;
    .login-c-header {
      padding: 2.5rem 2.5rem 2rem 2.5rem;
      text-align: center;
      h1{
        letter-spacing: -0.03em;
      }
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
        text-align: center;
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