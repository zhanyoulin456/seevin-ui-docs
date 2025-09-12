# EventBus 事件总线

一个轻量级的事件总线实现，提供组件间通信、事件订阅发布等功能，支持 TypeScript 类型安全。

<script setup>
import { ref, onUnmounted } from 'vue'
import { Button as TButton } from 'tdesign-vue-next'
import DemoBox from '../../.vitepress/components/DemoBox.vue'

// 示例数据
const messages = ref([])
const eventCount = ref(0)
const isListening = ref(false)

// 模拟 EventBus
class MockEventBus {
  constructor() {
    this.events = new Map()
  }
  
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event).push(callback)
  }
  
  emit(event, data) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(callback => callback(data))
    }
  }
  
  off(event, callback) {
    if (this.events.has(event)) {
      const callbacks = this.events.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }
  
  clear() {
    this.events.clear()
  }
}

const eventBus = new MockEventBus()

const messageHandler = (data) => {
  messages.value.unshift({
    id: Date.now(),
    type: data.type || 'info',
    content: data.message || data,
    time: new Date().toLocaleTimeString()
  })
  eventCount.value++
}

const startListening = () => {
  eventBus.on('user:message', messageHandler)
  eventBus.on('system:notification', messageHandler)
  isListening.value = true
}

const stopListening = () => {
  eventBus.off('user:message', messageHandler)
  eventBus.off('system:notification', messageHandler)
  isListening.value = false
}

const sendMessage = () => {
  eventBus.emit('user:message', {
    type: 'success',
    message: `用户消息 #${eventCount.value + 1}`
  })
}

const sendNotification = () => {
  eventBus.emit('system:notification', {
    type: 'warning',
    message: `系统通知 #${eventCount.value + 1}`
  })
}

const clearMessages = () => {
  messages.value = []
  eventCount.value = 0
}

const clearAllEvents = () => {
  eventBus.clear()
  isListening.value = false
  clearMessages()
}

onUnmounted(() => {
  stopListening()
})
</script>

## 导入方式

```ts
import { EventBus } from '@seevin/common'
```

## 基础用法

<DemoBox title="基础用法" description="事件的订阅、发布和取消订阅">
<div>
  <div class="mb-4 flex gap-2 flex-wrap">
    <TButton 
      v-if="!isListening" 
      @click="startListening" 
      theme="primary"
    >
      开始监听
    </TButton>
    <TButton 
      v-else 
      @click="stopListening" 
      theme="default"
    >
      停止监听
    </TButton>
    <TButton 
      @click="sendMessage" 
      :disabled="!isListening"
    >
      发送用户消息
    </TButton>
    <TButton 
      @click="sendNotification" 
      :disabled="!isListening"
      theme="warning"
    >
      发送系统通知
    </TButton>
    <TButton 
      @click="clearMessages" 
      theme="default"
      variant="outline"
    >
      清空消息
    </TButton>
    <TButton 
      @click="clearAllEvents" 
      theme="danger"
      variant="outline"
    >
      清空所有事件
    </TButton>
  </div>
  
  <div class="mb-3">
    <div class="flex items-center gap-2 mb-2">
      <span class="text-sm text-[color:var(--vp-c-text-2)]">监听状态:</span>
      <span :class="isListening ? 'text-green-600' : 'text-gray-500'">
        {{ isListening ? '✓ 正在监听' : '✗ 未监听' }}
      </span>
      <span class="text-sm text-[color:var(--vp-c-text-2)] ml-4">事件计数:</span>
      <span class="font-mono">{{ eventCount }}</span>
    </div>
  </div>
  
  <div v-if="messages.length > 0" class="mb-3">
    <h4 class="text-base text-[color:var(--vp-c-text-1)] mb-2">接收到的事件：</h4>
    <div class="max-h-48 overflow-y-auto border rounded">
      <div 
        v-for="msg in messages" 
        :key="msg.id" 
        class="p-3 border-b last:border-b-0 text-sm"
        :class="{
          'bg-green-50': msg.type === 'success',
          'bg-yellow-50': msg.type === 'warning',
          'bg-blue-50': msg.type === 'info'
        }"
      >
        <div class="flex justify-between items-start">
          <span class="font-medium">{{ msg.content }}</span>
          <span class="text-xs text-[color:var(--vp-c-text-3)] ml-2">{{ msg.time }}</span>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="text-center py-8 text-[color:var(--vp-c-text-2)] bg-[color:var(--vp-c-bg-alt)] rounded">
    暂无事件消息
  </div>
</div>
</DemoBox>

```ts
import { EventBus } from '@seevin/common'

// 创建事件总线实例
const eventBus = new EventBus()

// 订阅事件
const handleUserLogin = user => {
  console.log('用户登录:', user)
}

eventBus.on('user:login', handleUserLogin)

// 发布事件
eventBus.emit('user:login', { id: 1, name: 'John' })

// 取消订阅
eventBus.off('user:login', handleUserLogin)
```

## ## 最佳实践

### 1. 定义事件类型

```ts
// 定义事件类型 (src/types/events.ts)
interface AppEvents {
  'user:login': { userId: string; username: string }
  'user:logout': { userId: string }
  'cart:add': { productId: string; quantity: number }
  'notification:show': { message: string; type: 'success' | 'error' }
}
```

### 2. 创建项目级 Hook

```ts
// 创建项目级 Hook (src/hooks/useAppEventBus.ts)
import { createEventBus, useEventBus } from '@seevin/common'
import type { AppEvents } from '@/types/events'

// 创建共享实例
const appEventBus = createEventBus<AppEvents>()

// 导出使用共享实例的 Hook
export const useAppEventBus = () => useEventBus<AppEvents>(appEventBus)
```

### 3. 在组件中使用

```vue
<template>
  <div>
    <TButton @click="sendMessage">发送消息</TButton>
    <div v-if="messages.length">
      <div v-for="msg in messages" :key="msg.id">
        {{ msg.content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppEventBus } from '@/hooks/useEventBus'

const { on, emit } = useAppEventBus()
const messages = ref([])

// 监听消息事件
on('user:login', data => {
  messages.value.push({
    userId: data.userId,
    userName: data.userName
  })
})

const sendMessage = () => {
  emit('user:login', {
    userId: '123',
    userName: 'casdio'
  })
}
</script>
```

## TypeScript 支持

```ts
// 类型安全的事件总线
interface MyEvents {
  'data:update': { id: string; data: any }
  'user:login': { userId: string }
}

const eventBus = new EventBus<MyEvents>()

// 完整的类型检查
eventBus.on('data:update', payload => {
  // payload 类型为 { id: string; data: any }
  console.log(payload.id)
})

eventBus.emit('data:update', {
  id: '123',
  data: { name: 'test' }
})
```

## API 参考

### 类型定义

```ts
type EventMap = Record<string | symbol, any>
type EventHandler<T> = (data: T) => void

interface EventBusInstance<T extends EventMap> {
  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): () => void
  once<K extends keyof T>(event: K, handler: EventHandler<T[K]>): () => void
  emit<K extends keyof T>(event: K, data: T[K]): void
  off<K extends keyof T>(event: K, handler?: EventHandler<T[K]>): void
  clear(): void
}
```

### 实例方法

```ts
// 事件监听
on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): () => void
once<K extends keyof T>(event: K, handler: EventHandler<T[K]>): () => void

// 事件发送
emit<K extends keyof T>(event: K, data: T[K]): void

// 事件移除
off<K extends keyof T>(event: K, handler?: EventHandler<T[K]>): void

// 清空所有事件
clear(): void
```
