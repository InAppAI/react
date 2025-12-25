import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePreferences } from '../contexts/PreferenceContext';
import { useTodos } from '../contexts/TodoContext';
import './TodoDemo.css';

type FilterType = 'all' | 'active' | 'completed';

function TodoDemo() {
  const { preferences } = usePreferences();
  const { todos, addTodo, completeTodo, deleteTodo } = useTodos();
  const [filter, setFilter] = useState<FilterType>('all');
  const [newTodoText, setNewTodoText] = useState('');

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      addTodo(newTodoText.trim());
      setNewTodoText('');
    }
  };

  // Stats
  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  return (
    <div className="todo-demo-container">
      {/* Header */}
      <header className="todo-demo-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>📝 Todo App with AI Copilot</h1>
        <p className="subtitle">
          The AI assistant can help you manage your tasks using the {preferences.displayMode} display mode
        </p>
      </header>

      {/* Main Content */}
      <div className="todo-demo-content">
        <div className="todo-container">
          {/* Add Todo Form */}
          <form className="add-todo-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="What needs to be done?"
              className="todo-input"
            />
            <button type="submit" className="add-button">
              Add Task
            </button>
          </form>

          {/* Stats Bar */}
          <div className="stats-bar">
            <span>Total: {stats.total}</span>
            <span>Active: {stats.active}</span>
            <span>Completed: {stats.completed}</span>
          </div>

          {/* Filters */}
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>

          {/* Todo List */}
          <div className="todo-list">
            {filteredTodos.length === 0 ? (
              <div className="empty-state">
                <p>No tasks {filter !== 'all' ? `in ${filter}` : 'yet'}!</p>
                <p className="hint">Try asking the AI to add some tasks for you.</p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`todo-item ${todo.completed ? 'completed' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => completeTodo(todo.id)}
                    className="todo-checkbox"
                  />
                  <div className="todo-content">
                    <span className="todo-text">{todo.text}</span>
                    <span className={`priority-badge priority-${todo.priority}`}>
                      {todo.priority}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-button"
                    aria-label="Delete task"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          {/* AI Helper Tips */}
          <div className="ai-tips">
            <h3>💡 Try asking the AI:</h3>
            <ul>
              <li>"Add a high priority task to review the code"</li>
              <li>"Mark the first task as complete"</li>
              <li>"Delete all completed tasks"</li>
              <li>"What tasks do I have?"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoDemo;
