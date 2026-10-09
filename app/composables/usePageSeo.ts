import type { PageCollectionItemBase } from '@nuxt/content';

export function usePageSeo(page: Ref<PageCollectionItemBase | null | undefined>) {
  const title = computed(() => page.value?.seo?.title || page.value?.title);
  const description = computed(() => page.value?.seo?.description || page.value?.description);
  useSeoMeta({ title, description, ogTitle: title, ogDescription: description });
  defineOgImage('Site.takumi', { title: title.value, description: description.value });
}
