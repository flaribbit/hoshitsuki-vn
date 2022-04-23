<template>
  <div class="game" :style="gameStyle" @click="onStep" @wheel="onWheel">
    <h1>game</h1>
    <div class="background" :style="backgroundStyle">
      <p>command: {{ index }}, {{ commandlist[index] }}</p>
      <p>variables: {{ vars }}</p>
    </div>
    <Actor v-for="actor in actors" :key="actor.name" :name="actor.name" :image="actor.image" :s="actor.s" :x="actor.x" />
    <Text ref="vText" />
    <Choice @goto="onChoice" :items="choices" />
  </div>
  <div class="fullscreen" @click="onFullscreen">FULLSCREEN</div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import Actor from "./Actor.vue";
import Choice from "./Choice.vue";
import Text from "./Text.vue";
const vText = ref();
const background = ref("");
const index = ref(0);
const commandlist = ref([]);
const choices = ref([]);
const actors = ref([]);
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
const backgroundStyle = computed(() => {
  if (background.value) {
    return `background: url(backgrounds/${background.value}) center / cover no-repeat`;
  } else {
    return "";
  }
});
const onFullscreen = () => {
  document.body.requestFullscreen();
  window.screen.orientation.lock("landscape");
}
const onStep = () => {
  //step to next command
  if (choices.value.length) return;
  if (vText.value.step()) {
    index.value++;
    update();
  }
}
const onWheel = (event: WheelEvent) => {
  if (event.deltaY > 0) onStep();
}
const onChoice = (goto: number) => {
  index.value = goto;
  choices.value = [];
  update();
}
const update = () => {
  console.log("update call", index.value);
  while (true) {
    var command = commandlist.value[index.value];
    if (!command) return;
    switch (command[0]) {
      case "text"://display text or dialogue
        vText.value.setText(command[1].n, command[1].t);
        return;
      case "scene"://TODO
        index.value++;
        continue;
      case "goto"://gotos
        if (command.length == 6) {
          let v1 = vars[command[3]];
          let v2 = command[5];
          let result: boolean;
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
      case "set"://set variable value
        vars[command[1]] = command[2];
        index.value++;
        continue;
      case "add"://add value to variable
        vars[command[1]] += command[2];
        index.value++;
        continue;
      case "bg"://change background
        background.value = command[1];
        index.value++;
        continue;
      case "bgm"://play background music
        index.value++;
        continue;
      case "choice"://display choices
        choices.value = command[1];
        return;
      case "actor"://add actors
        actors.value.length = 0;
        //calculate actor position
        for (var i = 0; i < command[1].length; i++) {
          actors.value.push({
            name: command[1][i],
            image: command[1][i] + "_00.png",
            s: 0.8,
            x: 1280 / command[1].length * (i + 0.5) - 240,
          });
        }
      default://ignore unknown commands
        index.value++;
        continue;
    }
  }
}
onMounted(() => {
  window.onresize = function () {
    //automatically update window size
    windowSize.w = window.innerWidth;
    windowSize.h = window.innerHeight;
  };
  //load game script
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

.fullscreen {
  position: absolute;
  color: red;
  top: 20px;
  right: 20px;
}
</style>
