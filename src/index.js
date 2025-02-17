const data = require("./data");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

const requestLogger = (request, response, next) => {
	console.log("Method:", request.method);
	console.log("Path:  ", request.path);
	console.log("Body:  ", request.body);
	console.log("---");
	next();
};

// const unknownEndpoint = (request, response) => {
// 	if (response.status === 404) {
// 		response.status(404).send({ error: "unknown endpoint" });
// 	}
// };

app.use(express.json());
app.use(requestLogger);
app.use(morgan("tiny"));
app.use(cors());
// app.use(unknownEndpoint);

app.get("/api/persons", (req, res) => {
	res.send(data);
});

//get total persons
app.get("/info", (req, res) => {
	res.send(`
		<div>
		    <p>Phonebook has info for ${data.length} people</p>
		    <p>${Date()}</p>
		</div>
		`);
});

app.get("/api/persons/:id", (req, res) => {
	const id = req.params.id;
	const person = data.find((person) => person.id === id);

	if (!person) {
		return res.status(404).json({
			message: `Person with id ${id} not found`,
		});
	}

	res.status(200).json({
		message: "Person is found",
		data: person,
	});
});

app.delete("/api/persons/:id", (req, res) => {
	const id = req.params.id;
	data.filter((data) => data.id !== id);

	res.status(204).json({
		message: "Item deleted",
		data,
	});
});

app.post("/api/persons", (req, res) => {
	const max = 1000000,
		min = 0;
	const generateId = () => Math.floor(Math.random() * (max - min + 1) + min);
	const newPerson = req.body;
	const nameExists = data.find((person) => person.name === newPerson.name);

	if (!nameExists) {
		if (newPerson.name && newPerson.number) {
			newPerson.id = generateId();
			res.send(data.concat(newPerson));
		} else {
			return res.status(400).json({
				error: "name and number are required",
			});
		}
	} else {
		return res.status(400).json({
			error: `name must be unique`,
		});
	}
});

app.listen(PORT, () => {
	console.log("app is live in port", PORT);
});
