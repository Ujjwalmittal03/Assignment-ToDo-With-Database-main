const express = require("express");
const fs = require("fs");
const multer = require("multer");
const app = express();
const upload = multer({ dest: 'uploads/' })
var session = require("express-session");
const db = require("./models/db");
const UserModel = require("./models/User");
const TodoDataModel = require("./models/TodoData");
const { error } = require("console");

//-------------------middleware----------------------------
app.set("view engine", "ejs")
app.use(express.static("assets"))
app.use((request, response, next) => {
  console.log(request.method, request.url);
  next();
})
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(session({
  secret: 'This is a secure key',
  resave: true,
  saveUninitialized: true,
}))

//----------------------html--------------------------
app.get("/", function (request, response) {
  if (request.session.isLoggedin) {
    response.render("index", { username: request.session.username })
    return;
  }
  response.redirect("/login")
})
app.get("/login", function (request, response) {
  if (request.session.isLoggedin) {
    response.redirect("/")
    return
  }
  response.render("login", { error: null })
})
app.get("/signup", function (request, response) {
  if (request.session.isLoggedin) {
    response.redirect("/")
    return;
  }
  response.render("signup", { error: null })

})

app.get("/about", function (request, response) {
  if (request.session.isLoggedin) {
    response.render("about", { username: request.session.username })
    return;
  }
  response.redirect("/login")
});
app.get("/contact", function (request, response) {
  if (request.session.isLoggedin) {
    response.render("contact", { username: request.session.username })
    return;
  }
  response.redirect("/login")
});
app.get("/todo", function (request, response) {
  if (request.session.isLoggedin) {
    response.render("todo", { username: request.session.username });
    return;
  }
  response.redirect("/login");
});
app.get("/user", function (req, response) {
  const user = req.session.username;
  response.status(200);
  response.json(user);
});
app.get("/logout", function (request, response) {
  if (request.session.isLoggedin) {
    request.session.destroy(function (error) {
      if (error) {
        response.status(500)
        response.send("Something went wrong please try later")
      }
      else {
        response.render("logout")
      }
    })
    return;
  }
  response.redirect("/login")
});
//-----------------------css-------------------------
//  app.get("/css/style-index.css",function(request,response){
//      response.sendFile(__dirname+"/css/style-index.css")
//  });
//  app.get("/css/style-about.css",function(request,response){
//      response.sendFile(__dirname+"/css/style-about.css")
//  });
//  app.get("/css/style-contact.css",function(request,response){
//      response.sendFile(__dirname+"/css/style-contact.css")
//  });
//  app.get("/css/style-login.css",function(request,response){
//      response.sendFile(__dirname+"/css/style-login.css")
//  });
//  app.get("/css/style-todo.css",function(request,response){
//      response.sendFile(__dirname+"/css/style-todo.css")
//  });
//  app.get("/css/style-signup.css",function(request,response){
//      response.sendFile(__dirname+"/css/style-signup.css")
//  });
//---------------------js---------------------------
// app.get("/js/todo.js",function(request,response){
//      response.sendFile(__dirname+"/js/todo.js")
//  });
//-----------------------------------------------------------------------------


