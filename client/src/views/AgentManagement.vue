<script setup>
import { ref } from 'vue'
import AgentForm from '../components/AgentForm.vue'
import AlertMessage from '../components/AlertMessage.vue'

const agentFormRef = ref(null)

const handleAgentCreated = (agent) => {
  console.log('Agent created:', agent)
}

const handleAgentUpdated = (agent) => {
  console.log('Agent updated:', agent)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Agent Management</h1>
        <p class="text-gray-600">Create or update agent information</p>
      </div>

      <!-- Alert Message -->
      <AlertMessage 
        :message="agentFormRef?.message" 
        :type="agentFormRef?.messageType" 
      />

      <!-- Form -->
      <AgentForm 
        ref="agentFormRef"
        @agent-created="handleAgentCreated"
        @agent-updated="handleAgentUpdated"
      />

      <!-- Instructions -->
      <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="text-sm font-medium text-blue-800 mb-2">How to use:</h3>
        <ul class="text-sm text-blue-700 space-y-1">
          <li>• <strong>Create new agent:</strong> Leave ID field empty and fill in all required fields</li>
          <li>• <strong>Update existing agent:</strong> Enter the agent ID and modify the fields you want to update</li>
        </ul>
      </div>
    </div>
  </div>
</template>
