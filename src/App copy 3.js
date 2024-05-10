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
	const [selectedOption, setSelectedOption] = useState('personal');
	const [isComplete, setIsComplete] = useState(false);
	const [editComplete, setEditComplete] = useState(false);
	const [dueDate, setDueDate] = useState(new Date().toLocaleDateString());
	const todoNameRef = useRef();

	const today = moment();

	console.log('taskit: ', taskit);

	const handleTask = async () => {
		const name = todoNameRef.current.value;
		if (name === '' || name === null) {
			console.log('name is empty');
		} else {
			const newItem = {
				id: uuidv4(),
				name: name,
				type: selectedOption,
				complete: isComplete,
				due: dueDate,
			};

			const response = await axios.post(
				`http://localhost:3852/taskit`,
				newItem
			);
			console.log('post response: ', response);
			console.log('Objecti: ', newItem);
			setTodo(newItem);
		}
		todoNameRef.current.value = null;
		console.log('todos: ', todos);
	};

	//const removeCompleted = (newTodos) =>{' '}
	//{removeCompletedFromJson(newTodos)}

	const handleType = (event) => {
		console.log('Option: ', event.target.value);
		setSelectedOption(event.target.value);
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

	const toggleComplete = (event) => {
		console.log('complete: ', event.target.checked);
		setEditComplete(event.target.checked);
	};

	const setDate = (event) => {
		console.log('due: ', event.target.value);
		setDueDate(event.target.value);
	};

	const editToggle = async (id, event) => {
		setIsComplete(event.target.checked);
		const response = await axios.patch(`http://localhost:3852/${id}`, {
			complete: isComplete,
		});
		console.log('response:', response);
	};
	return (
		<div className='todo'>
			<h3>Taskari</h3>
			<input ref={todoNameRef} type='text' style={{ padding: '10px' }} />

			<input
				name='complete'
				type='checkbox'
				checked={isComplete ? true : false}
				onChange={toggleComplete}
			/>

			<select name='type' value={selectedOption} onChange={handleType}>
				<option value='work'>Work</option>
				<option value='personal'>Personal</option>
			</select>

			<input name='pvm' type='date' value={dueDate} onChange={setDate} />

			<div className='buttonList'>
				<button onClick={handleTask}>Add a new task</button>
			</div>

			<div className='section'>
				<h3>Taskit </h3>
				<table style={{ padding: '10px', border: '1px solid' }}>
					<thead>
						<tr>
							<th>Taski</th>
							<th>Status</th>
							<th>Mennessä</th>
						</tr>
					</thead>

					{taskit.map((t) => (
						<tbody key={t.id}>
							<tr>
								<td style={{ marginRight: '10px' }}>{t.name}</td>

								<td style={{ marginRight: '10px' }} onChange={editToggle}>
									<nav>{t.complete ? 'tehty' : 'ei tehty'}</nav>
								</td>

								<td style={{ marginLeft: '10px' }}>{t.due}</td>
							</tr>
						</tbody>
					))}
				</table>
			</div>
		</div>
	);
}

export default App;
