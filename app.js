if(process.env.NODE_ENV !== 'production') {
require('dotenv').config({quiet: true});
}
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsMate = require('ejs-mate');
app.engine("ejs", ejsMate);
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const user = require("./models/user.js");

const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto : {
        secret: process.env.SECRET
    },
    touchAfter: 24*3600,
})

store.on('error',()=>{
   console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expire : Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 day
        maxAge: 1000 * 60 * 60 * 24 * 7, //
        httpOnly: true, // Helps prevent XSS attacks
       // secure: false // Set to true if using HTTPS
    }
    };


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash('success');
    res.locals.errorMsg = req.flash('error');
    res.locals.currentUser = req.user; // Make currentUser available in all views
    next();
});

const listingRoutes = require('./routes/listing.js');
const reviewRoutes = require('./routes/review.js');
const userRoutes = require('./routes/user.js');
const searchRoutes = require('./routes/search.js');
const expressError = require('./utils/expressError.js');
const mongoose = require('mongoose');
main().then(()=>{
    console.log('Connected to MongoDB');
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.ATLASDB_URL );

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.use('/listings', listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use('/', userRoutes);
app.use('/search', searchRoutes);


app.use((req, res, next) => {
    next(new expressError(404,'Page Not Found'));
});

app.use((err,req, res,next) => {
    let {status = 500,message="Something went wrong"} = err;
    res.status(status).render('error.ejs', { status, message });
    console.log(err);
});
app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
});
