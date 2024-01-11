<script setup>
import Head from "../components/Head.vue";
import Nav from "../components/Nav.vue";
</script>

<template>
  <div class="content">
    <Nav />
    <main>
        <Head />
        <div class="c-main">
            <router-view></router-view>
        </div>
    </main>
</div>
</template>

<style></style>
