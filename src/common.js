import axios from 'axios';
import moment from 'moment';

export const handleChange = (id, data, todos) => {
	console.log('common.js, handleChange id: ', id + ', data:' + data);
	console.log('todos: ', todos);
	const today = moment();

	if (typeof data === 'object') {
		console.log('Due date: ', data);
		todos.forEach((f) => {
			if (f.id === id) {
				axios
					.patch(`http://localhost:3852/taskit/${id}/`, {
						due: data,
					})
					.then((u) => {
						console.log('Update, ', u.data);
					})
					.catch((err) => {
						console.error('Päivitys meni aivan vituiksi, err: ', err);
					});
			}
		});
	}

	if (typeof data === 'boolean') {
		data ? (data = false) : (data = true);
		console.log('Boolean data: ', !data);
		todos.forEach((f) => {
			if (f.id === id) {
				axios
					.patch(`http://localhost:3852/taskit/${id}/`, {
						complete: !data,
						updated: today,
					})
					.then((u) => {
						console.log('Update, checkbox is ', u.data.complete);
					})
					.catch((err) => {
						console.error('Päivitys meni aivan vituiksi, err: ', err);
					});
			}
		});
	} else {
		console.log('String data: ', data);
		console.log('String id: ', id);

		todos.forEach((f) => {
			if (f.id === id) {
				axios
					.patch(`http://localhost:3852/taskit/${id}/`, {
						type: data,
						updated: today,
					})
					.then((u) => {
						console.log('Update, type is ', u.data.type);
					})
					.catch((err) => {
						console.error('Päivitys meni aivan vituiksi, err: ', err);
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
