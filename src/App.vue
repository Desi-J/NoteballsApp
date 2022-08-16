<template>
  <NavBar/>

  <div class="container is-max-desktop px-2 py-4">
    <RouterView/>
  </div>
</template>

<script setup>
/*
  imports
*/
import { onMounted } from 'vue';
import NavBar from '@/components/layout/NavBar.vue'
import { useStoreAuth } from '@/stores/storeAuth'
import { auth } from './js/firebase';

/*
  store
*/
const storeAuth = useStoreAuth()

/*
  mounted
*/
onMounted(() => {
  storeAuth.init()
})
</script>

<style>
@import "bulma/css/bulma.min.css";
</style>