<script setup>
import Header from "../components/Header.vue";
import Nav from "../components/Nav.vue";
</script>

<template>
  <div class="content">
    <Nav />
    <main>
        <Header />
        <div class="c-main">
            <router-view></router-view>
        </div>
    </main>
</div>
</template>

<style></style>
