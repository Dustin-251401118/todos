const API_URL = '/api/todos'

async function request(url, options) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Request gagal dengan status ${response.status}`)
  }

  if (response.status === 204) return null
  return response.json()
}

export function getTodos() {
  return request(API_URL)
}

export function getTodoById(id) {
  return request(`${API_URL}/${id}`)
}

export function createTodo(todo) {
  return request(API_URL, {
    method: 'POST',
    body: JSON.stringify(todo),
  })
}

export function updateTodo(id, todo) {
  return request(`${API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(todo),
  })
}

export function deleteTodo(id) {
  return request(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
}
