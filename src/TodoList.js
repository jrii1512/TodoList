import React from 'react';
import Todo from './Todo';

export default function TodoList({ todos, toggleTodo, taskTypeChange }) {

	const typeChange = (id, optionValue) => {
		console.log('TodoList.js typeChange id: ', id + ', ' + optionValue);
		taskTypeChange(id, optionValue);
	};

	const changeTodo = (id, complete, name, due) => {
		console.log('TodoList.js: ', id + ', ' + complete + ', name ' + name + ', due ' + due) ;
		toggleTodo(id, complete, name, due);
	};

	return todos?.map((todo) => (
		<Todo
			key={todo.id}
			todo={todo}
			toggleTodo={changeTodo}
			taskTypeChange={typeChange}
		/>
	));
}
