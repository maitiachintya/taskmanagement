import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All'); // For filtering tasks

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (task.trim()) {
      setTasks([
        ...tasks,
        { id: Date.now(), text: task, completed: false, isEditing: false },
      ]);
      setTask('');
    }
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleToggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleEditTask = (id, newText) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: newText, isEditing: false } : task
      )
    );
  };

  const handleToggleEdit = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, isEditing: !task.isEditing } : task
      )
    );
  };

  // Filter tasks based on status (All, Active, Completed)
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'All') return true;
    if (filter === 'Active') return !task.completed;
    if (filter === 'Completed') return task.completed;
    return true;
  });

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add a new task"
      />
      <button onClick={handleAddTask}>Add Task</button>

      <div className="filters">
        <button onClick={() => setFilter('All')}>All</button>
        <button onClick={() => setFilter('Active')}>Active</button>
        <button onClick={() => setFilter('Completed')}>Completed</button>
      </div>

      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id}>
            {task.isEditing ? (
              <>
                <input
                  type="text"
                  defaultValue={task.text}
                  onBlur={(e) => handleEditTask(task.id, e.target.value)}
                />
              </>
            ) : (
              <>
                <span
                  style={{ textDecoration: task.completed ? 'line-through' : '' }}
                >
                  {task.text}
                </span>
                <button onClick={() => handleToggleTask(task.id)}>Complete</button>
                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                <button onClick={() => handleToggleEdit(task.id)}>Edit</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
