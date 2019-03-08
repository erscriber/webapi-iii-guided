const express = require('express');

const router = express.Router();

// pretend these are actually db files!
const messageModel = {};
const hubModel = {};


router.post('/api/messages', async (req, res) => {
	const newMessage = req.body;

	if(newMessage.text && newMessage.hub_id) {
		try {
			const hub = await hubModal.findById(newMessage.hub_id);
			if (hub) {
				const newMessage = await messageModel.insert(newMessage);
				res
					.status(201)
					.json(savedMessage);
			}
			else {
				res
					.status(400)
					.json({ err: 'hub_id is invalid' });
			}
			
		}
		catch (e) {
			res
				.status(500)
				.json({ err: 'failed to save message' });
		}
	}
	else {
		res
			.status(400)
			.json({ err: 'message missing text or hub_id' });
	}
});

module.exports = router;