//------------------------------------------------------------------------------
app.post("/login", function (request, response) {
  const username = request.body.username;
  const password = request.body.password;
  UserModel.findOne({username:username}).then(function(user){
    if(!user){
      response.render("login", { error: "Invalid username or password" })
    }
    else{
      if(user.password === password){
        request.session.isLoggedin = true;
        request.session.username = username;
        response.redirect("/")
      }
      else{
        response.render("login", { error: "Invalid username or password" })
      }
    }
  })
  .catch(function(error){
    response.render("login", { error: error});
  })
  // fs.readFile("user.gif", "utf-8", function (error, data) {
  //   if (error) {
  //     response.status(500)
  //     response.send()
  //   }
  //   else {
  //     try {
  //       if (data.length === 0) {
  //         response.render("login", { error: "Invalid username or password" })
  //         return;
  //       }
  //       let users = JSON.parse(data)

  //       const user = users.find(function (user) {
  //         return user.username === username && user.password === password
  //       })
  //       if (user) {
  //         request.session.isLoggedin = true;
  //         request.session.username = username;
  //         response.redirect("/")
  //         return;
  //       }
  //       else {
  //         response.render("login", { error: "Invalid username or password" })
  //       }


  //     }
  //     catch (error) {
  //       console.log(error)

  //     }
  //   }
  // })

})
//-------------------------------------------------------------------------------
app.post("/signup", function (request, response) {
  const username = request.body.username;
  const email = request.body.email;
  const password = request.body.password;
  UserModel.findOne({ username: username }).then(function (user) {
    if (user) {
      response.render("signup", { error: "Username is already used" })
    }
    else{
      UserModel.findOne({ email: email }).then(function (user) {
        if (user) {
          response.render("signup", { error: "Email is already used" })
        }
        else{
          let user = { username: username,  email: email,  password: password }
          UserModel.create(user).then(function(user){
          response.redirect("login");
        })
        }
      })
    }
  })
  .catch(function(error){
    response.render("signup", { error: error});
  })

    // fs.readFile("./user.gif", "utf-8", function (error, data) {

    //     if (error) {
    //         response.status(403)
    //         response.send()
    //     }
    //     else {
    //         if (data.length === 0) {
    //             data = "[]"
    //         }
    //         try {
    //             let arr = JSON.parse(data)
    //             const already_present_email = arr.find(function (name) {
    //                 return name.email === email;
    //             })
    //             const already_present_user = arr.find(function (name) {
    //                 return name.username === username;
    //             })

    //             if (already_present_email) {
    //                 response.render("signup", { error: "Email address is already present" })
    //             }
    //             else {
    //                 if (already_present_user) {
    //                     response.render("signup", { error: "Username is already taken" })
    //                 }
    //                 else {
    //                     arr.push(user)
    //                     fs.writeFile("user.gif", JSON.stringify(arr), function (error) {
    //                         if (error) {
    //                             console.log(error)
    //                         }
    //                         else {
    //                             response.redirect("/login")
    //                         }
    //                     })
    //                 }
    //             }
    //         }
    //         catch (error) {
    //             console.log(error)
    //         }
    //     }
    // })
})


//-------------------------------------------------------------------------
app.get("/todos", function (request, response) {
  const name = request.query.name;

  getTodos(name, false, function (error, todos) {
    if (error) {
      response.status(500);
      response.json({ error: error });
    } else {
      response.status(200);
      response.json(todos);
    }
  });
});
//-------------------------------------------------------------------------
app.post("/todo", upload.single("image"), function (request, response) {
  let todo = JSON.parse(request.body.todo);
  const image = request.file;
  todo.imageName = image.filename;
  saveTodos(todo, function (error) {
    if (error) {
      response.status(500);
      response.json({ error: error });
    } else {
      response.status(200);
      response.send();
    }
  });
});
//--------------------------------------------------------------------------
app.delete("/todo",async function (request, response) {
  const todo = request.body;
  const todoItem = await TodoDataModel.findOne({text:todo.text})
  const path = __dirname + "/uploads/" + todoItem.imageName;
          fs.unlink(path, function (error) {
            console.log(error)
          })
  TodoDataModel.deleteOne(todoItem).then(function(){
    response.status(200);
    response.send();
  })
  .catch(function(error){
    response.status(500);
    response.json({ error: error })
  })

  // getTodos(null, true, function (error, todos) {
  //   if (error) {
  //     response.status(500);
  //     response.json({ error: error });
  //   } else {
  //     const filteredTodos = todos.filter(function (todoItem) {
  //       if (todoItem.text === todo.text) {
  //         const path = __dirname + "/uploads/" + todoItem.imageName;
  //         fs.unlink(path, function (error) {
  //           console.log(error)
  //         })
  //       }
  //       return todoItem.text !== todo.text;
  //     });

  //     fs.writeFile(
  //       "./todos.mp4",
  //       JSON.stringify(filteredTodos),
  //       function (error) {
  //         if (error) {
  //           response.status(500);
  //           response.json({ error: error });
  //         } else {
  //           response.status(200);
  //           response.send();
  //         }
  //       }
  //     );
  //   }
  // });
});
//------------------------------------------------------------------------- 
function getTodos(username, all, callback) {
  if(all){
    TodoDataModel.find({}).then(function(todos){
      callback(null,todos)
    }).catch(function(error){
      callback(error);
    })
  }
  else{
    TodoDataModel.find({createdBy:username}).then(function(todos){
      callback(null,todos);
    })
    .catch(error=>{
      callback(error);
    });
  }

  // fs.readFile("./todos.mp4", "utf-8", function (error, data) {
  //   if (error) {
  //     callback(error);
  //   } else {
  //     if (data.length === 0) {
  //       data = "[]";
  //     }

  //     try {
  //       let todos = JSON.parse(data);

  //       if (all) {
  //         callback(null, todos);
  //         return;
  //       }

  //       const filteredTodos = todos.filter(function (todo) {
  //         return todo.createdBy === username;
  //       });

  //       callback(null, filteredTodos);
  //     } catch (error) {
  //       callback(null, []);
  //     }
  //   }
  // });
}

