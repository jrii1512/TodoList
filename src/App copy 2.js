import { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
import TodoList from './TodoList';
import { v4 as uuidv4 } from 'uuid';
import { handleChange, removeCompletedFromJson } from './common';
import moment from 'moment';
import JsonData from './todos.json';

function App() {
	const { taskit } = JsonData; //Destruct tasks from the Json file
	const [todos, setTodo] = useState([]);
	const todoNameRef = useRef();

	const today = moment();

	console.log('taskit: ', taskit);

	const addTask = async () => {
		const name = todoNameRef.current.value;
		console.log('App, addTask, Name: ', name);
		if (name === '' || name === null) {
			console.log('name is empty');
			return;
		} else {
			const newItem = {
				id: uuidv4(),
				name: name,
				complete: false,
				due: new Date().toLocaleDateString(),
			}
			const response = await axios.post(`http://localhost:3852/taskit`, newItem);
			console.log('axios post response: ', response);
		}

		todoNameRef.current.value = null;
		//onSubmit();
	};

	const onSubmit = async () => {
		console.log('Submit, new todos: ', todos);
		todos.forEach((f) => {
			if (!f.name) {
				console.log("todos state doesn't have name...")
				return;
			}
		});
		const response = await axios.post(`http://localhost:3852/taskit`, todos);
		console.log('axios post response: ', response);
		setTodo(null);
	};

	//const removeCompleted = (newTodos) =>{' '}
	//{removeCompletedFromJson(newTodos)}

	const handleEventChange = (id, data, name, due) => {
		console.log(
			'Apps, handleEventChange: ',
			id + ', ' + data + ', ' + name + ', ' + due
		);
		handleChange(id, data, todos, name, due);
		//setStatusUpdate(true);
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

	return (
		<div className='todo'>
			<h3>The Tasker</h3>
			<input ref={todoNameRef} type='text' style={{ padding: '10px' }} />
			
			{todos && (
				<TodoList
					key={uuidv4()}
					todos={todos}
					submit={onSubmit}
					toggleTodo={handleEventChange}
					taskChange={handleEventChange}
				/>
			)}

			<div className='buttonList'>
				<button onClick={addTask}>Add a new task</button>
			</div>

			<div className='section'>
				<h3>Tasks </h3>

				<table>
					<thead>
						<tr>
							<th>id</th>
							<th>name</th>
							<th>status</th>
							<th>Mennessä</th>
						</tr>
					</thead>
					{taskit.map((t) => (
						<tbody key={t.id}>
							<tr>
								<td>{t.id}</td>
								<td>{t.name}</td>
								<td>{t.complete ? 'tehty' : 'ei tehty'}</td>
								<td>{t.due}</td>
							</tr>
						</tbody>
					))}
				</table>
				{todos}
			</div>
		</div>
	);
}

export default App;
