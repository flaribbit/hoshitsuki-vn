<template>
  <div class="game" :style="gameStyle">
    <h1>game</h1>
    <div class="background"></div>
    <div class="dialog-name">{{ name }}</div>
    <div class="dialog-box">{{ text }}</div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
const name = ref("");
const text = ref("");
const windowSize = reactive({ w: window.innerWidth, h: window.innerHeight });
const gameStyle = computed(() => {
  var ratio = windowSize.w / windowSize.h;
  if (ratio > 16 / 9) {
    var scale = windowSize.h / 720;
    return `transform: translate(${(windowSize.w - 1280 * scale) / 2}px, 0) scale(${scale})`;
  } else {
    var scale = windowSize.w / 1280;
    return `transform: translate(0, ${(windowSize.h - 720 * scale) / 2}px) scale(${scale})`;
  }
});
onMounted(() => {
  window.onresize = function () {
    windowSize.w = window.innerWidth;
    windowSize.h = window.innerHeight;
  };
});
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
  transform-origin: top left;
  font-size: 24px;
  --c-line: #f6bd60;
  --c-background: #f7ede2;
}
.background {
  position: absolute;
  background: url(backgrounds/道02.png) no-repeat center;
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
