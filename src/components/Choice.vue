<template>
  <div class="choice">
    <div class="item" v-for="item in items" @click.stop="emit('goto', item.goto)">{{ item.text }}</div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (event: 'goto', goto: number): void
}>();
const { items = [] } = defineProps<{
  items: { goto: number, text: string }[]
}>();
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
  cursor: pointer;
}
</style>
