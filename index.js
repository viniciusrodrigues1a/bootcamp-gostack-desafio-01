const express = require('express');

app = express();
app.use(express.json());

const projects = [];
const requisitionsMade = 0;

function checkProjectInArray(req, res, next) {
  const { id } = req.params;

  let project;

  projects.forEach(element => {
    if (element.id === id) {
      project = element;
    }
  })

  if (project) {
    req.project = project;
    return next();
  }

  return res.status(400).json({ message: 'Project doesn\'t exists!' });
}

function countRequisitionsMade(req, res, next) {
  requisitionsMade += 1;
  console.log(`${requisitionsMade} requisition(s) made until now!`)
  return next();
}

app.use(countRequisitionsMade);

app.get('/projects', (req, res) => {
  return res.json(projects);
});

app.post('/projects', (req, res) => {
  const { id, title } = req.body;

  projects.push({
    id: id.toString(),
    title,
    tasks: [],
  });

  return res.json(projects);
});

app.post('/projects/:id/tasks', checkProjectInArray, (req, res) => {
  const { title } = req.body;
  const { project } = req;

  project.tasks.push(title);

  return res.json(project);
})

app.put('/projects/:id', checkProjectInArray, (req, res) => {
  const { title } = req.body;
  const { project } = req;

  project.title = title;

  return res.json(project);
});

app.delete('/projects/:id', checkProjectInArray, (req, res) => {
  const { project } = req;

  projects.splice(projects.indexOf(project), 1);

  return res.json({ message: 'Removed with success!' });
});


app.listen(3000);
