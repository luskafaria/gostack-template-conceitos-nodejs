const express = require('express');
const cors = require('cors');

const { uuid } = require('uuidv4');

const app = express();

//validation middleware
function verifyRepositoryExists(req, res, next) {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Respository not found' });
  }

  return next();
}

//helper
function getIndex(id) {
  return repositories.findIndex((repository) => repository.id === id);
}

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', verifyRepositoryExists);

const repositories = [];

app.get('/repositories', (request, response) => {
  const { title } = request.query;

  const results = title
    ? repositories.filter((repository) => repository.title === title)
    : repositories;

  return response.json(results);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;
  const id = uuid();
  const likes = 0;

  const repository = { id, title, url, techs, likes };
  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = getIndex(id);

  const { likes } = repositories[repositoryIndex];
  const { title, url, techs } = request.body;

  repositories[repositoryIndex] = { id, title, url, techs, likes };

  return response.json(repositories[repositoryIndex]);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = getIndex(id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = getIndex(id);

  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
