<template>
  <div class="character" :style="style"></div>
</template>

<script setup>
import { reactive, computed } from "vue";
const props = defineProps({
  x: { type: Number, default: 450 },
  y: { type: Number, default: 200 },
  s: { type: Number, default: 1 },
  name: { type: String, default: null },
});
const data = reactive({
  w: 0,
  h: 0,
})
const style = computed(() => {
  if (!props.name) return {};
  var url = "characters/" + props.name;
  var img = new Image();
  img.onload = function () {
    data.w = this.width;
    data.h = this.height;
  };
  img.src = url;
  return {
    left: props.x + "px",
    top: props.y + "px",
    width: data.w + "px",
    height: data.h + "px",
    transform: `scale(${props.s})`,
    background: `url(${url})`,
  };
});
</script>

<style>
.character {
  position: absolute;
  transform-origin: 0 0;
}
</style>
