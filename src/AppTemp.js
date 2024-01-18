// App.js

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './App.css';

const TodoItem = ({ todo, onDelete, onEdit, onToggle, onUpdateDeadline }) => {
  const [editingDeadline, setEditingDeadline] = useState(false);

  const handleDeadlineChange = (e) => {
    onUpdateDeadline(todo.id, e.target.value);
  };

  useEffect(() => {
    if (editingDeadline) {
      const timer = setTimeout(() => {
        setEditingDeadline(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [editingDeadline]);

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-header">
        <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />
        <h3>{todo.text}</h3>
      </div>
      <div className="deadline-container">
        <label>Deadline:</label>
        <input
          type="date"
          value={todo.deadline || ''}
          onChange={handleDeadlineChange}
          disabled={todo.completed}
        />
        {editingDeadline && <span className="editing-message">Signing In...</span>}
      </div>
      <div className="actions">
        <button onClick={() => onEdit(todo.id, todo.text)}>Edit</button>
        <button onClick={() => onDelete(todo.id)}>Delete</button>
      </div>
    </li>
  );
};

const TodoList = ({ todos, onDelete, onEdit, onToggle, onUpdateDeadline }) => {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggle={onToggle}
          onUpdateDeadline={onUpdateDeadline}
        />
      ))}
    </ul>
  );
};

const AddTodo = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (text.trim() !== '') {
      onAdd(text);
      setText('');
    }
  };

  return (
    <div className="add-todo">
      <input
        type="text"
        placeholder="Add a new task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
};

const SignIn = ({ onSignIn, signingIn, onShowSignUp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignInClick = async () => {
    if (username.trim() !== '' && password.trim() !== '') {
      const storedPassword = localStorage.getItem(`${username}_password`);
      if (password === storedPassword) {
        onSignIn(username);
      } else {
        alert('Incorrect password. Please try again.');
      }
    } else {
      alert('Please enter a valid username and password.');
    }
  };

  return (
    <div className="auth-form">
      <h2>Todolist</h2>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignInClick} disabled={signingIn}>
        {signingIn ? 'Signing In...' : 'Sign In'}
      </button>
      <button onClick={onShowSignUp}>Sign Up</button>
    </div>
  );
};

