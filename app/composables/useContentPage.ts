export async function useContentPage(path: string) {
  const { data: page } = await useAsyncData(`content-page:${path}`, () => queryCollection('pages').path(path).first());
  if (!page.value) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
  }
  return page;
}
