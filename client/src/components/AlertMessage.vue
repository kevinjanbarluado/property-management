<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'info', 'warning'].includes(value)
  }
})
</script>

<template>
  <div v-if="message" :class="[
    'mb-6 p-4 rounded-lg',
    type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
    type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
    type === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
    'bg-blue-100 text-blue-800 border border-blue-200'
  ]">
    {{ message }}
  </div>
</template>
