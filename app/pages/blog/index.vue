<script lang="ts" setup>
const { data: posts } = await useAsyncData('navigation', () => {
  return queryCollection('blog')
    .select('title', 'description', 'date', 'tags', 'path')
    .all();
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
