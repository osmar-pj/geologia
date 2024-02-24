<script setup></script>

<template>
  <div class="c-global-header">
    <div class="global-h-title">
      <div class="g-h-t-primary">
        <h1>Configuración</h1>
        
      </div>
      <span>| Dia terminado en Mina </span>
       <p>Personaliza tu experiencia ajustando configuraciones específicas según tus preferencias y necesidades. Desde aquí, puedes controlar diversos aspectos de la aplicación para adaptarla a tu estilo de uso y maximizar tu comodidad y eficiencia</p>
    </div>
    <div class="global-h-button">
      
    </div>
  </div>
 
 
  <div class="c-global-c-content" v-show="!filtroAplicado">
    <div class="container-setting">
      <div class="setting-item">
        <h3>Valores punto</h3>
        <div class="setting-i-input">
          <label for="">AG</label>
          <input type="text" />
        </div>
        <div class="setting-i-input">
          <label for="">Plomo</label>
          <input type="text" />
        </div>
        <div class="setting-i-input">
          <label for="">Zinc</label>
          <input type="text" />
        </div>
        <div class="setting-i-input">
          <label for="">Zn</label>
          <input type="text" />
        </div>
      </div>
      <div class="setting-item">
        <h3>Unión de stock piles</h3>
        <div class="setting-i-input">
          <label for="">Tolerancia</label>
          <input type="text" />
        </div>
        <div class="setting-i-input">
          <label for="">All values</label>
          <input type="text" />
        </div>
        <div class="setting-i-input">
          <label for="">Similar ley</label>
          <input type="text" />
        </div>
        <div class="setting-i-input">
          <label for="">Different dominio</label>
          <input type="text" />
        </div>
        <div class="setting-i-input">
          <label for="">Different mining</label>
          <input type="text" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.container-setting {
  display: flex;
  gap: 1rem;
  width: 100%;
  .setting-item {
    display: flex;
    flex: 1 1 500px;
    flex-direction: column;
    gap: 1rem;
    h3 {
    }
    .setting-i-input {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      label {
        font-size: clamp(7.5px, 8vw, 13.5px);
        line-height: 1rem;
      }
    }
  }
}
</style>
