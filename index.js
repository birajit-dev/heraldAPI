const express = require('express');
const exphbs = require('express-handlebars');
const cors = require('cors');
//var sassMiddleware = require('node-sass-middleware')
var path = require('path');
const app = express();
const sessions = require('express-session');
const routes = require('./server/routes/allroute');
var bodyParser = require('body-parser');


const oneDay = 1000 * 60 * 60 * 24;

// Enable CORS for all routes
app.use(cors());

app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    
    helpers: {
        todaysDate:(date) => new Date(date),   
        helpers: require(__dirname +"/public/javascripts/helpers.js").helpers,

      },
    extname: '.hbs'
  }));

app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Security and Performance Headers
app.use((req, res, next) => {
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Performance headers
    if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year for static assets
    } else if (req.url.includes('/xml/') || req.url.includes('robots.txt') || req.url.includes('sitemap')) {
        res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour for sitemaps
    } else {
        res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes for pages
    }
    
    next();
});
//console.log( __dirname + '/public/scss');
// app.use(
//   sassMiddleware ({
//       src: __dirname + '/public/scss', 
//       dest: __dirname + '/public',
//       debug: true,       
//   })
// );   
app.use(express.static(path.join(__dirname, 'public')));





app.use('/', routes);
app.use('*', (req, res) => {
    res.status(404).render('404', {
        pageTitle: 'Page Not Found - Northeast Herald',
        pageDescription: 'The page you are looking for could not be found.',
        pageKeyword: 'northeast herald, tripura news, page not found'
    });
  });




// port where app is served
app.listen(8085, () => {
    console.log('The web server has started on port 4000');
});