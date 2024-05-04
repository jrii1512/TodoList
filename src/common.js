import axios from 'axios';

export const handleChange = (id, data, todos) => {
	console.log('common.js, handleChange id: ', id + ', data:' + data);
	console.log('todos: ', todos);

	if (typeof data === 'boolean') {
		data ? (data = false) : (data = true);
		console.log('Boolean data: ', data);
		todos.forEach((f) => {
			if (f.id === id) {
				axios
					.patch(`http://localhost:3852/taskit/${id}/`, {
						complete: !data,
					})
					.then((u) => {
						console.log('Update, checkbox is ', u.data.complete);
					})
					.catch((err) => {
						console.error('Päivitys meni aivan vituiksi');
					});
			}
		});
	} else {
		console.log('String data: ', data);
		todos.forEach((f) => {
			if (f.id === id) {
				axios
					.patch(`http://localhost:3852/taskit/${id}/`, {
						type: data,
					})
					.then((u) => {
						console.log('Update, type is ', u.data.type);
					})
					.catch((err) => {
						console.error('Päivitys meni aivan vituiksi');
					});
			}
		});
	}
};

export const removeCompletedFromJson = async (id) => {
	console.log('Trying to remaining completed tasks: ', id);

	await axios
		.delete(`http://localhost:3852/taskit/${id}/`, {
			headers: { 'Content-Type': 'application/json' },
		})
		.then((r) => {
			console.log('delete resp: ', r);
		});
};
