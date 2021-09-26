<template>
  <div class="choice">
    <div class="item" v-for="item in items" @click="emit('goto', item.goto)">{{ item.text }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const emit = defineEmits(["goto"]);
const items = ref([
  { text: "选项1", goto: 0 },
  { text: "选项2", goto: 0 },
  { text: "选项3", goto: 0 },
  { text: "选项4", goto: 0 },
]);
</script>

<style>
.choice {
  position: absolute;
  left: 320px;
  right: 320px;
  top: 160px;
}
.choice .item {
  border: 4px solid var(--c-line);
  background: var(--c-background);
  border-radius: 10px;
  margin-bottom: 1em;
  padding: 0.5em;
  text-align: center;
}
</style>
