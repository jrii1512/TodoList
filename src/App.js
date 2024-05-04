import { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
import TodoList from './TodoList';
import { v4 as uuidv4 } from 'uuid';
import { handleChange } from './common';

function App() {
	const [todos, setTodo] = useState([]);
	const [newTodos, setNewTodos] = useState([]);
	const [status, setStatusUpdate] = useState(false);
	const todoNameRef = useRef();

	//Read from the json server
	useEffect(() => {
		axios.get('http://localhost:3852/taskit').then((response) => {
			console.log('json data: ', response.data);
			setTodo(response.data);
		});
	}, [status]);

	const addTask = (e) => {
		const name = todoNameRef.current.value;
		console.log('Todos:', todos);
		if (name === '') {
			return;
		} else {
			setNewTodos({ id: uuidv4(), name: name, complete: false });
		}
		todoNameRef.current.value = null;
	};

	const toggleTodo = (id) => {
		console.log('Toggle checkbox id:', id);
		const newTodos = [...todos]; // Create a copy to which you need to make modifications.
		const todo = newTodos.find((todo) => todo.id === id);
		todo.complete = !todo.complete;
		setTodo(newTodos);
	};

	const handleEventChange = (id, data) => {
		handleChange(id, data, todos);
		setStatusUpdate(true);
	};

	const clearTasks = () => {
		console.log('Poista tehdyt');
		const newTodos = todos.filter((todo) => !todo.complete);
		console.log('newTodos: ', newTodos);
		setTodo(newTodos);
		onSubmit();
	};

	const onSubmit = () => {
		console.log('New todos: ', newTodos);
		const response = axios
			.post(`http://localhost:3852/taskit`, newTodos)
			.then((response) => {
				console.log('axios post response: ', response.data);
				setNewTodos(null);
			})
			.catch((err) => {
				console.log('Meni aivan vituiksi, error: ', err);
			});
	};

	return (
		<div className='form'>
			<input ref={todoNameRef} type='text' />
			<button onClick={addTask}>Lisää taski</button>
			<button onClick={onSubmit}>Tallena</button>
			<button onClick={clearTasks}>Poista tehdyt</button>

			<TodoList
				key={uuidv4()}
				todos={todos}
				submit={onSubmit}
				toggleTodo={handleEventChange}
				taskTypeChange={handleEventChange}
			/>
		</div>
	);
}

export default App;
