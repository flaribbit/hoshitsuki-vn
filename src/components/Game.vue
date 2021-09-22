<template>
  <div class="game">
    <h1>game</h1>
    <div class="dialog-name">{{ name }}</div>
    <div class="dialog-box">{{ text }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const name = ref("");
const text = ref("");
import("../assets/demogame.story").then(({ default: data }) => {
  console.log(data);
  name.value = "name";
  text.value = data[0][1];
});
</script>

<style>
.game {
  position: absolute;
  width: 1280px;
  height: 720px;
  border: 1px solid;
  font-size: 24px;
}
.dialog-name {
  position: absolute;
  left: 100px;
  bottom: 180px;
  min-width: 100px;
  padding: 20px;
  border: 4px solid;
  border-radius: 10px;
}
.dialog-box {
  position: absolute;
  left: 100px;
  bottom: 20px;
  top: 540px;
  right: 100px;
  padding: 20px;
  border: 4px solid;
  border-radius: 10px;
}
</style>
