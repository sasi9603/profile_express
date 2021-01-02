const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const multer = require('multer');
const bodyParser= require('body-parser');
const Handlebars = require('handlebars');
//create express application with help of express function();
const app =express();
// create a mongodb database

require('./Model/Profile');
const Profile = mongoose.model('profile');

const mongodbUrl="mongodb+srv://profileapp:12345@cluster0-yfyam.mongodb.net/test?retryWrites=true&w=majority"

mongoose.connect(mongodbUrl, {useUnifiedTopology:true, useNewUrlParser:true},err=>{
    if (err) throw err;
console.log("mongodb is connected")
  
 } );



//settemplate engigne middleware
app.engine("handlebars",exphbs());
app.set("view engine","handlebars");



//serving static files
app.use(express.static(__dirname + "/public"));

Handlebars.registerHelper('trimString', function(passedString) {
    var theString = [...passedString].splice(6).join("");
    return new Handlebars.SafeString(theString)
 });

//multer
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/uploads')
    },
    filename:function(req,res,cb){
        cb(null,Date.now() + file.originalname)
    }
});
const upload = multer({storage:storage});
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    // res.send("home.handlebars");
    res.render("home.handlebars")
});
//cal add profile form route get route


app.get("/profile/addprofile",(req,res)=>{
    res.render("profile/addprofile");
});

app.get('/profile/userprofile',(req,res)=>{
    Profile.find({}).then(profile=>{
        res.render('profile/userprofile',{
            profile:profile
        })
    }).catch(err=> console.log(err))
});



app.post('/profile/addprofile',upload.single('photo'),(req,res)=>{
    const errors=[];
    if(!req.body.name){
        errors.push({text:'name is required'})
    }
    if(!req.body.phonenumber){
        errors.push({text:'phonenumber is required'})
    }
    if(!req.body.company){
        errors.push({text:'company is required'})
    }
    if(!req.body.location){
        errors.push({text:'location is required'})
    }
    if(!req.body.education){
        errors.push({text:'education is required'})
    }
    if(errors.length>0)
    {
        res.render('/profile/addprofile'),{
        errors:errors,
        name: req.body.name,
        phonenumber:req.body.phonenumber,
        company:req.body.company,
        location:req.body.location,
        education:req.body.education
        }
    }else{
        const newProfile= {
              photo:req.file,
              name:req.body.name,
              phonenumber:req.body.phonenumber,
              company:req.body.company,
              location:req.body.location,
              education:req.body.education
        }
        new Profile(nawProfile)
        .save()
        .then(profile=>{
            console.log(profile);
            res.redirect('/')
        })
        .catch(err => console.log(err));
    }
})



//last page not found route
app.get("**",(req,res)=>{
    res.render("404.handlebars");
});

//create port and server
const port  = process.env.PORT || 5000;
app.listen(port,(err)=>{
    if(err)throw err;
    console.log(`app listening on port ${port}!`);
})