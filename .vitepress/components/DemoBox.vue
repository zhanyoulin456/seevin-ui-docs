<template>
  <div class="demo-box">
    <div v-if="title" class="demo-header">
      <h4>{{ title }}</h4>
      <p v-if="description">{{ description }}</p>
    </div>

    <div class="demo-content">
      <slot />
    </div>

    <div v-if="code" class="demo-actions">
      <button class="demo-btn" :class="{ active: showCode }" @click="toggleCode">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M8.7 15.9L4.8 12l3.9-3.9c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L2.1 11.9c-.78.78-.78 2.05 0 2.83l5.2 5.2c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41zm6.6 0l3.9-3.9-3.9-3.9c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l5.2 5.2c.78.78.78 2.05 0 2.83l-5.2 5.2c-.39.39-1.02.39-1.41 0-.39-.39-.39-1.02 0-1.41z"
          />
        </svg>
        {{ showCode ? '隐藏代码' : '显示代码' }}
      </button>

      <button class="demo-btn" :class="{ copied }" @click="copyCode">
        <svg v-if="!copied" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
          />
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
        {{ copied ? '已复制' : '复制代码' }}
      </button>
    </div>

    <div v-if="code && showCode" class="demo-code" v-html="code"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: String,
  description: String,
  code: String
})

const showCode = ref(false)
const copied = ref(false)

const toggleCode = () => {
  showCode.value = !showCode.value
}

const copyCode = async () => {
  if (!props.code) return

  try {
    // 提取纯文本代码（去掉HTML标签）
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = props.code
    const plainText = tempDiv.textContent || tempDiv.innerText || ''

    await navigator.clipboard.writeText(plainText)
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
.demo-box {
  margin: 20px 0;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.demo-header {
  padding: 16px 20px;
  background: var(--vp-c-bg-alt);
  border-radius: 4px 4px 0 0;
}

.demo-header h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.demo-header p {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.demo-content {
  padding: 16px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 0 0 4px 4px;
}

.demo-actions {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}

.demo-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.demo-btn:hover {
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand);
}

.demo-btn.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.demo-btn.copied {
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
}

.demo-code {
  background: var(--vp-code-block-bg);
  overflow-x: auto;
}

.demo-code :deep(pre) {
  margin: 0;
  padding: 20px;
  background: transparent !important;
}

.demo-code :deep(code) {
  background: transparent !important;
  font-size: 14px;
  line-height: 1.5;
}

/* 响应式 */
@media (max-width: 640px) {
  .demo-content {
    padding: 16px;
  }

  .demo-actions {
    flex-wrap: wrap;
    gap: 8px;
  }

  .demo-btn {
    font-size: 13px;
    padding: 4px 8px;
  }
}
</style>
