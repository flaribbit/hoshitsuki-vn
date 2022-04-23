<template>
  <div class="character" :style="style"></div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
const { x = 450, y = 200, s = 1, name = '' } = defineProps<{
  x: number, y: number, s: number, name: string
}>();
const data = reactive({
  w: 0,
  h: 0,
})
const style = computed(() => {
  if (!name) return {};
  var url = 'characters/' + name;
  var img = new Image();
  img.onload = () => {
    data.w = img.width;
    data.h = img.height;
  }
  img.src = url;
  return {
    left: x + 'px',
    top: y + 'px',
    width: data.w + 'px',
    height: data.h + 'px',
    transform: `scale(${s})`,
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
