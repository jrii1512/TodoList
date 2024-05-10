import { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
import TodoList from './TodoList';
import { v4 as uuidv4 } from 'uuid';
import { handleChange, removeCompletedFromJson } from './common';
import moment from 'moment';
import JsonData from './todos.json';
import Example from "./Example"


function App() {
	const { taskit } = JsonData;

	const [todos, setTodo] = useState([]);
	const [status, setStatusUpdate] = useState(false);
	const todoNameRef = useRef();

	const today = moment();

	console.log('taskit: ', taskit);

	const addTask = () => {
		const name = todoNameRef.current.value;
		if (name === '' || name === null) {
			console.log('name is empty');
			return;
		} else {
			setTodo((pre) => ({
				taskit: [
					...pre.taskit,
					{
						id: uuidv4(),
						name: name,
						complete: false,
						due: new Date().toLocaleDateString(),
					},
				],
			}));
		}

		todoNameRef.current.value = null;
		console.log('Apps, addTask, todos: ', todos);
		onSubmit();
	};	

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

	return (
		<div className='todo'>
			<h3>The Tasker</h3>
			<input ref={todoNameRef} type='text' style={{ padding: '10px' }} />

			<div className='buttonList'>
				<button onClick={addTask}>Add a new task</button>
			</div>

			<div className='section'>
				<h3>Tasks </h3>

				<table>
					{taskit.taskit.map((t) => (
						<tbody key={t.id}>
							<tr>
								<td>{t.id}</td>
								<td>{t.name}</td>
								<td>{t.complete}</td>
								<td>{t.due}</td>
							</tr>
						</tbody>
					))}
				</table>
			</div>
		</div>
	);
}

export default App;
