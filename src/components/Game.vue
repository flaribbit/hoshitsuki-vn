<template>
  <div class="game" :style="gameStyle" @click="index++; update();">
    <h1>game</h1>
    <div
      class="background"
      :style="`background: url(${background}) no-repeat center; background-size: cover;`"
    >{{ index }}, {{ commandlist[index] }}</div>
    <Character name="039_00.png" s="0.8" x="200" />
    <Character name="038_00.png" s="0.8" x="600" />
    <div class="dialog-name" v-if="name">{{ name }}</div>
    <div class="dialog-box">{{ text }}</div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watchEffect } from "vue";
import Character from "./Character.vue";
const name = ref("");
const text = ref("");
const background = ref("backgrounds/道02.png");
const index = ref(0);
const commandlist = ref([]);
const vars = reactive({});
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
function update() {
  console.log("update call", index.value);
  while (true) {
    var command = commandlist.value[index.value];
    if (!command) return;
    console.log(index.value, command);
    switch (command[0]) {
      case "text":
        var res = command[1].match(/(.+?): ?(.+)/);
        if (res) {
          name.value = res[1];
          text.value = res[2];
        } else {
          name.value = null;
          text.value = command[1];
        }
        return;
      case "scene"://TODO
        index.value++;
        continue;
      case "label":
        index.value++;
        continue;
      case "goto":
        if (command.length == 6) {
          let v1 = vars[command[3]];
          let v2 = command[5];
          let result;
          switch (command[4]) {
            case "<": result = v1 < v2; break;
            case ">": result = v1 > v2; break;
            case "<=": result = v1 <= v2; break;
            case ">=": result = v1 >= v2; break;
            case "==": result = v1 == v2; break;
            case "!=": result = v1 != v2; break;
          }
          if (command[2] == "unless") result = !result;
          if (result) {
            index.value = command[1];
          } else {
            index.value += 1;
          }
        } else {
          index.value = command[1];
        }
        continue;
      case "set":
        vars[command[1]] = command[2];
        index.value++;
        continue;
      case "add":
        vars[command[1]] += command[2];
        index.value++;
        continue;
      case "bgm":
        index.value++;
        continue;
      case "bg":
        index.value++;
        continue;
    }
  }
}
onMounted(() => {
  window.onresize = function () {
    windowSize.w = window.innerWidth;
    windowSize.h = window.innerHeight;
  };
  import("../assets/demogame.story").then(({ default: data }) => {
    commandlist.value = data;
    update();
  });
});
</script>

<style>
.game {
  position: absolute;
  overflow: hidden;
  width: 1280px;
  height: 720px;
  transform-origin: 0 0;
  font-size: 24px;
  --c-line: #f6bd60;
  --c-background: #f7ede2;
}
.background {
  position: absolute;
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
