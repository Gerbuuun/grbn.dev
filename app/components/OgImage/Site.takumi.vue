<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
}>();
</script>

<template>
  <div class="og-image">
    <div class="accent" />
    <div class="content">
      <p class="eyebrow">grbn.dev</p>
      <h1>{{ title || 'Gerben Mulder' }}</h1>
      <p v-if="description" class="description">{{ description }}</p>
      <div class="footer">
        <span>Nuxt</span>
        <span>Cloudflare</span>
        <span>TypeScript</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.og-image {
  display: flex;
  position: relative;
  width: 1200px;
  height: 630px;
  overflow: hidden;
  background: #f8fafc;
  color: #0f172a;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}

.accent {
  position: absolute;
  inset: 0 auto 0 0;
  width: 28px;
  background: #2563eb;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 80px 96px 76px 120px;
}

.eyebrow {
  margin: 0 0 32px;
  color: #2563eb;
  font-size: 34px;
  font-weight: 700;
  line-height: 1;
}

h1 {
  max-width: 940px;
  margin: 0;
  font-size: 82px;
  font-weight: 800;
  line-height: 1.04;
}

.description {
  max-width: 890px;
  margin: 30px 0 0;
  color: #334155;
  font-size: 34px;
  font-weight: 500;
  line-height: 1.28;
}

.footer {
  display: flex;
  gap: 18px;
  margin-top: 56px;
  color: #475569;
  font-size: 24px;
  font-weight: 700;
}

.footer span {
  padding: 12px 18px;
  border: 2px solid #cbd5e1;
  border-radius: 999px;
  background: #ffffff;
}
</style>
