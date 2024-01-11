<script setup></script>

<template>
  <div className="dropdown-menu">
    <div className="dropdown-m-body">
      <div className="dropdown-m-b-avatar">A</div>
      <div className="dropdown-m-b-names">
        <span>Prueba</span>
        <h4>prueba_ejemplo@gunjop.com</h4>
      </div>
      <div className="dropdown-m-b-info">
        <div className="dropdown-m-b-item">
          <h5>DNI</h5>
          <h4>1726332344</h4>
        </div>
        <div className="dropdown-m-b-item">
          <h5>Teléfono</h5>
          <h4>9712832881</h4>
        </div>
      </div>
    </div>
    <div className="dropdown-m-footer">
      <span className="Logout" onClick="{handleLogout}"> Cerrar sesión </span>
    </div>
  </div>
</template>

<style lang="scss"></style>
