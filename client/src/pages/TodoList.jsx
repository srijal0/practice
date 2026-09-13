import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Other');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTodos = async () => {
    const res = await fetch('http://localhost:5000/api/todos', {
      headers: authHeaders,
    });

    if (res.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const res = await fetch('http://localhost:5000/api/todos', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ text, dueDate: dueDate || null, category }),
    });
    const newTodo = await res.json();
    setTodos([newTodo, ...todos]);
    setText('');
    setDueDate('');
    setCategory('Other');
  };

  const toggleComplete = async (id, completed) => {
    const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ completed: !completed }),
    });
    const updated = await res.json();
    setTodos(todos.map((t) => (t._id === id ? updated : t)));
  };

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    setTodos(todos.filter((t) => t._id !== id));
  };

  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;

    const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ text: editText }),
    });
    const updated = await res.json();
    setTodos(todos.map((t) => (t._id === id ? updated : t)));
    setEditingId(null);
    setEditText('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  const remainingCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="app">
      <div className="app-header">
        <h1>My Todo List</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <form onSubmit={addTodo}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="Urgent">Urgent</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit">Add</button>
      </form>

      <div className="filters">
        <button
          className={filter === 'all' ? 'active-filter' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'active' ? 'active-filter' : ''}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={filter === 'completed' ? 'active-filter' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <p className="remaining-count">
        {remainingCount} {remainingCount === 1 ? 'task' : 'tasks'} remaining
      </p>

      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo._id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo._id, todo.completed)}
            />

            {editingId === todo._id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  autoFocus
                />
                <button onClick={() => saveEdit(todo._id)}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                  }}
                >
                  {todo.text}
                </span>
                {todo.dueDate && (
                  <span className="due-date">
                    Due {new Date(todo.dueDate).toLocaleDateString()}
                  </span>
                )}
                <span className={`category-badge category-${todo.category.toLowerCase()}`}>
                  {todo.category}
                </span>
                <button onClick={() => startEditing(todo)}>Edit</button>
                <button onClick={() => deleteTodo(todo._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;