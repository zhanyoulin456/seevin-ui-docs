<template>
  <div class="demo-container">
    <!-- 演示区域 -->
    <div class="demo-preview">
      <slot name="demo" />
    </div>

    <!-- 操作栏 -->
    <div class="demo-actions">
      <div class="demo-actions__left">
        <span class="demo-title">{{ title }}</span>
        <span v-if="description" class="demo-description">{{ description }}</span>
      </div>
      <div class="demo-actions__right">
        <button
          class="demo-btn"
          :class="{ active: showCode }"
          :title="showCode ? '隐藏代码' : '显示代码'"
          @click="toggleCode"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.7 15.9L4.8 12l3.9-3.9c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L2.1 11.9c-.78.78-.78 2.05 0 2.83l5.2 5.2c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41zm6.6 0l3.9-3.9-3.9-3.9c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l5.2 5.2c.78.78.78 2.05 0 2.83l-5.2 5.2c-.39.39-1.02.39-1.41 0-.39-.39-.39-1.02 0-1.41z"/>
          </svg>
        </button>
        <button
          class="demo-btn"
          :title="copied ? '已复制!' : '复制代码'"
          :class="{ copied }"
          @click="copyCode"
        >
          <svg v-if="!copied" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 代码区域 -->
    <Transition name="code">
      <div v-show="showCode" class="demo-code">
        <div class="demo-code__content">
          <slot name="code" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title?: string
  description?: string
  code?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '基础用法',
  description: ''
})

const showCode = ref(false)
const copied = ref(false)

const toggleCode = () => {
  showCode.value = !showCode.value
}

const copyCode = async () => {
  if (!props.code) return

  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}
</script>

<style scoped>
.demo-container {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  margin: 16px 0;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.demo-preview {
  padding: 24px;
  background: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-divider);
}

.demo-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 14px;
}

.demo-actions__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.demo-title {
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.demo-description {
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.demo-actions__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.demo-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
}

.demo-btn:hover {
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
}

.demo-btn.active {
  background: var(--vp-c-brand);
  color: white;
}

.demo-btn.copied {
  color: var(--vp-c-brand);
}

.demo-code {
  background: var(--vp-code-block-bg);
}

.demo-code__content {
  padding: 0;
}

.demo-code :deep(.language-vue),
.demo-code :deep(.language-typescript),
.demo-code :deep(.language-javascript) {
  margin: 0;
  border-radius: 0;
}

.demo-code :deep(pre) {
  margin: 0;
  background: transparent !important;
}

/* 过渡动画 */
.code-enter-active,
.code-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.code-enter-from,
.code-leave-to {
  max-height: 0;
  opacity: 0;
}

.code-enter-to,
.code-leave-from {
  max-height: 500px;
  opacity: 1;
}

/* 响应式 */
@media (max-width: 640px) {
  .demo-preview {
    padding: 16px;
  }

  .demo-actions {
    padding: 8px 12px;
    font-size: 13px;
  }

  .demo-actions__left {
    gap: 8px;
  }

  .demo-description {
    display: none;
  }
}
</style>
