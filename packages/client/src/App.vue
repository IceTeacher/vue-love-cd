<script setup lang="ts">
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <Header />
  <RouterView></RouterView>
  <VueQueryDevtools />
  <Footer />
</template>

<style scoped></style>
