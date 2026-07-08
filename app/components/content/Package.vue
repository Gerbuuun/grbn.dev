<script lang="ts" setup>
interface NpmPackage {
  name: string;
  description: string;
  version: string;
  repository?: {
    url: string;
  };
  homepage?: string;
}

const props = defineProps<{
  name: string;
}>();

const { data } = useLazyFetch<NpmPackage>(`https://registry.npmjs.org/${props.name}/latest`);
const packageInfo = computed(() => data?.value);

const githubUrl = computed(() => {
  if (!packageInfo.value?.repository?.url) return null;
  // Convert git+https://github.com/user/repo.git to https://github.com/user/repo
  return packageInfo.value.repository.url.replace('git+', '').replace('.git', '').replace('git:', 'https:');
});
</script>

<template>
  <span v-if="packageInfo" class="relative inline-block">
    <UPopover mode="hover" :content="{ side: 'top' }">
      <span class="text-[var(--ui-primary)]">{{ packageInfo.name }}</span>
      <template #content>
        <div class="flex flex-row gap-2 p-2">
          <div class="flex max-w-fit flex-col gap-2">
            <div class="flex items-center gap-2">
              <UIcon name="i-simple-icons-npm" />
              <span>{{ packageInfo.name }} — {{ packageInfo.version }}</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ packageInfo.description }}</p>
          </div>
          <div class="flex gap-2">
            <UButton
              v-if="githubUrl"
              variant="ghost"
              color="neutral"
              :to="githubUrl"
              target="_blank"
              icon="i-simple-icons-github"
            />
            <UButton
              v-if="packageInfo.homepage"
              variant="ghost"
              color="neutral"
              :to="packageInfo.homepage"
              target="_blank"
              icon="i-lucide-globe"
            />
          </div>
        </div>
      </template>
    </UPopover>
  </span>
  <span v-else>{{ props.name }}</span>
</template>
