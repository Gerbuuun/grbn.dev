<script setup lang="ts">
const route = useRoute();

const { data: page } = await useAsyncData(route.path, () => queryCollection('blog').path(route.path).first());
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('blog', route.path, { fields: ['title', 'description', 'navigation'] });
}, { default: () => [] });

const breadcrumbs = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Blog', to: '/blog' },
  { label: page.value?.title, to: route.path },
]);

const date = computed(() => page.value ? new Date(page.value.date) : new Date());
</script>

<template>
  <UPage v-if="page">
    <UPageHeader :title="page.title" :description="page.description" :ui="{ headline: 'flex flex-col gap-y-8 items-start' }">
      <template #headline>
        <UBreadcrumb :items="breadcrumbs" :ui="{ root: 'w-full' }" />
        <span class="space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <time :datetime="date.toISOString()" class="text-[var(--ui-primary)]">{{ date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</time>
          <span>·</span>
          <span class="italic">{{ page.readingTime }} minute read</span>
        </span>
      </template>
    </UPageHeader>

    <UPageBody class="text-justify">
      <ContentRenderer v-if="page.body" :value="page" />

      <USeparator />

      <UContentSurround :surround="surround as any" />
    </UPageBody>

    <template v-if="page.body?.toc?.links?.length" #right>
      <UContentToc :links="page.body.toc.links">
        <template #bottom>
          <USeparator v-if="page.references?.length || page.other?.length" />
          <UPageLinks v-if="page.references?.length" title="References" :links="page.references" />
          <USeparator v-if="page.references?.length && page.other?.length" />
          <UPageLinks v-if="page.other?.length" title="Other" :links="page.other" />
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
