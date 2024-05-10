import React from 'react';
import { handleChange } from './common';

export default function Todo({ todo, toggleTodo, taskChange }) {
	const [selectedOption, setSelectedOption] = React.useState(todo.type || '');
	const [isComplete, setIsComplete] = React.useState(todo.complete || null);
	const [dueDate, setDueDate] = React.useState(new Date().toLocaleDateString());

	const handleChange = (event) => {
		setSelectedOption(event.target.value);
		console.log('task data:', todo.id, event.target.value, todo.name, dueDate);
		taskChange(todo.id, event.target.value, todo.name, dueDate);
	};

	const toggleComplete = (event) => {
		console.log('Todo.js, isComplete: ', event.target.checked);
		setIsComplete(event.target.checked);
		toggleTodo(todo.id, event.target.checked);
	};

	const setDate = (event) => {
		setDueDate(event.target.value);
		todo.due = dueDate;
	};

	return (
		<div className='tasklist'>
			<input
				name='complete'
				type='checkbox'
				checked={isComplete ? true : false}
				onChange={toggleComplete}
			/>

			{todo.name}

			<select name='type' value={selectedOption} onChange={handleChange}>
				<option value='work'>Work</option>
				<option value='personal'>Personal</option>
			</select>

			<input name='pvm' type='date' value={dueDate} onChange={setDate} />
		</div>
	);
}
