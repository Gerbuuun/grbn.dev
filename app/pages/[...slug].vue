<script setup lang="ts">
definePageMeta({ key: (route) => route.path });
const route = useRoute();
const page = await useContentPage(route.path);
usePageSeo(page);
</script>

<template>
  <UPage v-if="page">
    <UPageHeader :title="page.title" :description="page.description" />
    <UPageBody>
      <ContentRenderer :value="page" />
    </UPageBody>
  </UPage>
</template>
