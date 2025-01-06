<script setup lang="ts">
import { BaseEdge, EdgeLabelRenderer, Position, getBezierPath, useNodesData, useVueFlow } from '@vue-flow/core';

defineOptions({
  inheritAttrs: false,
});

interface CustomEdgeProps {
  id: string;
  source: string;
  target: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition?: Position;
  targetPosition?: Position;
}

const {
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition = Position.Right,
  targetPosition = Position.Left,
} = defineProps<CustomEdgeProps>();

const { updateEdgeData } = useVueFlow();

const nodesData = useNodesData([target, source]);

const labelRef = useTemplateRef('labelRef');
const edgeRef = useTemplateRef('edgeRef');

const targetNodeData = computed(() => nodesData.value[0]?.data);
const sourceNodeData = computed(() => nodesData.value[1]?.data);

const isFinished = toRef(() => sourceNodeData.value.isFinished);
const isCancelled = toRef(() => targetNodeData.value.isCancelled);
const isAnimating = ref(false);

let animation: Animation | null = null;

const path = computed(() => getBezierPath({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}));

watch(isCancelled, (isCancelled) => {
  if (isCancelled)
    animation?.cancel();
});

watch(isAnimating, (isAnimating) => {
  updateEdgeData(id, { isAnimating });
});

watch(isFinished, (isFinished) => {
  if (isFinished)
    runAnimation();
});

function runAnimation() {
  const pathEl = edgeRef.value?.pathEl;
  if (!pathEl)
    return;

  isAnimating.value = true;
  const keyframes = [{ offsetDistance: '0%' }, { offsetDistance: '100%' }];

  // use path length as a possible measure for the animation duration
  const pathLengthDuration = pathEl.getTotalLength() * 10;

  animation = labelRef.value?.animate(keyframes, {
    duration: Math.min(Math.max(pathLengthDuration, 1500), 3000), // clamp duration between 1.5s and 3s
    direction: 'normal',
    easing: 'ease-in-out',
    iterations: 1,
  }) ?? null;

  if (animation) {
    animation.onfinish = handleAnimationEnd;
    animation.oncancel = handleAnimationEnd;
  }
}

function handleAnimationEnd() {
  isAnimating.value = false;
}
</script>

<template>
  <BaseEdge
    :id="id"
    ref="edgeRef"
    :path="path[0]"
    :style="{ stroke: 'var(--ui-primary)' }"
  />

  <EdgeLabelRenderer>
    <div
      ref="labelRef"
      :style="{
        visibility: isAnimating ? 'visible' : 'hidden',
        position: 'absolute',
        zIndex: 1,
        offsetPath: `path('${path[0]}')`,
        offsetRotate: '0deg',
        offsetAnchor: 'center',
      }"
      class="animated-edge-label"
    >
      <UIcon name="i-lucide-globe" />
    </div>
  </EdgeLabelRenderer>
</template>
