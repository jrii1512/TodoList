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

	const [editComplete, setEditComplete] = useState(null);

	const [dueDate, setDueDate] = useState(new Date().toLocaleDateString());
	const [editDate, setEditDate] = useState('');
	const todoNameRef = useRef();
	let lines = [];
	let currentLne = '';
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

	const handleType = (event) => {
		console.log('Option: ', event.target.value);
		setSelectedOption(event.target.value);
	};

	const setDate = (event) => {
		console.log('due: ', event.target.value);
		setDueDate(event.target.value);
	};

	const editToggle = async (id, event) => {
		console.log('editToggle: ', id + ', ' + event);
		setEditComplete(event);
		const response = await axios.patch(`http://localhost:3852/taskit/${id}`, {
			complete: event,
		});
		console.log('response:', response);
	};

	const editDue = async (id, due) => {
		console.log(id, due);
		const response = await axios.patch(`http://localhost:3852/taskit/${id}`, {
			due: due,
		});
		console.log('response:', response);
	};

	const removeCompletedTask = (id) => {
		removeCompletedFromJson(id);
	};

	//Not in use
	function wrapText(text, width) {
		console.log('wrap start text ', text + ', ' + width);
		const words = text.split(',');
		let currentLine = '';

		words.forEach((word) => {
			console.log(word);
			if (currentLine.length + word.length <= width) {
				currentLine += (currentLine ? ' ' : '') + word;
				console.log('currentLine: ', currentLine);
			} else {
				lines.push(currentLine);
				currentLine = word;
			}
		});

		if (currentLine) {
			lines.push(currentLine);
		}

		console.log('wrap end, lines: ', lines);
		return lines.join('\n');
	}

	taskit.forEach((f) => {
		return f.name.length > 20 ? wrapText(f.name, 20) : f.name;
	});
	return (
		<div>
			<h3>Taskari</h3>
			<form className='form'>
				<input ref={todoNameRef} type='text' style={{ padding: '10px' }} />

				<input name='pvm' type='date' value={dueDate} onChange={setDate} />

				<div className='buttonList'>
					<button onClick={handleTask}>Add a new task</button>
				</div>
			</form>

			<div>
				{taskit.length > 0 && <h3>Taskit </h3>}

				<select name='type' value={selectedOption} onChange={handleType}>
					<option value='work'>Work</option>
					<option value='personal'>Personal</option>
				</select>

				{taskit.map((t) => (
					<div key={uuidv4()} className='jsonfile'>
						{t.type === selectedOption && (
							<>
								<label>
									<strong>{t.type}</strong>
								</label>
								<p></p>
								<label>{t.name}</label>
								<p></p>
								<label>
									Deadline
									<input
										style={{ marginLeft: '5px' }}
										type='date'
										key={uuidv4()}
										value={t.due}
										onChange={(event) => editDue(t.id, event.target.value)}
									/>
								</label>
								<p></p>
								<label>
									Hoidettu
									<input
										key={uuidv4()}
										type='checkbox'
										name='editComplete'
										onChange={(event) => editToggle(t.id, event.target.checked)}
										checked={editComplete === null ? t.complete : editComplete}
									/>
									<button
										style={{ marginLeft:'800px', width: '50px' }}
										key={uuidv4()}
										onClick={() => removeCompletedTask(t.id)}
									>
										X
									</button>
								</label>
							</>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export default App;
