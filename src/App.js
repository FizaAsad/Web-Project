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
      <h2>Login to continue</h2>
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

const SignUp = ({ onSignUp, onRequestClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [existingUsernames, setExistingUsernames] = useState(
    JSON.parse(localStorage.getItem('usernames')) || []
  );

const handleSignUp = () => {
    if (!existingUsernames.includes(username)) {
      // Add a new username to the list of existing usernames in localStorage
      localStorage.setItem('usernames', JSON.stringify([...existingUsernames, username]));

      // Add user-specific data to localStorage
      localStorage.setItem(username, JSON.stringify([]));
      localStorage.setItem(`${username}_password`, password);

      setExistingUsernames([...existingUsernames, username]); // Update the state
      onSignUp(username);
      onRequestClose();

      // Inform the user that their account has been registered
      alert(`Account registered successfully! You can now sign in as ${username}.`);
    } else {
      alert('If you dont receive next confirm message, please use different name.');
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onRequestClose}
      contentLabel="Sign Up Modal"
      className="modal"
    >
      <div className="auth-form">
        <h2>Input proper username and password</h2>
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
    </Modal>
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
      <p>
        Welcome to Todolist - a collaborative project crafted by Fiza Asad and Shazaib Sheikh for our Web Engineering subject. Let us introduce ourselves:
      </p>
      <h3>Fiza Asad</h3>
      <p>Role: Frontend Developer<br/>
      Fiza is the creative force behind the frontend development of Todolist. With a passion for user interface design and a commitment to creating seamless user experiences, she brings the visual aspect of Todolist to life.</p>

      <h3>Shazaib Sheikh</h3>
      <p>Role: Backend Developer<br/>
      Shazaib is the technical architect responsible for the backend functionalities of Todolist. With a focus on data, he ensures that Todolist operates smoothly, handling the complexities behind the scenes.</p>

      <h3>Our Project - Todolist</h3>
      <p>
        Todolist is more than just a task management application; it's a product of collaboration, creativity, and dedication. Designed to simplify your daily tasks, Todolist allows you to organize, prioritize, and manage your to-dos efficiently.
      </p>
      <ul>
        <li><strong>Set deadlines.</strong></li>
        <li><strong>Remove all todos at once.</strong></li>
        <li><strong>Keep track of todos.</strong></li>
      </ul>

      
      <button onClick={onRequestClose}>Close</button>
    </Modal>
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
      alert('If you dont receive next confirm message, please use different name.');
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
      <header>
        <h1>Todolist</h1>
        {user && (
          <>
            <span>Hello, {user}!</span>
            <button className="sign-out" onClick={handleSignOut}>
              Sign Out
            </button>
          </>
        )}
        {!user && (
          <button className="about-us" onClick={() => setShowAboutUsModal(true)}>
            About Us
          </button>
        )}
      </header>
      {user ? (
        <>
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
        <SignIn onSignIn={handleSignIn} signingIn={signingIn} onShowSignUp={() => setShowSignUp(true)} />
      )}
      <AboutUsModal isOpen={showAboutUsModal} onRequestClose={() => setShowAboutUsModal(false)} />
      {showSignUp && <SignUp onSignUp={handleSignUp} onRequestClose={() => setShowSignUp(false)} />}
    </div>
  );
};

export default App;
