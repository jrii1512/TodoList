import { useState, useRef } from 'react';
import './App.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { removeCompletedFromJson } from './common';
import moment from 'moment';
import JsonData from './todos.json';
import Taskari from './Taskari';
import TaskList from './TaskList';

function App() {
	let { taskit } = JsonData; //Destruct tasks from the Json file

	const [todos, setTodo] = useState([]);
	const [selectedOption, setSelectedOption] = useState('personal');

	const [editComplete, setEditComplete] = useState(null);
	const today = moment();
	const [dueDate, setDueDate] = useState(getToday());
	const [editDate, setEditDate] = useState('');
	const [notCompleted, setNotCompleted] = useState();
	const [render, setRender] = useState(false);
	const todoNameRef = useRef();
	let lines = [];
	let currentLne = '';
	let hoitamattomat = [];

	function getToday() {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	const handleType = async (event) => {
		setSelectedOption(event.target.value);
	};

	const handleTask = async () => {
		const name = todoNameRef.current.value;
		if (name === '' || name === null) {
		} else {
			const newItem = {
				id: uuidv4(),
				name: name,
				type: selectedOption,
				due: dueDate,
				created: new Date().toLocaleDateString()
			};

			const response = await axios.post(
				`http://localhost:3852/taskit`,
				newItem
			);

			setTodo(newItem);
		}
		todoNameRef.current.value = null;
	};

	const setDate = (event) => {
		setDueDate(event.target.value);
	};

	const editToggle = async (id, event) => {
		const response = await axios.patch(`http://localhost:3852/taskit/${id}`, {
			complete: event,
		});

		window.location.reload();
	};

	const editDue = async (id, due) => {
		const response = await axios.patch(`http://localhost:3852/taskit/${id}`, {
			due: due,
		});
	};

	const removeCompletedTask = (id) => {
		removeCompletedFromJson(id);
	};

	//Not in use
	function wrapText(text, width) {
		const words = text.split(',');
		let currentLine = '';

		words.forEach((word) => {
			if (currentLine.length + word.length <= width) {
				currentLine += (currentLine ? ' ' : '') + word;
			} else {
				lines.push(currentLine);
				currentLine = word;
			}
		});

		if (currentLine) {
			lines.push(currentLine);
		}

		return lines.join('\n');
	}

	const clearTextArea = () => {
		todoNameRef.current.value = '';
	};

	const startTimer = () => {
		setTimeout(clearTextArea, 300000);
	};

	taskit.forEach((f) => {
		return f.name.length > 20 ? wrapText(f.name, 20) : f.name;
	});

	const showNOK = () => {
		hoitamattomat = taskit.filter((a) => !a.complete);

		setNotCompleted(hoitamattomat);
	};

	const showAll = () => {
		setNotCompleted(taskit);
	};

	return (
		<div className='app'>
			<Taskari
				selected={selectedOption}
				handleType={handleType}
				name={todoNameRef}
				timer={startTimer}
				due={dueDate}
				setDate={setDate}
				task={handleTask}
			/>

			<TaskList
				taskit={taskit}
				showNOK={showNOK}
				showAll={showAll}
				handleType={handleType}
				notCompleted={notCompleted}
				selectedOption={selectedOption}
				editDue={editDue}
				editToggle={editToggle}
				removeCompletedTask={removeCompletedTask}
			/>
		</div>
	);
}

export default App;
