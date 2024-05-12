import React from 'react'

export default function Taskari({selected, handleType, name, timer, due, setDate, task}) {
    console.log(
			'Taskari kompo: ',
			selected,
			handleType,
			name,
			setDate,
			due,
			timer,
			task
		);

     
  return (
		<div>
			<h3>Taskari</h3>
			<form className='form'>
				<select name='type' value={selected} onChange={handleType}>
					<option value='work'>Duuni</option>
					<option value='personal'>Oma</option>
				</select>

				<textarea
					rows='3'
					cols='40'
					ref={name}
					style={{ padding: '10px' }}
					placeholder='Taski'
					onFocus={timer}
				/>

				<input name='pvm' type='date' value={due} onChange={setDate} />

				<div className='buttonList'>
					<button onClick={task}>Add a new task</button>
				</div>
			</form>
		</div>
	);
}
