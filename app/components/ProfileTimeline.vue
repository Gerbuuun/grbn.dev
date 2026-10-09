<script setup lang="ts">
import type { TimelineEntry } from '~/types/timeline';

defineProps<{
  entries: TimelineEntry[];
  heading: { title: string; eyebrow?: string; description?: string; link?: { label: string; to: string } };
}>();

const icons = {
  Education: 'i-lucide-graduation-cap',
  Certification: 'i-lucide-award',
  Writing: 'i-lucide-pen-line',
  Project: 'i-lucide-code-xml',
  Experience: 'i-lucide-briefcase-business',
};
</script>

<template>
  <section id="timeline" aria-labelledby="timeline-heading" class="scroll-mt-24 py-12 sm:py-16">
    <div class="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p v-if="heading.eyebrow" class="text-primary mb-2 text-sm font-medium">{{ heading.eyebrow }}</p>
        <h2 id="timeline-heading" class="text-highlighted text-3xl font-semibold tracking-tight">
          {{ heading.title }}
        </h2>
        <p v-if="heading.description" class="text-muted mt-3">{{ heading.description }}</p>
      </div>
      <UButton
        v-if="heading.link"
        v-bind="heading.link"
        target="_blank"
        color="neutral"
        variant="outline"
        trailing-icon="i-lucide-arrow-up-right"
      />
    </div>

    <ol class="relative">
      <li v-for="entry in entries" :key="entry.id" class="group relative pb-10 pl-14 last:pb-0 sm:pl-16">
        <div aria-hidden="true" class="border-default absolute top-10 bottom-0 left-5 border-l group-last:hidden" />
        <div
          aria-hidden="true"
          class="border-default bg-elevated text-primary absolute top-0 left-0 flex size-10 items-center justify-center rounded-full border"
        >
          <UIcon :name="icons[entry.category]" class="size-5" />
        </div>

        <ProfileTimelineEntry :entry />
      </li>
    </ol>
  </section>
</template>
