import { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
import TodoList from './TodoList';
import { v4 as uuidv4 } from 'uuid';
import { handleChange, removeCompletedFromJson } from './common';
import moment from 'moment';
import JsonData from './todos.json';

function App() {
	const [todos, setTodo] = useState([
		{ id: 0, name: 'test', complete: false, due: '2025-05-30' },
	]);
	const [status, setStatusUpdate] = useState(false);
	const todoNameRef = useRef();

	const today = moment();

	/*Read from the json server
	useEffect(() => {
		axios.get('http://localhost:3852/taskit').then((r) => {
			console.log('json data r.data: ', r.data);
			r.data.map((d) => {
				setTodo(d);
			});
		});
	}, []);
*/
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

			console.log('Your new item: ', newItem);

			const newArray = [...todos, newItem];
			console.log('Apps, newArray: ', newArray);
			setTodo((prev) => [...prev, newItem]);
			console.log('Apps, todos: ', todos);

			todoNameRef.current.value = null;
			console.log('addTask - funkkarin, todos: ', todos);
			onSubmit();
		}
	};

	const handleEventChange = (id, data, name, due) => {
		console.log(
			'Apps, handleEventChange: ',
			id + ', ' + data + ', ' + name + ', ' + due
		);
		handleChange(id, data, todos, name, due);
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
	/*
				{todos && (
					<TodoList
						key={uuidv4()}
						todos={todos}
						submit={onSubmit}
						toggleTodo={handleEventChange}
						taskChange={handleEventChange}
					/>
				)}

*/
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
			<input ref={todoNameRef} type='text' style={{ padding: '10px' }} />
			<div className='buttonList'>
				<button onClick={addTask}>Add a new task</button>
				<button onClick={clearTasks}>Remove completed ones</button>
			</div>

			<div className='section'>
				<h3>Tasks </h3>

				{JsonData.map((j) => (
					<table>
						<tbody>
							<tr>
								<td>{j.id}</td>
								<td>{j.name}</td>
								<td>{j.complete}</td>
								<td>{j.due}</td>
							</tr>
						</tbody>
					</table>
				))}
			</div>
			{todos.length > 0 && <button onClick={onSubmit}>Save</button>}
		</div>
	);
}

export default App;
