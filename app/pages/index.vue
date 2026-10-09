<script setup lang="ts">
import type { TimelineEntry } from '~/types/timeline';

const page = await useContentPage('/');
const { data: site } = await useSiteContent();
const { data: posts } = await useAsyncData('latest-posts', () =>
  queryCollection('blog').select('title', 'description', 'date', 'tags', 'path').order('date', 'DESC').limit(3).all(),
);
const { data: timeline } = await useAsyncData('profile-timeline', async () => {
  const [experience, projects, writing] = await Promise.all([
    queryCollection('experience').all(),
    queryCollection('projects')
      .where('timeline', '=', true)
      .select('id', 'title', 'description', 'organization', 'start', 'end', 'current', 'skills', 'path')
      .all(),
    queryCollection('blog')
      .where('timeline', '=', true)
      .select('id', 'title', 'description', 'date', 'tags', 'path')
      .all(),
  ]);
  const entries: TimelineEntry[] = [
    ...experience.map((entry) => ({
      ...entry,
      category: entry.category || ('Experience' as const),
      skills: entry.skills || [],
    })),
    ...projects.map((project) => ({
      ...project,
      organization: project.organization || '',
      skills: project.skills || [],
      category: 'Project' as const,
      link: { label: 'View project', to: project.path },
    })),
    ...writing.map((post) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      category: 'Writing' as const,
      organization: 'grbn.dev',
      start: new Date(post.date).toISOString().slice(0, 10),
      skills: post.tags || [],
      link: { label: 'Read the post', to: post.path },
    })),
  ];
  return entries.sort((a, b) => Number(!!b.current) - Number(!!a.current) || b.start.localeCompare(a.start));
});

useHead({ titleTemplate: '%s' });
usePageSeo(page);
</script>

<template>
  <UPage v-if="page">
    <UPageHeader :title="page.title" :description="page.description">
      <template v-if="site?.location" #headline>
        <span class="text-muted flex items-center gap-1.5 text-sm">
          <UIcon name="i-lucide-map-pin" aria-hidden="true" />
          {{ site.location }}
        </span>
      </template>
      <template #links>
        <UButton
          v-for="link in site?.socialLinks"
          :key="link.to"
          v-bind="link"
          target="_blank"
          color="neutral"
          variant="outline"
        />
      </template>
    </UPageHeader>
    <UPageBody>
      <ContentRenderer v-if="page.body?.value.length" :value="page" />
      <ProfileTimeline v-if="page.timeline && timeline?.length" :entries="timeline" :heading="page.timeline" />
      <template v-if="posts?.length">
        <USeparator />
        <UPageSection :title="page.latestPostsTitle || 'Blog'">
          <UPageGrid>
            <UPageCard
              v-for="post in posts"
              :key="post.path"
              :title="post.title"
              :description="post.description"
              :to="post.path"
            />
          </UPageGrid>
        </UPageSection>
      </template>
    </UPageBody>
  </UPage>
</template>
