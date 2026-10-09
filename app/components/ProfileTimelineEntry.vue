<script setup lang="ts">
import type { TimelineEntry } from '~/types/timeline';

defineProps<{ entry: TimelineEntry }>();

function formatDate(value: string) {
  if (value.length === 4) return value;
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}
</script>

<template>
  <article class="grid gap-3 sm:grid-cols-[9rem_1fr] sm:gap-8">
    <div class="pt-1 text-sm">
      <p class="text-toned font-medium">
        <time :datetime="entry.start">{{ formatDate(entry.start) }}</time>
        <template v-if="entry.current"> – Present</template>
        <template v-else-if="entry.end">
          – <time :datetime="entry.end">{{ formatDate(entry.end) }}</time>
        </template>
      </p>
      <p class="text-muted mt-1">{{ entry.category }}</p>
    </div>

    <div class="border-default min-w-0 rounded-xl border p-5 sm:p-6">
      <div class="flex flex-wrap items-center gap-2">
        <h3 class="text-highlighted text-lg font-semibold">{{ entry.title }}</h3>
        <UBadge v-if="entry.current" label="Current" variant="subtle" size="sm" />
      </div>
      <p class="text-toned mt-1 text-sm font-medium">{{ entry.organization }}</p>
      <p class="text-muted mt-3 text-sm leading-relaxed">{{ entry.description }}</p>
      <NuxtLink
        v-if="entry.link"
        :to="entry.link?.to"
        :target="entry.link?.to.startsWith('https://') ? '_blank' : undefined"
        class="text-primary mt-4 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
      >
        {{ entry.link?.label }}
        <UIcon name="i-lucide-arrow-up-right" aria-hidden="true" />
      </NuxtLink>
      <div aria-label="Topics" class="mt-4 flex flex-wrap gap-2">
        <UBadge v-for="skill in entry.skills" :key="skill" :label="skill" color="neutral" variant="soft" size="sm" />
      </div>
    </div>
  </article>
</template>
