<script lang="ts" setup>
import type { Node, Edge, DefaultEdgeOptions } from '@vue-flow/core';
import { VueFlow, Position } from '@vue-flow/core';

const defaultEdgeOptions = {
  animated: false,
  type: 'custom', // Set default edge type to our custom edge
} satisfies DefaultEdgeOptions;

const defaultNodeOptions = {
  type: 'basic',
  targetPosition: Position.Left,
  sourcePosition: Position.Right,
};

const props = defineProps<{
  nodes: Node[];
  edges: Edge[];
  height: number;
}>();

const nodes = computed(() => props.nodes.map(node => ({ ...defaultNodeOptions, ...node })));
</script>

<template>
  <ClientOnly>
    <div :style="`width: 100%; height: ${height}px`">
      <VueFlow
        :nodes
        :edges
        :default-edge-options
        :fit-view-on-init="true"
        :nodes-draggable="false"
        :nodes-connectable="false"
        :nodes-focusable="false"
        :edges-focusable="false"
        :edges-updatable="false"
        :pan-on-drag="false"
        :zoom-on-double-click="false"
        :zoom-on-pinch="false"
        :zoom-on-scroll="false"
      >
        <template #node-basic="{ data }">
          <Node v-bind="data" />
        </template>

        <template #edge-custom="data">
          <CustomEdge v-bind="data" />
        </template>
      </VueFlow>
    </div>
  </ClientOnly>
</template>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';

.vue-flow__edge-path {
  stroke: var(--ui-primary);
  stroke-width: 4px;
}
</style>
