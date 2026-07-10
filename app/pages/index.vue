<script setup lang="ts">
const description = '';

const { data: posts } = await useAsyncData('navigation', () =>
  queryCollection('blog').select('title', 'description', 'date', 'tags', 'path').limit(3).all(),
);

useSeoMeta({
  title: 'Gerben Mulder',
  description,
  ogTitle: 'Gerben Mulder',
  ogDescription: description,
});

defineOgImage('Site.takumi', {
  title: 'Gerben Mulder',
  description,
});
</script>

<template>
  <UPage>
    <UPageHeader
      title="Hi"
      description="Nothing much to see here yet. While I'm working on the site, you can check out my first blog post."
    />

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
