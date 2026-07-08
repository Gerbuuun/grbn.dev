<script setup lang="ts">
import { TreeItem, TreeRoot } from 'reka-ui';

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
  <div class="flex flex-col gap-x-8 lg:flex-row">
    <div v-if="$slots.left" class="grow">
      <slot name="left" />
    </div>

    <TreeRoot
      v-slot="{ flattenItems }"
      class="mx-auto w-full min-w-1/4 list-none rounded-lg border border-neutral-200 p-2 text-sm font-medium select-none lg:w-56 dark:border-neutral-800"
      :items="items"
      :get-key="(item) => item.title"
      :default-expanded="defaultExpanded"
    >
      <h2 v-if="title" class="!mt-0 !mb-2 px-2 pt-1 !text-base font-semibold">
        {{ title }}
      </h2>
      <TreeItem
        v-for="item in flattenItems"
        v-slot="{ isExpanded }"
        :key="item._id"
        :style="{ 'padding-left': `${item.level - 0.5}rem` }"
        v-bind="item.bind"
        class="my-0.5 flex items-center rounded px-2 py-0.5 outline-none focus:ring-2 focus:ring-neutral-400 data-[selected]:bg-neutral-900 dark:focus:ring-neutral-500 dark:data-[selected]:bg-neutral-900"
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
