<script lang="ts" setup>
interface GithubUser {
  id: number;
  username: string;
  name: string;
  twitter: string | null;
  avatar: string;
}

const props = defineProps<{
  username: string;
}>();

const { data } = await useFetch<{ user: GithubUser }>(
  () => `https://ungh.cc/users/${encodeURIComponent(props.username)}`,
  {
    key: `ungh-user-${props.username}`,
  },
);
const user = computed(() => data?.value?.user);
</script>

<template>
  <span v-if="user" class="relative inline-block">
    <UPopover mode="hover" :content="{ side: 'top' }">
      <span class="text-[var(--ui-primary)]">{{ user.name }}</span>
      <template #content>
        <div class="flex flex-row gap-2 p-2">
          <UUser
            size="xl"
            :name="user.name"
            :description="user.username"
            :avatar="{
              src: user.avatar,
              icon: 'i-lucide-image',
            }"
          />
          <div class="flex flex-row gap-2">
            <UButton
              variant="ghost"
              color="neutral"
              :to="`https://github.com/${user.username}`"
              icon="i-simple-icons-github"
            />
            <UButton
              v-if="user.twitter"
              variant="ghost"
              color="neutral"
              :to="`https://x.com/${user.twitter}`"
              icon="i-simple-icons-x"
            />
          </div>
        </div>
      </template>
    </UPopover>
  </span>
  <span v-else>{{ props.username }}</span>
</template>
