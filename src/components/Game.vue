<template>
  <div class="game">
    <h1>game</h1>
    <div class="background"></div>
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
  --c-line: #f6bd60;
  --c-background: #f7ede2;
}
.background {
  position: absolute;
  background: url(../assets/backgrounds/道02.png) no-repeat center;
  background-size: cover;
  image-rendering: pixelated;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.dialog-name {
  position: absolute;
  left: 100px;
  bottom: 180px;
  min-width: 100px;
  padding: 10px 20px;
  border: 4px solid var(--c-line);
  background: var(--c-background);
  border-radius: 10px;
}
.dialog-box {
  position: absolute;
  left: 100px;
  bottom: 20px;
  top: 540px;
  right: 100px;
  padding: 20px;
  border: 4px solid var(--c-line);
  background: var(--c-background);
  border-radius: 10px;
}
</style>
