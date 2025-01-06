<script setup lang="ts">
import { TreeItem, TreeRoot } from 'radix-vue';

interface TreeItem {
  title: string;
  icon?: string;
  children?: TreeItem[];
}

defineProps<{
  title?: string;
  items: TreeItem[];
  defaultExpanded?: string[];
}>();
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-x-8">
    <div v-if="$slots.left" class="grow">
      <slot name="left" />
    </div>

    <TreeRoot
      v-slot="{ flattenItems }"
      class="list-none select-none w-full lg:w-56 rounded-lg p-2 text-sm font-medium border border-neutral-200 dark:border-neutral-800 min-w-1/4 mx-auto"
      :items="items"
      :get-key="(item) => item.title"
      :default-expanded="defaultExpanded"
    >
      <h2 v-if="title" class="font-semibold !text-base px-2 pt-1 !mt-0 !mb-2">
        {{ title }}
      </h2>
      <TreeItem
        v-for="item in flattenItems"
        v-slot="{ isExpanded }"
        :key="item._id"
        :style="{ 'padding-left': `${item.level - 0.5}rem` }"
        v-bind="item.bind"
        class="flex items-center py-0.5 px-2 my-0.5 rounded outline-none focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:ring-2 data-[selected]:bg-neutral-900 dark:data-[selected]:bg-neutral-900"
      >
        <template v-if="item.hasChildren">
          <UIcon v-if="!isExpanded" name="i-lucide-folder" class="size-4" />
          <UIcon v-else name="i-lucide-folder-open" class="size-4" />
        </template>

        <UIcon v-else :name="item.value.icon || 'i-lucide-file'" class="size-4" />

        <div class="pl-2">
          {{ item.value.title }}
        </div>
      </TreeItem>
    </TreeRoot>

    <div v-if="$slots.right" class="grow">
      <slot name="right" />
    </div>
  </div>
</template>
