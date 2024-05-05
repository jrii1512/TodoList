import { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
import TodoList from './TodoList';
import { v4 as uuidv4 } from 'uuid';
import { handleChange, removeCompletedFromJson } from './common';
import moment from 'moment';

function App() {
	const [todos, setTodo] = useState([]);
	const [newTodos, setNewTodos] = useState([]);
	const [status, setStatusUpdate] = useState(false);
	const todoNameRef = useRef();

	const today = moment();

	//Read from the json server
	useEffect(() => {
		axios.get('http://localhost:3852/taskit').then((response) => {
			console.log('json data: ', response.data);
			setTodo(response.data);
		});
	}, [status]);

	const addTask = () => {
		const name = todoNameRef.current.value;
		const newItems = [...todos];
		newItems.push({
			id: uuidv4(),
			name: name,
			complete: false,
			due: new Date().toLocaleDateString(),
		});

		if (name === '' || name === null) {
			return;
		} else {
			console.log('Update todos');
			setTodo(newItems);
		}
		todoNameRef.current.value = null;
		console.log('addTask - funkkarin, todos: ', todos);
	};

	const handleEventChange = (id, data) => {
		handleChange(id, data, todos);
		setStatusUpdate(true);
	};

	//Remove completed tasks from the view and and from the file, from the file only what is completed..
	const clearTasks = () => {
		console.log('Poista tehdyt');
		const newTodos = todos.filter((todo) => !todo.complete);
		const completedTodos = todos.filter((todo) => todo.complete);
		console.log('newTodos: ', newTodos);
		//setTodo(newTodos);

		const isDataRemoved = completedTodos.map((i) =>
			removeCompletedFromJson(i.id)
		);
		console.log('remove repsp: ', isDataRemoved);
	};

	//const removeCompleted = (newTodos) => {removeCompletedFromJson(newTodos)}

	const onSubmit = () => {
		console.log('New todos: ', todos);
		axios
			.post(`http://localhost:3852/taskit`, todos)
			.then((response) => {
				console.log('axios post response: ', response);
				setNewTodos(null); // Tarvitaanko?
			})
			.catch((err) => {
				console.log('Meni aivan vituiksi, error: ', err);
			});
	};

	return (
		<div className='form todo'>
			<input ref={todoNameRef} type='text' style={{ padding: '10px' }} />
			<div className='buttonList'>
				<button onClick={addTask}>Lisää taski</button>
				<button onClick={clearTasks}>Poista tehdyt</button>
			</div>

			<div className='section'>
				{todos.length > 0 && <h3>Taskit</h3>}
				<TodoList
					key={uuidv4()}
					todos={todos}
					submit={onSubmit}
					toggleTodo={handleEventChange}
					taskTypeChange={handleEventChange}
				/>
			</div>
		</div>
	);
}

export default App;
