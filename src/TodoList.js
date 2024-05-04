import React from 'react';
import Todo from './Todo';

export default function TodoList({ todos, toggleTodo, taskTypeChange }) {
	console.log('taskTypeChange value: ', taskTypeChange);

	const typeChange = (id, optionValue) => {
		console.log('TodoList.js typeChange id: ', id + ', ' + optionValue);
		taskTypeChange(id, optionValue);
	};

	const changeTodo = (id, complete) => {
		console.log('TodoList.js: ', id + ', ' + complete);
		toggleTodo(id, complete);
	};

	return todos.map((todo) => (
		<Todo
			key={todo.id}
			todo={todo}
			toggleTodo={changeTodo}
			taskTypeChange={typeChange}
		/>
	));
}
