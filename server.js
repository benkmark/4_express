const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

/*************** DEFINITION von html Partials ******************/
// um häufig verwendete Codeteile wiederzuverwenden
hbs.registerPartials(__dirname + '/views/partials');
/***************DEFINITION von html Partials ******************/

/*************** DEFINITION eigener Methoden ******************/
// registerHelper ermöglicht es Methoden zu definieren, die man innerhalb der {{}}
// aufrufen kann, um z.B. doppelten Code zu vermeiden
// 1. Argument Name 2. Argument fn()
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('methodUpperCase', (text) => {
  return text.toUpperCase();
});
/*************** DEFINITION eigener Methoden ******************/

// 0. all functions from the method express() are put to variable app
let app = express();

// 1. Define the url endpoints
let home = '/';
let about = '/about';

// 2. View Engine setting to handlebars, Attention app.set
// using a dynamic template engine like hbs, ejs or pug etc.
app.set('view engine', 'hbs');


/*************** DEFINITION der Middleware mit app.use ******************/
// Middleware with app.use with next() with Attention
// BEachte die Reihenfolge (!)
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {

// res.render('error.hbs'); // sonst sieht man bur noch diese Seite !
  next(); // muss immer am Ende stehen bei einer Fn! OHNE next sieht man nur diese SEITE
 });


// Error functions oder andere Fn definiern wie hier ein Logging
app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `${now}: ${req.method} und ${req.url} kann man sich alles in expressjs anzeigen lassen, was alles in req steckt`
  console.log(now);
  console.log(`${now}: yeah andere Schreibweise`);

  // log file mit fs
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('UNable to use server.log file!')
    }
  })


  next(); // muss immer am Ende stehen bei einer Fn!
});


/*************** DEFINITION der Middlewar mit app.use ******************/

// 2. GET Requests
app.get(home, (req, res) => {
  // res.send('<h1>Hello rulers!</h1>');
  res.render('home.hbs', {
      pageTitle: 'Home Page',
      welcomeMessage: 'Hello Dudes!'//,  siehe hbs.registerHelper oben
      //currentYear: new Date().getFullYear()
  });
});

app.get(about, (req, res) => {
  // res.send('<h1>Hello this is the about page!</h1>');
  // Einbau von handlebarsjs, nach dem eigentlichen Fiel können
  // die dynamischen Werte übergeben werden als Key Value Pairs, die
  // dann als Werte in {{}} aufgerufen werden können
  res.render('about.hbs', {
      pageTitle: 'About Page'//,  siehe hbs.registerHelper oben
      // currentYear: new Date().getFullYear()
  });
});





app.listen(port, () => {
  console.log(`Heroku changes the port dynamically =>> Server is up and running on port ${port}`)
});
