import React, { useState } from 'react'

const initialTodos = []

const emptyForm = {
  title: '',
  description: '',
  status: 'to-do',
  priority: 'low',
  deadline: '',
}

const statusLabels = {
  'to-do': 'To-do',
  'in progress': 'In progress',
  done: 'Selesai',
}

const priorityLabels = {
  low: 'Rendah',
  medium: 'Sedang',
  high: 'Tinggi',
}

function formatDate(date) {
  if (!date) return 'Belum ditentukan'

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

function Icon({ name }) {
  const paths = {
    eye: (
      <>
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16" />
        <path d="M10 11v6M14 11v6" />
        <path d="m5 7 1 13h12l1-13M9 7V4h6v3" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    arrow: <path d="m15 18-6-6 6-6" />,
    close: <path d="m18 6-12 12M6 6l12 12" />,
  }

  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  )
}

function TodoForm({ initialValue, onCancel, onSave, mode }) {
  const [form, setForm] = useState(initialValue ?? emptyForm)
  const [error, setError] = useState('')

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (error) setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!form.title.trim()) {
      setError('Judul tugas wajib diisi.')
      return
    }

    onSave({ ...form, title: form.title.trim() })
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel()
      }}
    >
      <section
        aria-labelledby="form-title"
        aria-modal="true"
        className="modal"
        role="dialog"
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow">Kelola daftar tugas</p>
            <h2 id="form-title">
              {mode === 'edit' ? 'Perbarui Tugas' : 'Tambah Tugas'}
            </h2>
          </div>
          <button
            aria-label="Tutup formulir"
            className="icon-button close-button"
            onClick={onCancel}
            type="button"
          >
            <Icon name="close" />
          </button>
        </div>

        <form className="todo-form" onSubmit={handleSubmit}>
          <label className="field field-full">
            <span>Judul</span>
            <input
              autoFocus
              maxLength={100}
              name="title"
              onChange={updateField}
              placeholder="Contoh: Menyelesaikan laporan"
              required
              value={form.title}
            />
          </label>

          <label className="field field-full">
            <span>Deskripsi</span>
            <textarea
              maxLength={500}
              name="description"
              onChange={updateField}
              placeholder="Tambahkan detail tugas (opsional)"
              rows={4}
              value={form.description}
            />
          </label>

          <label className="field">
            <span>Status</span>
            <select name="status" onChange={updateField} value={form.status}>
              <option value="to-do">To-do</option>
              <option value="in progress">In progress</option>
              <option value="done">Selesai</option>
            </select>
          </label>

          <label className="field">
            <span>Prioritas</span>
            <select
              name="priority"
              onChange={updateField}
              value={form.priority}
            >
              <option value="low">Rendah</option>
              <option value="medium">Sedang</option>
              <option value="high">Tinggi</option>
            </select>
          </label>

          <label className="field field-full">
            <span>Deadline</span>
            <input
              name="deadline"
              onChange={updateField}
              type="date"
              value={form.deadline}
            />
          </label>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <div className="form-actions field-full">
            <button className="button button-secondary" onClick={onCancel} type="button">
              Batal
            </button>
            <button className="button button-primary" type="submit">
              {mode === 'edit' ? 'Simpan Perubahan' : 'Tambah Tugas'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

function TodoDetail({ todo, onBack, onEdit }) {
  return (
    <main className="detail-layout">
      <button className="back-link" onClick={onBack} type="button">
        <Icon name="arrow" />
        Kembali ke daftar
      </button>

      <article className="detail-card">
        <div className="detail-main">
          <p className="eyebrow">Detail tugas</p>
          <h1>{todo.title}</h1>
          <div className="detail-description">
            <h2>Deskripsi</h2>
            <p>{todo.description || 'Tidak ada deskripsi untuk tugas ini.'}</p>
          </div>
        </div>
        <aside className="detail-sidebar">
          <div className="detail-item">
            <span>Status</span>
            <strong className={`status-pill status-${todo.status.replace(' ', '-')}`}>
              {statusLabels[todo.status]}
            </strong>
          </div>
          <div className="detail-item">
            <span>Prioritas</span>
            <strong className={`priority-text priority-${todo.priority}`}>
              {priorityLabels[todo.priority]}
            </strong>
          </div>
          <div className="detail-item">
            <span>Deadline</span>
            <strong>{formatDate(todo.deadline)}</strong>
          </div>
          <button className="button button-primary detail-edit" onClick={onEdit} type="button">
            Perbarui Tugas
          </button>
        </aside>
      </article>
    </main>
  )
}

function TodoList({ todos, onAdd, onDelete, onSelect }) {
  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <h1>Todo List</h1>
        </div>
        <button className="button button-primary add-button" onClick={onAdd} type="button">
          <Icon name="plus" />
          Tambah Tugas
        </button>
      </header>

      <section aria-label="Daftar tugas" className="list-card">
        <div className="list-card-heading">
          <div>
            <h2>Daftar tugas</h2>
            <p>{todos.length} tugas tersimpan</p>
          </div>
          <span className="task-count">{String(todos.length).padStart(2, '0')}</span>
        </div>

        {todos.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">
              <Icon name="plus" />
            </span>
            <h3>Belum ada tugas</h3>
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Judul</th>
                  <th scope="col">Status</th>
                  <th scope="col">Prioritas</th>
                  <th scope="col">Deadline</th>
                  <th className="actions-heading" scope="col">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {todos.map((todo) => (
                  <tr key={todo.id}>
                    <td>
                      <button
                        className="title-link"
                        onClick={() => onSelect(todo.id)}
                        type="button"
                      >
                        {todo.title}
                      </button>
                    </td>
                    <td>
                      <span className={`status-pill status-${todo.status.replace(' ', '-')}`}>
                        {statusLabels[todo.status]}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-text priority-${todo.priority}`}>
                        {priorityLabels[todo.priority]}
                      </span>
                    </td>
                    <td className="deadline-cell">{formatDate(todo.deadline)}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          aria-label={`Lihat detail ${todo.title}`}
                          className="icon-button view-button"
                          onClick={() => onSelect(todo.id)}
                          title="Lihat detail"
                          type="button"
                        >
                          <Icon name="eye" />
                        </button>
                        <button
                          aria-label={`Hapus ${todo.title}`}
                          className="icon-button delete-button"
                          onClick={() => onDelete(todo)}
                          title="Hapus tugas"
                          type="button"
                        >
                          <Icon name="trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default function App() {
  const [todos, setTodos] = useState(initialTodos)
  const [selectedId, setSelectedId] = useState(null)
  const [formState, setFormState] = useState(null)
  const [notice, setNotice] = useState('')
  const selectedTodo = todos.find((todo) => todo.id === selectedId)

  function showNotice(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3000)
  }

  function saveTodo(form) {
    if (formState.mode === 'edit') {
      setTodos((current) =>
        current.map((todo) =>
          todo.id === formState.todo.id ? { ...todo, ...form } : todo,
        ),
      )
      showNotice('Perubahan tugas berhasil disimpan.')
    } else {
      const newTodo = { id: crypto.randomUUID(), ...form }
      setTodos((current) => [newTodo, ...current])
      setSelectedId(null)
      showNotice('Tugas baru berhasil ditambahkan.')
    }

    setFormState(null)
  }

  function deleteTodo(todo) {
    const confirmed = window.confirm(`Hapus tugas "${todo.title}"?`)
    if (!confirmed) return

    setTodos((current) => current.filter((item) => item.id !== todo.id))
    if (selectedId === todo.id) setSelectedId(null)
    showNotice('Tugas berhasil dihapus.')
  }

  function editTodo(todo) {
    setFormState({ mode: 'edit', todo })
  }

  return (
    <>
      {selectedTodo ? (
        <TodoDetail
          onBack={() => setSelectedId(null)}
          onEdit={() => editTodo(selectedTodo)}
          todo={selectedTodo}
        />
      ) : (
        <TodoList
          onAdd={() => setFormState({ mode: 'add' })}
          onDelete={deleteTodo}
          onSelect={setSelectedId}
          todos={todos}
        />
      )}

      {formState && (
        <TodoForm
          initialValue={formState.todo}
          mode={formState.mode}
          onCancel={() => setFormState(null)}
          onSave={saveTodo}
        />
      )}

      {notice && (
        <div aria-live="polite" className="toast" role="status">
          <span className="toast-check">✓</span>
          {notice}
        </div>
      )}
    </>
  )
}