//----------------------------------------------------------------------------------

function saveTodos(todo, callback) {
  // const todos_json =JSON.stringify(todo);
  TodoDataModel.create(todo).then(function(todos){
    callback();
  }).catch(function(error){
    callback(error);
  }) 
  // getTodos(null, true, function (error, todos) {
  //   if (error) {
  //     callback(error);
  //   } else {
  //     todos.push(todo);

  //     fs.writeFile("./todos.mp4", JSON.stringify(todos), function (error) {
  //       if (error) {
  //         callback(error);
  //       } else {
  //         callback();
  //       }
  //     });
  //   }
  // });
}
//------------------------------------------------------------------------------------
app.post("/img",async function (request, response) {
  const todo = request.body;
  try{
    const todo_data = await TodoDataModel.findOne({text:todo.text,createdBy:todo.createdBy});
    const image = todo_data.imageName;
    response.status(200)
    response.json(image);
  }catch(error){
    if(error){
      response.status(500)
      response.json({error:error});
    }
  }
  // getTodos(null, true, function (error, todos) {
  //   if (error) {
  //     response.status(500);
  //     response.json({ error: error });
  //   } else {
  //     const image = todos.filter(function (todoItem) {
  //       if (todoItem.text === todo.text && todoItem.user === todo.user) {
  //         return todoItem.imageName;
  //       }
  //     });
  //     response.status(200);
  //     response.json(image[0].imageName);
  //   }
  // });
});
//---------------------------------------------------------------------------------------------
app.post("/change",async function (request, response) {
  const todo = request.body;
  try{
    const todo_data = await TodoDataModel.findOne({text:todo.text,createdBy:todo.createdBy});
    if(todo_data.iscompleted){
      await TodoDataModel.findOneAndUpdate(todo_data,{iscompleted:false});
    }
    else{
      await TodoDataModel.findOneAndUpdate(todo_data,{iscompleted:true});
    }
  }catch(error){
    response.status(500);
    response.json({error:error});
  }
  // getTodos(null, true, function (error, todos) {
  //   if (error) {
  //     response.status(500);
  //     response.json({ error: error });
  //   } else {
  //     const newtodolist = todos.filter(function (todoItem) {
  //       if (todoItem.text === todo.text && todoItem.createdBy === todo.createdBy) {
  //         if (todoItem.iscompleted === false) {
  //           todoItem.iscompleted = true;
  //           return todoItem;
  //         } else {
  //           todoItem.iscompleted = false;
  //           return todoItem;
  //         }
  //       }
  //       return todoItem;
  //     });
  //     fs.writeFile("todos.mp4", JSON.stringify(newtodolist), function (error) {
  //       if (error) {
  //         response.status(500);
  //         response.json({ error: error });
  //       } else {
  //         response.status(200);
  //         response.send();
  //       }
  //     });
  //   }
  // });
});

//-----------------------------------------------------------------------------
app.get("*", function (request, response) {
  response.render("404")
})
db.init().then(function () {
  app.listen(8000, function () {
    console.log("Server is running successfully on port 8000");
  })
});
