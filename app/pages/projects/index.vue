<script setup lang="ts">
const page = await useContentPage('/projects');
const { data: projects } = await useAsyncData('projects', () =>
  queryCollection('projects').order('current', 'DESC').order('start', 'DESC').all(),
);
usePageSeo(page);
</script>

<template>
  <UPage v-if="page">
    <UPageHeader :title="page.title" :description="page.description" />
    <UPageBody>
      <ContentRenderer v-if="page.body?.value.length" :value="page" />
      <UPageGrid v-if="projects?.length">
        <UPageCard
          v-for="project in projects"
          :key="project.path"
          :title="project.title"
          :description="project.description"
          :to="project.path"
        >
          <template #footer>
            <div class="flex flex-wrap gap-2">
              <UBadge v-for="skill in project.skills" :key="skill" :label="skill" color="neutral" variant="soft" />
            </div>
          </template>
        </UPageCard>
      </UPageGrid>
      <p v-else class="text-muted">{{ page.emptyMessage || 'No projects yet.' }}</p>
    </UPageBody>
  </UPage>
</template>
