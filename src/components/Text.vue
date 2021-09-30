<template>
  <div class="dialog-name" v-if="name">{{ name }}</div>
  <div class="dialog-box">{{ displayText }}</div>
</template>
<script setup>
import { computed, watch, reactive } from "vue";
const TEXT_INTERVAL = 50;
const props = defineProps({
  name: { type: String, default: "" },
  text: { type: String, default: "" },
})
const displayText = computed(() => animation.text.substring(0, animation.i));
const animation = reactive({
  i: 0,
  text: "",
  timer: 0,
});
const step = () => {
  if (animation.timer) {
    animation.i = animation.text.length;
    return false;
  }
  return true;
}
watch(props, () => {
  animation.i = 0;
  animation.text = props.text;
  animation.timer = setInterval(() => {
    if (animation.i >= animation.text.length) {
      clearInterval(animation.timer);
      animation.timer = 0;
    }
    animation.i++;
  }, TEXT_INTERVAL);
});
defineExpose({ step });
</script>

<style>
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
