export function useSiteContent() {
  return useAsyncData('site-content', () => queryCollection('site').first());
}
