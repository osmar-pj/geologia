<script setup>
import Nav from "../components/Nav.vue";
</script>

<template>
  <div class="content">
    <Nav />
    <main>
        <div class="c-main">
            <router-view></router-view>
        </div>
    </main>
</div>
</template>

<style></style>
