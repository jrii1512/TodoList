import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css'
export default function TaskList({
	taskit,
	showNOK,
	showAll,
	selectedOption,
	handleType,
	notCompleted,
	editDue,
	editToggle,
	removeCompletedTask,
}) {
	return (
		<div>
			{taskit.length > 0 && <h3>Taskit </h3>}

			<div className='tasklist--buttons'>
				<select name='type' value={selectedOption} onChange={handleType}>
					<option value='work'>Duuni</option>
					<option value='personal'>Oma</option>
				</select>
			</div>

			{taskit.find(({ complete }) => complete === false) && (
				<button onClick={showNOK} onDoubleClick={showAll}>
					Hoidetut / hoitamattomat
				</button>
			)}

			{!notCompleted
				? taskit.map((t) => (
						<div key={uuidv4()} className='tasklist'>
							{t.type === selectedOption && (
								<>
									<label>{t.name}</label>

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

									<label>
										Hoidettu
										<input
											key={uuidv4()}
											type='checkbox'
											name='editComplete'
											onChange={(event) =>
												editToggle(t.id, event.target.checked)
											}
											checked={t.complete}
										/>
									</label>

									<button
										style={{
											marginLeft: '1000px',
											marginTop: '-10px',
											width: '50px',
										}}
										key={uuidv4()}
										onClick={() => removeCompletedTask(t.id)}
									>
										X
									</button>
								</>
							)}
						</div>
				  ))
				: notCompleted.map((h) => (
						<div key={uuidv4()} className='tasklist'>
							<p></p>
							<label>{h.name}</label>
							<p></p>
							<label>
								Hoidettu
								<input
									key={uuidv4()}
									type='checkbox'
									name='editComplete'
									onChange={(event) => editToggle(h.id, event.target.checked)}
									checked={h.complete}
								/>
							</label>

							<label>
								Deadline
								<input
									style={{ marginLeft: '5px' }}
									type='date'
									key={uuidv4()}
									value={h.due}
									onChange={(event) => editDue(h.id, event.target.value)}
								/>
							</label>
						</div>
				  ))}
		</div>
	);
}
