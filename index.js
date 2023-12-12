const express = require("express");
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const path = require("path");
const {v4:uuidv4} = require('uuid');
const app = express();
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.listen(8080,()=>{
  console.log("app is listening at port 8080");
})

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password:'454545'
   });
   let  createRandomUser = ()=> {
    return [
     faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
     
    ];
  }
  // insert new data
  // let q  = "INSERT INTO user(id,username,email,password) VALUES? ";
 
  // let data  = [];
  // for(let i = 1;i<=100;i++){
  //   data.push(createRandomUser()); //100 fake user
  // }

  // connection.query(q,[data],(err,result)=>{
  //  try{
  //   if(err){
  //       throw err;
  //   }
  //   console.log(result);
  //  }
  //  catch(err){
  //   console.log(err);
  //  }
    
    
  // });
  




  //Home route to show data
  app.get("/",(req,res)=>{
    let q  = "SELECT count(*)FROM user";
  try{
 connection.query(q,(err,result)=>{
  if(err) throw err;
  let count = result[0]['count(*)'];
  res.render("home.ejs",{count});
  console.log(result[0]['count(*)']);
  // res.send(result);
 });
  }
  catch(err){
    res.send("some error occurred");
  }

  });

app.get('/users',(req,res)=>{
  let q  = "SELECT *FROM user";
  try{
 connection.query(q,(err,result)=>{
  if(err) throw err;
  let users= result;
  res.render("users.ejs",{users});
  // console.log(data);
  // res.send(result);
 });
  }
  catch(err){
    res.send("some error occurred");
    console.log(err);
  }
})

//Edit Username
app.get("/user/:id/edit",(req,res)=>{
  let {id}= req.params;
  // console.log(id);
  let q = `SELECT * FROM user WHERE id = '${id}'`;

 
    try{
      connection.query(q,(err,result)=>{
        if(err) throw err;
       
        let user = result[0];
       res.render('edit',{user})

      });

    }
    catch(err){
      console.log(err);
      res.send(err);
    }
   
  });

  //Update Route 
  app.patch('/users/:id',(req,res)=>{
    let {id } = req.params;
    let {username:newusername,password:formpassword} = req.body;
    let q = `SELECT * FROM user WHERE id = '${id}'`;

 
    try{
      connection.query(q,(err,result)=>{
        if(err) throw err;
       
        let user= result[0];
        console.log(user.password);
        if(formpassword !=user.password){
          res.send("wrong password");
        }
        else{
            
          let q2 = `UPDATE user SET username ='${newusername}' WHERE id = '${id}'`;
          connection.query(q2,(err,result)=>{
              if(err) throw err;
             
              res.redirect('/users');
          })
        
        }

  
      });

    }
    catch(err){
      console.log(err);
      // console.log(err);
     
    }
   
  });
    
 
 //new user
 app.get("/user/new",(req,res)=>{
  res.render("new");
 });

 //Add user
 app.post('/user',(req,res)=>{
     let id = uuidv4();
  let {email,username,password} = req.body;
  let user  = [id,username,email,password];
  let q  = "INSERT INTO user(id,username,email,password) VALUES (?,?,?,?) ";
  connection.query(q,user,(err,result)=>{
   try{
    if(err){
        throw err;
    }
    res.redirect('/users');
   }
   catch(err){
    console.log(err);
   }
    
    
  });
 })


 ///Delete user
 app.get("/user/delete",(req,res)=>{
  res.render('delete');
 })

 //update DB
 app.put("/users",(req,res)=>{
  console.log(req.body);
  let {email,password} = req.body;
  let q = `DELETE  FROM user WHERE email = '${email}'`;

  connection.query(q,(err,result)=>{
    try{
     if(err){
         throw err;
     }
     console.log(result);
     res.redirect('/users');
    }
    catch(err){
     console.log(err);
    }
   });
 })