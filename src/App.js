import { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
import TodoList from './TodoList';
import { v4 as uuidv4 } from 'uuid';
import { handleChange, removeCompletedFromJson } from './common';
import moment from 'moment';

function App() {
	const [todos, setTodo] = useState([]);
	const [status, setStatusUpdate] = useState(false);
	const todoNameRef = useRef();

	const today = moment();

	//Read from the json server
	useEffect(() => {
		axios.get('http://localhost:3852/taskit').then((r) => {
			console.log('json data: ', r);
			setTodo(r.data);
		});
	}, []);

	const addTask = () => {
		const name = todoNameRef.current.value;
		if (name === '' || name === null) {
			console.log('name is empty');
			return;
		} else {
			const newItem = {
				id: uuidv4(),
				name: name,
				complete: false,
				due: new Date().toLocaleDateString(),
			};

			
			if (todos.length > 0) {
				todos.forEach((t) => {
					//Avoiding duplicates
					if (t.id !== newItem.id) {
						console.log('Adding new item on top of the existing');
						setTodo((prev) => [...prev, newItem]);
					}
				});
			} else {
				console.log('No previous so adding a new object to the array');
				console.log('Your new item: ', newItem);
				const newArray = []
				newArray.push(newItem)
				setTodo(newArray);
			}
			todoNameRef.current.value = null;
			console.log('addTask - funkkarin, todos: ', todos);
		}
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
		setTodo(newTodos);

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
				setTodo(null);
			})
			.catch((err) => {
				console.log('Meni aivan vituiksi, error: ', err);
			});
	};

	const toggleTodo = (id) => {
		console.log('Toggle checkbox id:', id);
		const newTodos = [...todos]; // Create a copy to which you need to make modifications.
		const todo = newTodos.find((todo) => todo.id === id);
		todo.complete = !todo.complete;
		setTodo(newTodos);
	};

	return (
		<div className='todo'>
			<h3>The Tasker</h3>
			<input
				ref={todoNameRef}
				type='text'
				value='test'
				style={{ padding: '10px' }}
			/>
			<div className='buttonList'>
				<button onClick={addTask}>Add a new task</button>
				<button onClick={clearTasks}>Remove completed ones</button>
			</div>

			<div className='section'>
				{todos && (
					<>
						{todos.length > 0 && (
							<>
								<h3>Tasks </h3>
								<TodoList
									key={uuidv4()}
									todos={todos}
									submit={onSubmit}
									toggleTodo={toggleTodo}
									taskTypeChange={handleEventChange}
								/>
							</>
						)}
					</>
				)}
			</div>
			{todos.length > 0 && <button onClick={onSubmit}>Save</button>}
		</div>
	);
}

export default App;
