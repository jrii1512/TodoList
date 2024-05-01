import React from 'react';
import Todo from './Todo';
import axios from 'axios';

export default function TodoList({ todos, toggleTodo, submit }) {
	const [done, setDone] = React.useState(false);

	return todos.map((todo) => (
		<>
			<Todo key={todo.id} todo={todo} toggleTodo={() => toggleTodo(todo.id, todo.complete)} />
		</>
	));
}
