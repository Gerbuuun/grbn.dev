<script lang="ts" setup>
const description = 'Every now and then I write about things';

const { data: posts } = await useAsyncData('navigation', () => {
  return queryCollection('blog').select('title', 'description', 'date', 'tags', 'path').all();
});

useSeoMeta({
  title: 'Blog',
  description,
  ogTitle: 'Blog',
  ogDescription: description,
});

defineOgImage('Site.takumi', {
  title: 'Blog',
  description,
});
</script>

<template>
  <UPage>
    <UPageBody>
      <UPageGrid>
        <NuxtLink v-for="post in posts" :key="post.path" :to="post.path">
          <UPageCard v-bind="post" />
        </NuxtLink>
      </UPageGrid>
    </UPageBody>
  </UPage>
</template>
