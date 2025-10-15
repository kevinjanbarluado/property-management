import { ref } from 'vue'
import apiClient from '../api/client.js'

export function useAgentApi() {
  const isLoading = ref(false)
  const message = ref('')
  const messageType = ref('')

  const showMessage = (text, type) => {
    message.value = text
    messageType.value = type
    setTimeout(() => {
      message.value = ''
      messageType.value = ''
    }, 5000)
  }

  const createAgent = async (agentData) => {
    isLoading.value = true
    message.value = ''
    
    try {
      const response = await apiClient.post('/agents', agentData)
      
      showMessage('Agent created successfully!', 'success')
      return response.data
      
    } catch (error) {
      console.error('Error:', error)
      if (error.response) {
        handleError(error.response.data, error.response)
      } else {
        showMessage(`Error: ${error.message}`, 'error')
      }
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateAgent = async (id, agentData) => {
    isLoading.value = true
    message.value = ''
    
    try {
      const response = await apiClient.put(`/agents/${id}`, agentData)
      
      showMessage('Agent updated successfully!', 'success')
      return response.data
      
    } catch (error) {
      console.error('Error:', error)
      if (error.response) {
        handleError(error.response.data, error.response)
      } else {
        showMessage(`Error: ${error.message}`, 'error')
      }
      return null
    } finally {
      isLoading.value = false
    }
  }

  const fetchAgents = async () => {
    try {
      const response = await apiClient.get('/agents')
      return response.data
    } catch (error) {
      console.error('Error fetching agents:', error)
      if (error.response) {
        handleError(error.response.data, error.response)
      } else {
        showMessage(`Error: ${error.message}`, 'error')
      }
      return null
    }
  }

  const handleError = (result, response) => {
    if (result.error && result.details) {
      // Validation error with details array
      const errorDetails = Array.isArray(result.details) 
        ? result.details.join(', ') 
        : result.details
      showMessage(`${result.error}: ${errorDetails}`, 'error')
    } else if (result.error) {
      // Simple error message (e.g., "Email already exists")
      showMessage(result.error, 'error')
    } else if (result.message) {
      showMessage(result.message, 'error')
    } else {
      showMessage(`HTTP error! status: ${response.status}`, 'error')
    }
  }

  return {
    isLoading,
    message,
    messageType,
    createAgent,
    updateAgent,
    fetchAgents,
    showMessage
  }
}
