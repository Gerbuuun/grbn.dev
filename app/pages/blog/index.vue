<script lang="ts" setup>
const page = await useContentPage('/blog');
const { data: posts } = await useAsyncData('blog-posts', () =>
  queryCollection('blog').select('title', 'description', 'date', 'tags', 'path').order('date', 'DESC').all(),
);
usePageSeo(page);
</script>

<template>
  <UPage v-if="page">
    <UPageHeader :title="page.title" :description="page.description" />
    <UPageBody>
      <ContentRenderer v-if="page.body?.value.length" :value="page" />
      <UPageGrid v-if="posts?.length">
        <NuxtLink v-for="post in posts" :key="post.path" :to="post.path">
          <UPageCard v-bind="post" />
        </NuxtLink>
      </UPageGrid>
      <p v-else class="text-muted">{{ page.emptyMessage || 'No posts yet.' }}</p>
    </UPageBody>
  </UPage>
</template>
