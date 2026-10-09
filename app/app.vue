<script setup lang="ts">
const { data: site } = await useSiteContent();
const route = useRoute();
const items = computed(() =>
  (site.value?.navigation || []).map((item) => ({
    ...item,
    active: item.to.includes('#') ? route.fullPath === item.to : route.path === item.to && !route.hash,
  })),
);
const socialLinks = computed(() => site.value?.socialLinks || []);
const githubLink = computed(() => socialLinks.value.find((link) => link.label === 'GitHub'));
useSeoMeta({
  title: () => site.value?.name,
  description: () => site.value?.description,
  ogTitle: () => site.value?.name,
  ogDescription: () => site.value?.description,
});
useHead({
  titleTemplate: (title) =>
    title && title !== site.value?.name ? `${title} · ${site.value?.name}` : site.value?.name || '',
});
useSchemaOrg([definePerson({ name: site.value?.name, sameAs: socialLinks.value.map((link) => link.to) })]);
defineOgImage('Site.takumi', { title: site.value?.name, description: site.value?.description });
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />

    <UHeader :title="site?.name">
      <UNavigationMenu :items />

      <template #body>
        <UNavigationMenu :items orientation="vertical" />
      </template>

      <template #right>
        <UColorModeButton />
        <UButton
          v-if="githubLink"
          :icon="githubLink.icon"
          :to="githubLink.to"
          color="neutral"
          variant="ghost"
          target="_blank"
          :aria-label="githubLink.label"
        />
      </template>
    </UHeader>

    <UMain>
      <UContainer>
        <NuxtPage />
      </UContainer>
    </UMain>

    <UFooter>
      <template #left> Copyright © {{ new Date().getFullYear() }} </template>

      <UNavigationMenu :items variant="link" />

      <template #right>
        <UButton
          v-for="link in socialLinks"
          :key="link.label"
          :icon="link.icon"
          color="neutral"
          variant="ghost"
          :to="link.to"
          target="_blank"
          :aria-label="link.label"
        />
        <UButton
          icon="i-lucide-mail"
          color="neutral"
          variant="ghost"
          v-if="site?.email"
          :to="`mailto:${site.email}`"
          aria-label="Email"
        />
      </template>
    </UFooter>
  </UApp>
</template>

<style>
@import 'tailwindcss';
@import '@nuxt/ui';

@source '../content';

:root:not(.dark) {
  --ui-primary: var(--ui-color-primary-600);
}

@theme {
  --font-sans: 'Kanit', sans-serif;
}
</style>
