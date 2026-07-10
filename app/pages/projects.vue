<script lang="ts" setup>
const description = "Projects, experiments, and software work I'm currently working on or worked on in the past.";

useSeoMeta({
  title: 'Projects',
  description,
  ogTitle: 'Projects',
  ogDescription: description,
});

defineOgImage('Site.takumi', {
  title: 'Projects',
  description,
});
</script>

<template>
  <UPage>
    <UPageHeader title="Projects" description="🚧 Under construction 🚧" />
  </UPage>
</template>
