<script setup lang="ts">
const items = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Blog', to: '/blog' },
];
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />

    <UHeader title="Gerben Mulder">
      <UNavigationMenu :items />

      <template #right>
        <UColorModeButton />
        <UButton icon="i-simple-icons-github" color="neutral" variant="ghost" to="https://github.com/gerbuuun" target="_blank" aria-label="GitHub" />
      </template>
    </UHeader>

    <UMain>
      <UContainer>
        <NuxtPage />
      </UContainer>
    </UMain>

    <UFooter>
      <template #left>
        Copyright © {{ new Date().getFullYear() }}
      </template>

      <UNavigationMenu :items variant="link" />

      <template #right>
        <UButton icon="i-simple-icons-github" color="neutral" variant="ghost" to="https://github.com/gerbuuun" target="_blank" aria-label="GitHub" />
        <UButton icon="i-simple-icons-bluesky" color="neutral" variant="ghost" to="https://bsky.app/profile/grbn.dev" target="_blank" aria-label="BlueSky" />
        <UButton icon="i-simple-icons-x" color="neutral" variant="ghost" to="https://x.com/gerbuuun" target="_blank" aria-label="X / Twitter" />
        <UButton icon="i-lucide-mail" color="neutral" variant="ghost" to="mailto:gerbuuun@pm.me" aria-label="Email" />
      </template>
    </UFooter>
  </UApp>
</template>
