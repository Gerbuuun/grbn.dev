<script setup lang="ts">
definePageMeta({ key: (route) => route.path });
const route = useRoute();
const { data: project } = await useAsyncData(`project:${route.path}`, () =>
  queryCollection('projects').path(route.path).first(),
);
if (!project.value) throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true });
usePageSeo(project);
</script>

<template>
  <UPage v-if="project">
    <UPageHeader :title="project.title" :description="project.description" :links="project.links">
      <template #headline>
        <UBreadcrumb
          :items="[
            { label: 'Home', to: '/' },
            { label: 'Projects', to: '/projects' },
            { label: project.title, to: project.path },
          ]"
        />
      </template>
    </UPageHeader>
    <UPageBody>
      <ContentRenderer :value="project" />
    </UPageBody>
  </UPage>
</template>
