// Express server with SQLite for candidates, images, and admin CRUD. REST API endpoints for frontend integration.
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`Backend server running on http://localhost:${PORT}`);
});