<script setup lang="ts">
import {ref, provide} from 'vue';
const deckCollection = ref([{"deck_name": "Deck 1", "deck_content": []}]);
if (localStorage.getItem('deckCollection') !== null) {
    deckCollection.value = JSON.parse(localStorage.getItem('deckCollection')!);
}
provide('deckCollection', deckCollection.value);

</script>

<template>
  <div id="header">
    <h2>eLibrary</h2>
  </div>
  <router-view></router-view>
</template>

<style>
</style>
