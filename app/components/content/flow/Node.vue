<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';

defineOptions({
  inheritAttrs: false,
});

const {
  data,
  sourcePosition = Position.Left,
  targetPosition = Position.Right,
} = defineProps<{
  data: {
    label: string;
    icon?: string;
    forward?: string[] | ((data: unknown) => string[]);
  };
  sourcePosition?: Position;
  targetPosition?: Position;
}>();
</script>

<template>
  <div class="flex flex-row items-center justify-center gap-2 border border-gray-200 dark:border-gray-800 rounded-md w-44 h-10">
    <Handle :position="sourcePosition" type="target" class="invisible translate-x-1/2" />
    <Handle :position="targetPosition" type="source" class="invisible -translate-x-1/2" />
    <UIcon v-if="data.icon" :name="data.icon" class="text-[var(--ui-primary)]" />
    <p class="!m-0">
      {{ data.label }}
    </p>
  </div>
</template>
