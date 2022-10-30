const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

morgan.token('data', (req, res) => {  
    if(Object.keys(req.body).length === 0){
        return '-';
    }
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));


let persons = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Phonebook Backend</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {    
    const id = Number(request.params.id);        
    const person = persons.find(person => {        
        return person.id === id;
    });
    
    if (person) {
        response.json(person);
    } else {        
        response.status(404).end();
    }
});

app.get('/info', (request, response) => {
    response.write(`<p>Phonebook has info for ${persons.length} people</p>`);
    response.write(`<p>${new Date()}</p>`);
    response.end();
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
};

app.post('/api/persons', (request, response) => {
    const body = request.body;

    const names = persons.map(person => person.name);   
    
    
    if(!(body.name && body.number)){
        return response.status(400).json({
            error: 'name or phone number missing'
        });
    }

    if(names.find(name => name === body.name)){
        return response.status(400).json({
            error: 'name must be unique'
        });
    }

    const person = {
        id: getRandomInt(1000000),
        name: body.name,
        number: body.number,
    };    

    persons = persons.concat(person);
    response.json(person);
});

const PORT =  process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});