const SignUp = ({ onSignUp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    const existingUsernames = JSON.parse(localStorage.getItem('usernames')) || [];

    if (!existingUsernames.includes(username)) {
      localStorage.setItem(username, JSON.stringify([]));
      localStorage.setItem(`${username}_password`, password);
      existingUsernames.push(username);
      localStorage.setItem('usernames', JSON.stringify(existingUsernames));
      onSignUp(username);
    } else {
      alert('Username is already taken. Please choose another.');
    }
  };

  return (
    <div className="auth-form">
      <h2>Todolist</h2>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

const AboutUsModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="About Us Modal"
      className="modal"
    >
      <h2>About Us</h2>
      <p>This is a simple Todolist application created with React.</p>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

const FrontPage = ({ onSignIn, onShowSignUp }) => {
  return (
    <div className="front-page">
      <h1>Welcome to Todolist</h1>
      <button className="guide" onClick={() => alert('Todolist Guide: ...')}>
        Guide
      </button>
      <button className="sign-in" onClick={onSignIn}>
        Sign In
      </button>
      <button className="sign-up" onClick={onShowSignUp}>
        Sign Up
      </button>
    </div>
  );
};

const App = () => {
  if (!localStorage.getItem('usernames')) {
    localStorage.setItem('usernames', JSON.stringify([]));
  }

  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [showAboutUsModal, setShowAboutUsModal] = useState(false);

  const handleSignIn = async (username) => {
    setSigningIn(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSigningIn(false);

    if (localStorage.getItem(username)) {
      setUser(username);
      const storedTodos = JSON.parse(localStorage.getItem(username)) || [];
      setTodos(storedTodos);
      alert(`Hello, ${username}!`);
    } else {
      alert('Username not found. Please sign up.');
    }
  };

  const handleSignUp = (username) => {
    if (!localStorage.getItem(username)) {
      setUser(username);
      const storedTodos = JSON.parse(localStorage.getItem(username)) || [];
      setTodos(storedTodos);
      alert(`Hello, ${username}!`);
    } else {
      alert('Username is already taken. Please choose another.');
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setEditingTodo(null);
  };

  const handleAddTodo = (text) => {
    if (text.trim() !== '') {
      const newTodo = { id: new Date().getTime(), text, completed: false, deadline: null };
      setTodos([...todos, newTodo]);
      localStorage.setItem(user, JSON.stringify([...todos, newTodo]));
    } else {
      alert('Please enter a valid task.');
    }
  };

  const handleDeleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem(user, JSON.stringify(updatedTodos));
  };

  const handleEditTodo = (id, text) => {
    setEditingTodo({ id, text });
  };

  const handleUpdateTodo = (id, newText) => {
    if (newText.trim() !== '') {
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      );
      setTodos(updatedTodos);
      localStorage.setItem(user, JSON.stringify(updatedTodos));
      setEditingTodo(null);
    } else {
      alert('Please enter a valid task.');
    }
  };

  const handleToggleTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem(user, JSON.stringify(updatedTodos));
  };

  const handleUpdateDeadline = (id, newDeadline) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, deadline: newDeadline } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem(user, JSON.stringify(updatedTodos));
  };

  const handleSortByDeadline = () => {
    const sortedTodos = [...todos].sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
    setTodos(sortedTodos);
    localStorage.setItem(user, JSON.stringify(sortedTodos));
  };

  const handleMarkAllCompleted = () => {
    const updatedTodos = todos.map((todo) => ({ ...todo, completed: true }));
    setTodos(updatedTodos);
    localStorage.setItem(user, JSON.stringify(updatedTodos));
  };

  const handleClearCompleted = () => {
    const updatedTodos = todos.filter((todo) => !todo.completed);
    setTodos(updatedTodos);
    localStorage.setItem(user, JSON.stringify(updatedTodos));
  };

  return (
    <div className="app">
      {user ? (
        <>
          <header>
            <h1>Todolist</h1>
            <span>Hello, {user}!</span>
            <button className="sign-out" onClick={handleSignOut}>
              Sign Out
            </button>
          </header>
          <AddTodo onAdd={handleAddTodo} />
          <div className="sort-container">
            <button onClick={handleSortByDeadline}>Sort by Deadline</button>
            <button onClick={handleMarkAllCompleted}>Mark All Completed</button>
            <button onClick={handleClearCompleted}>Clear Completed</button>
            <span>Total Todos: {todos.length}</span>
          </div>
          <TodoList
            todos={todos}
            onDelete={handleDeleteTodo}
            onEdit={handleEditTodo}
            onToggle={handleToggleTodo}
            onUpdateDeadline={handleUpdateDeadline}
          />
          {editingTodo && (
            <div className="edit-todo">
              <input
                type="text"
                value={editingTodo.text}
                onChange={(e) => setEditingTodo({ ...editingTodo, text: e.target.value })}
              />
              <button onClick={() => handleUpdateTodo(editingTodo.id, editingTodo.text)}>
                Update
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <FrontPage onSignIn={() => setShowSignUp(false)} onShowSignUp={() => setShowSignUp(true)} />
          <SignIn onSignIn={handleSignIn} signingIn={signingIn} onShowSignUp={() => setShowSignUp(true)} />
          {!showSignUp && <button onClick={() => setShowSignUp(true)}>Sign Up</button>}
          {showSignUp && <SignUp onSignUp={handleSignUp} />}
        </>
      )}
      <AboutUsModal isOpen={showAboutUsModal} onRequestClose={() => setShowAboutUsModal(false)} />
    </div>
  );
};

export default App;
