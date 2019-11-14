const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser');
// Connect to mongoose
const mongoose = require('mongoose');
// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useUnifiedTopology: true,    
useNewUrlParser: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

const path = require('path');
app.use(express.static(path.join(__dirname, '/public')));


// Handlebar's Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

// How middleware works
        // app.use(function (req, res, next){
        //     console.log(date);
        //     next();
        // });

// Index Route
app.get('/', (req, res) => {
    const title = 'Welcome Andrew';
    
    res.render('index', {
        title: title
    });
}); 

// About Route
app.get('/about', (req, res) => {
    res.render('about');
});

// Add Idea Form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

// Process Form
app.post('/ideas',(req, res) => {
    let errors = [];

    if(!req.body.title){
        errors.push({text: 'please add a title'});
    }
    if(!req.body.details){
        errors.push({text: 'Please add some details'});
    }

    if(errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }
    else {
        res.send('passed');
    }
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});