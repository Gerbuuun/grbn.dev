<script lang="ts" setup>
interface GithubUser {
  id: string;
  username: string;
  name: string;
  twitter: string;
  avatar: string;
}

const props = defineProps<{
  username: string;
}>();

const { data } = useLazyFetch<{ user: GithubUser }>(`/api/ungh/users/${props.username}`);
const user = computed(() => data?.value?.user);
</script>

<template>
  <span v-if="user" class="inline-block relative">
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
            <UButton variant="ghost" color="neutral" :to="`https://github.com/${user.username}`" icon="i-simple-icons-github" />
            <UButton variant="ghost" color="neutral" :to="`https://x.com/${user.twitter}`" icon="i-simple-icons-x" />
          </div>
        </div>
      </template>
    </UPopover>
  </span>
  <span v-else>{{ props.username }}</span>
</template>
