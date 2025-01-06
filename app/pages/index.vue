<script setup lang="ts">
const { data: posts } = await useAsyncData('navigation', () => queryCollection('blog').select('title', 'description', 'date', 'tags', 'path').limit(3).all());
</script>

<template>
  <UPage>
    <UPageHeader title="Hi" description="Nothing much to see here yet. While I'm working on the site, you can check out my first blog post." />

    <UPageBody>
      <UPageSection title="Blog">
        <UPageGrid>
          <NuxtLink v-for="post in posts" :key="post.path" :to="post.path">
            <UPageCard v-bind="post" />
          </NuxtLink>
        </UPageGrid>
      </UPageSection>
    </UPageBody>
  </UPage>
</template>
