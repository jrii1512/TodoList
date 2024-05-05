import React from 'react';

export default function Todo({ todo, toggleTodo, taskTypeChange }) {
	const [selectedOption, setSelectedOption] = React.useState(todo.type || '');
	const [isComplete, setIsComplete] = React.useState(todo.complete || null);
	const [dueDate, setDueDate] = React.useState(new Date().toLocaleDateString());

	console.log('todo component: ', todo);

	const handleType = (event) => {
		setSelectedOption(event.target.value);
		console.log('Selected one is: ', event.target.value);
		taskTypeChange(todo.id, event.target.value);
	};

	const toggleComplete = (event) => {
		console.log('Todo.js, isComplete: ', event.target.checked);
		setIsComplete(event.target.checked);
		toggleTodo(todo.id, event.target.checked);
	};

	const setDate = (event) => {
		setDueDate(event.target.value);
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

			<input name='pvm' type='date' value={dueDate} onChange={setDate} />

			<select name='type' value={selectedOption} onChange={handleType}>
				<option value='work'>Work</option>
				<option value='personal'>Personal</option>
			</select>
		</div>
	);
}
