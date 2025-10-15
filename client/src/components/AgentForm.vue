<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import { useAgentApi } from '../composables/useAgentApi.js'

const emit = defineEmits(['agentCreated', 'agentUpdated'])

const { isLoading, message, messageType, createAgent, updateAgent, fetchAgents } = useAgentApi()

defineExpose({ message, messageType })

// List of existing agents
const agents = ref([])
const selectedAgentId = ref('new')

// Reactive form data
const formData = reactive({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  mobileNumber: ''
})

// Fetch agents on mount
onMounted(async () => {
  const result = await fetchAgents()
  if (result && result.data) {
    agents.value = result.data
  }
})

// Watch for agent selection and populate form
watch(selectedAgentId, (newId) => {
  if (newId === 'new') {
    // Create new agent mode - clear form
    Object.assign(formData, {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: ''
    })
  } else if (newId) {
    // Edit existing agent
    const agent = agents.value.find(a => a.id === newId)
    if (agent) {
      Object.assign(formData, {
        id: agent.id,
        firstName: agent.firstName,
        lastName: agent.lastName,
        email: agent.email,
        mobileNumber: agent.mobileNumber
      })
    }
  }
})

// Handle form submission
const handleSubmit = async () => {
  const requestData = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    mobileNumber: formData.mobileNumber
  }

  let result
  if (formData.id) {
    result = await updateAgent(formData.id, requestData)
    if (result) {
      emit('agentUpdated', result)
      // Refresh agents list
      const updatedAgents = await fetchAgents()
      if (updatedAgents && updatedAgents.data) {
        agents.value = updatedAgents.data
      }
    }
  } else {
    result = await createAgent(requestData)
    if (result) {
      formData.id = result.id
      emit('agentCreated', result)
      // Add the new agent to the list and select it
      agents.value.push(result)
      selectedAgentId.value = result.id
    }
  }
}

// Reset form (triggers watch to clear form)
const resetForm = () => {
  selectedAgentId.value = 'new'
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Agent Selection -->
      <div>
        <label for="agentSelect" class="block text-sm font-medium text-gray-700 mb-2">
          Select Agent
        </label>
        <select
          id="agentSelect"
          v-model="selectedAgentId"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="new">Create New Agent</option>
          <option disabled>──────────</option>
          <option 
            v-for="agent in agents" 
            :key="agent.id" 
            :value="agent.id"
          >
            {{ agent.firstName }} {{ agent.lastName }} - {{ agent.email }}
          </option>
        </select>
        <p class="mt-1 text-sm text-gray-500">
          Select an existing agent to edit or create a new one
        </p>
      </div>

      <!-- First Name Field -->
      <div>
        <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
          First Name *
        </label>
        <input
          type="text"
          id="firstName"
          v-model="formData.firstName"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter first name"
        />
      </div>

      <!-- Last Name Field -->
      <div>
        <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
          Last Name *
        </label>
        <input
          type="text"
          id="lastName"
          v-model="formData.lastName"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter last name"
        />
      </div>

      <!-- Email Field -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter email address"
        />
      </div>

      <!-- Mobile Number Field -->
      <div>
        <label for="mobileNumber" class="block text-sm font-medium text-gray-700 mb-2">
          Mobile Number *
        </label>
        <input
          type="tel"
          id="mobileNumber"
          v-model="formData.mobileNumber"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter mobile number"
        />
        <p class="mt-1 text-sm text-gray-500">
          At least 10 digits (e.g., +1234567890, (123) 456-7890)
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-4 pt-6">
        <button
          type="submit"
          :disabled="isLoading"
          class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="isLoading">Processing...</span>
          <span v-else>{{ formData.id ? 'Update Agent' : 'Create Agent' }}</span>
        </button>
        
        <button
          type="button"
          @click="resetForm"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Reset
        </button>
      </div>
    </form>
  </div>
</template>
