<script setup lang="ts">
const route = useRoute();

const { data: page } = await useAsyncData(route.path, () => queryCollection('blog').path(route.path).first());
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

const { data: surround } = await useAsyncData(
  `${route.path}-surround`,
  () => {
    return queryCollectionItemSurroundings('blog', route.path, { fields: ['title', 'description', 'navigation'] });
  },
  { default: () => [] },
);

const breadcrumbs = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Blog', to: '/blog' },
  { label: page.value?.title, to: route.path },
]);

const date = computed(() => (page.value ? new Date(page.value.date) : new Date()));
const pageMetadata = page.value as typeof page.value & {
  head?: Parameters<typeof useHead>[0];
  ogImage?: Parameters<typeof defineOgImage>[0];
};
const contentSeo = page.value.seo as Parameters<typeof useSeoMeta>[0] & {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
};

useHead({
  ...pageMetadata.head,
});

useSeoMeta({
  ...contentSeo,
  ogTitle: contentSeo.ogTitle ?? contentSeo.title ?? page.value.title,
  ogDescription: contentSeo.ogDescription ?? contentSeo.description ?? page.value.description,
  ogType: 'article',
  articleTag: page.value.tags,
  articlePublishedTime: date.value.toISOString(),
});

if (pageMetadata.ogImage) {
  defineOgImage(pageMetadata.ogImage);
} else {
  defineOgImage('Site.takumi', {
    title: page.value.title,
    description: page.value.description,
  });
}
</script>

<template>
  <UPage v-if="page">
    <UPageHeader
      :title="page.title"
      :description="page.description"
      :links="page.links"
      :ui="{ headline: 'flex flex-col gap-y-8 items-start' }"
    >
      <template #headline>
        <UBreadcrumb :items="breadcrumbs" :ui="{ root: 'w-full' }" />
        <span class="space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <time :datetime="date.toISOString()" class="text-[var(--ui-primary)]">{{
            date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
          }}</time>
          <span>·</span>
          <span class="italic">{{ page.readingTime }} minute read</span>
        </span>
      </template>
    </UPageHeader>

    <UPageBody>
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
