const express               =  require('express'),
      app                   =  express(),
      mongoose              =  require("mongoose"),
      passport              =  require("passport"),
      bodyParser            =  require("body-parser"),
      LocalStrategy         =  require("passport-local"),
      passportLocalMongoose =  require("passport-local-mongoose"),
      path                  = require("path"),
      port                  = 80,
      User                  =  require("./models/registration");


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/patient_system", function(err, db) {
      if(!err) {
        console.log("We are connected");
      }
    });

// define mongoose schema
var contactSchema=new mongoose.Schema({
    name:String,
    phone:String,
    email:String,
    address:String,
    desc:String
});
var Contact = new mongoose.model('contact', contactSchema);

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded())


app.use(require("express-session")({
    secret:"Any normal Word",       //decode or encode session
    resave: false,          
    saveUninitialized:false    
}));
passport.serializeUser(User.serializeUser());       //session encoding
passport.deserializeUser(User.deserializeUser());   //session decoding
passport.use(new LocalStrategy(User.authenticate()));

app.use(bodyParser.urlencoded({ extended:true }))
app.use(passport.initialize());
app.use(passport.session());


// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory
 
// ENDPOINTS
app.get('/', (req, res)=>{
    const con = "This is the best content on the internet so far so use it wisely"
    const params = {}
    res.status(200).render('index.pug', params);
})

app.get('/contact', (req, res)=>{
    const con = "This is the best content on the internet so far so use it wisely"
    const params = {}
    res.status(200).render('contact.pug', params);
})
app.get('/symtoms', isLoggedIn,(req, res)=>{
    const con = "This is the best content on the internet so far so use it wisely"
    const params = {}
    res.status(200).render('symtoms.pug', params);
})
app.post('/symtoms', isLoggedIn,(req, res)=>{
    const con = "This is the best content on the internet so far so use it wisely"
    const params = {}
    if ((req.body.Fever!=undefined) && (req.body.dry_cough!=undefined) && (req.body.wet_cough!=undefined) && (req.body.headache!=undefined) && (req.body.difficulty_in_breathing!=undefined) && (req.body.chest_pain!=undefined)){
        if((req.body.severity1=='High') && (req.body.severity2=='Medium') && (req.body.severity3=='none') && (req.body.severity4=='Low') && (req.body.severity5=='High') && (req.body.severity6=='High') && (req.body.duration1=='3_days') && (req.body.duration2=='7_days') && (req.body.duration3=='none') && (req.body.duration4=='3_days') && (req.body.duration5=='7_days') && (req.body.duration6=='3_days')){
                res.status(200).render('covid.pug', params);
                console.log(req.body)
        }
        else if((req.body.severity1=='Medium') && (req.body.severity2=='none') && (req.body.severity3=='High') && (req.body.severity4=='Low') && (req.body.severity5=='Medium') && (req.body.severity6=='High') && (req.body.duration1=='7_days') && (req.body.duration2=='none') && (req.body.duration3=='3_days') && (req.body.duration4=='3_days') && (req.body.duration5=='3_days') && (req.body.duration6=='3_days')){
            res.status(200).render('pnemonia.pug', params);
            console.log(req.body)
        }
        else{
            res.status(200).render('unknown_disease.pug', params);
            console.log(req.body)
        }
    }
    else{
        res.status(200).render('unknown_disease.pug', params);
        console.log(req.body)
    }
})
app.post('/contact', (req, res)=>{
    const params = {}
    var myData = new Contact(req.body);
    console.log(myData)
    myData.save().then(()=>{
    res.status(200).render('', params);
    }).catch(err=>{
        console.log(err)
    res.status(200).render('', params);
    }); 
    });

app.get('/services', (req, res)=>{
    const con = "This is the best content on the internet so far so use it wisely"
    const params = {}
    res.status(200).render('services.pug', params);
})
app.get('/about', (req, res)=>{
    const con = "This is the best content on the internet so far so use it wisely"
    const params = {}
    res.status(200).render('about.pug', params);
})
app.get('/unknown_disease', isLoggedIn, (req, res)=>{
    const con = "This is the best content on the internet so far so use it wisely"
    const params = {}
    res.status(200).render('unknown_disease.pug', params);
})
app.get('/covid', isLoggedIn, (req, res)=>{
    const con = "This is the best content on the internet so far so use it wisely"
    const params = {}
    res.status(200).render('covid.pug', params);
})
app.get('/pnemonia', isLoggedIn, (req, res)=>{
    const con = "This is the best content on the internet so far so use it wisely"
    const params = {}
    res.status(200).render('pnemonia.pug', params);
})
app.get('/doctor', isLoggedIn, (req, res)=>{
    const con = "This is the best content on the internet so far so use it wisely"
    const params = {}
    res.status(200).render('doctor.pug', params);
})
app.get('/login', (req, res)=>{
    const con = "This is the best content on the internet so far so use it wisely"
    const params = {}
    res.status(200).render('login.pug', params);
})
app.post("/login",passport.authenticate("local",{
    successRedirect:"/symtoms",
    failureRedirect:"/login"
}),function (req, res){
    console.log("login");
});

app.get('/registration', (req, res)=>{
    const con = "This is the best content on the internet so far so use it wisely"
    const params = {}
    res.status(200).render('registration.pug', params);
});

app.post("/registration",(req,res)=>{
    
    User.register(new User({username: req.body.username,name:req.body.name,gender: req.body.gender,age: req.body.age}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("registration");
        }
        var myData = new User(req.body);
        //myData.save();
        console.log(myData);
        passport.authenticate("local")(req,res,function(){
        res.redirect("login");
    })    
    })
});

app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});

app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
});

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}