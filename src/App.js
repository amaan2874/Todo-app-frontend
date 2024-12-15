import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]); // State to store todos
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const [newTodo, setNewTodo] = useState({ title: "", description: "" }); // State for new todo input
  const [editingTodo, setEditingTodo] = useState(null); // State to track todo being edited

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/getTodo");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const json = await response.json();
      console.log(json);

      if (json.sucess && Array.isArray(json.data)) {
        setTodos(json.data);
      } else {
        setTodos([]);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/v1/createTodo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await fetchData();
      setNewTodo({ title: "", description: "" });
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/deleteTodo/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await fetchData();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setNewTodo({ title: todo.title, description: todo.description });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingTodo) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/updateTodo/${editingTodo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await fetchData();
      setEditingTodo(null);
      setNewTodo({ title: "", description: "" });
    } catch (e) {
      setError(e.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTodo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <h1 className="app-header">Amaan's Todo App</h1>

      {/* Todo creation form */}
      <form onSubmit={editingTodo ? handleUpdate : handleSubmit} className="todo-form">
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={newTodo.title}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={newTodo.description}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          {editingTodo ? "Update Todo" : "Create Todo"}
        </button>
      </form>

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">Error: {error}</p>}
      {!loading && !error && todos.length === 0 && <p>No data available.</p>}

      <div className="todo-list">
        {!loading &&
          !error &&
          todos.map((item) => (
            <div key={item._id} className="todo-item">
              <strong>Title:</strong> {item.title}
              <br />
              <strong>Description:</strong> {item.description}
              <div className="todo-buttons">
                <button onClick={() => handleEdit(item)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => handleDelete(item._id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
