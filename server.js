
var express = require("express");
var app=express();
const flash = require("express-flash");
app.use(flash());
var session = require('express-session');
var mongoose = require('mongoose');

app.use(session({ cookie: { maxAge: 60000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false}))


mongoose.connect('mongodb://localhost/mongoose_dashboard_db');

var MongoSchema = new mongoose.Schema({
    name:{type: String, required:true, minlength:3},
    age:{type:Number,required:true,maxlength:2},
    id:{type:Number,unique:true,required:true,maxlength:2}
},{timestamps: true})

mongoose.model("Mongo",MongoSchema);
var Mongo = mongoose.model('Mongo');


var bodyParser= require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));

var path= require("path");

app.use(express.static(path.join(__dirname,"/static")));

app.set('views',path.join(__dirname,'/views'));

app.set('view engine','ejs');




app.post('/mongoose/:id?',function(req,res){
    console.log("in edit");
    Mongo.update({id:req.params.id},{name:req.body.name,age:req.body.age},function(err,mongo){
        if(err){
            console.log("Err Grabbing for Edit")
            res.redirect('/')

        }
        else{
            console.log("Found")
            
            
            
            res.redirect('/')
            
        }
    })
})

app.get('/mongoose/:id?',function(req,res){
    console.log(req.params.id);
    Mongo.find({id:req.params.id},function(err,mongo){
     if(err){
         console.log("Err Grabbing for ")
         res.redirect('/');       
     }
     else{
         console.log("looking up mongo for detail")
         res.render('edit',{mongo:mongo[0]})
 
      }
           
     });
    
 
 })

app.get('/details/:id?',function(req,res){
    console.log(req.params.id)
    Mongo.find({id:req.params.id},function(err,mongo){
        if(err){
            console.log("Details find mongo err")
            res.redirect('/');
        }
        else{
            console.log("Found Mongo")
            
            res.render('details',{mongo:mongo[0]});
        }
    })
})
app.get('/distroy/:id?',function(req,res){
    console.log(req.params.id)

    Mongo.remove({id:req.params.id},function(err){
        if(err){
            console.log("remove err")
            res.redirect('/');
        }
        else{
            console.log("Remove success")
            res.redirect('/');
        }
    })
})
app.get('/',function(req,res){
    
    
   Mongo.find({},function(err,mongos){
       if(err){
           console.log("Grabbing Error")
           res.render('index');       
       }
       else{
           console.log("looking up mongos")
           res.render('index',{mongos:mongos})
       }

   })
    
        
      
})


app.get('/mongoose1/new',function(req,res){
    console.log("adding mongoose")
    res.render('new');
    
    
})


app.post('/addMongoose',function(req,res){
    var mongo = new Mongo({name:req.body.name,age:req.body.age,id:req.body.id})
    mongo.save(function(err){
        if(err){
            console.log("flash Error"+err)
            
            for(var key in err.errors){
                req.flash('registration', err.errors[key].message);
            }
            console.log("Wrong here Error")
            res.redirect('/mongoose/new');

        }
        else{
            console.log("mongo added");
            res.redirect('/');
        }
    })

})






app.listen(5001,function(){
    console.log("listining on port 5000");
})
