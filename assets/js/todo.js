const todoTextNode = document.getElementById("new-todo");
const todoImage=document.getElementById("todo-image");
const addTodoButton = document.getElementById("add-todo");
var userName="";
(async function() {
  userName = await getUser();
  getTodos();
})();
addTodoButton.addEventListener("click", function (e) {
  e.preventDefault();
  const todoTextValue = todoTextNode.value;
  const imageValue = todoImage.files[0];
  if (todoTextValue ) {
    saveTodo(todoTextValue,imageValue, function (error) {
      if (error) {
        alert(error);
      } else {
        (async function() {
          try {
            const imageValue = await getImage(todoTextValue);
            addTodoToDOM(todoTextValue, false, imageValue);
            todoTextNode.value = "";
            todoImage.value = "";
          } catch (error) {
            console.error("Error:", error);
          }
        })();
      }
    });
  } else {
    alert("Please enter a todo");
  }
});
function saveTodo(todo,image, callback) {
  const formData = new FormData();
  formData.append("todo", JSON.stringify({"text": todo,"iscompleted":false,"createdBy":userName}));
  formData.append("image", image);
  fetch("/todo", {
    method: "POST",
    body: formData,
  }).then(function (response) {
    if (response.status === 200) {
      callback();
    } else {
      callback("Something went wrong");
    }
  });
}
function addTodoToDOM(todo,iscompleted,imgName) {
  const todoList = document.getElementById("todo-list");
  const todoItem = document.createElement("li");
  const todolabel = document.createElement("label");
  todolabel.innerText = todo;
  todolabel.style="font-size:20px;"
  const crosslabel = document.createElement("label");
  crosslabel.innerText = "X";
  crosslabel.style="float:right;padding-top:32px;margin-right:5px;"
  const checkbox = document.createElement("input");
  const image=document.createElement("img");
  image.src = imgName;
  image.style="width:2.5rem;height:2.5rem;margin:5px 1rem 0 1rem;border-radius:50%;border:1.5px solid black;";
  checkbox.type = "checkbox";
  checkbox.value="false";
  checkbox.style="float:right;margin:35px 5px 0 0;"
  if (iscompleted===true) {
    todolabel.style.textDecoration = "line-through";
    checkbox.value = "true";
    checkbox.checked =true;
  } else {
    todolabel.style.textDecoration = "none";
    checkbox.value = "false";
  }
  todoItem.appendChild(image);
  todoItem.appendChild(todolabel);
  todoItem.appendChild(crosslabel);
  todoItem.appendChild(checkbox);
  todoList.appendChild(todoItem);

  checkbox.addEventListener("change", function () {
    if (checkbox.value =="false"){
      todolabel.style.textDecoration = "line-through";
      checkbox.value = true;
    } else {
      todolabel.style.textDecoration = "none";
      checkbox.value = false;
    }
    changeStatus(todo, function (error) {
      if (error) {
        alert(error);
      }
    });
  });
  crosslabel.addEventListener("click", function () {
    deleteTodo(todo, function (error) {
      if (error) {
        alert(error);
      } else {
        todoList.removeChild(todoItem);
      }
    });
  });
}

function getTodos() {
  fetch("/todos?name=" + userName)
    .then(function (response) {
      if (response.status !== 200) {
        throw new Error("Something went wrong");
      }
      return response.json();
    })
    .then(function (todos) {
      todos.forEach(function (todo) {
        addTodoToDOM(todo.text,todo.iscompleted,todo.imageName);
      });
    })
    .catch(function (error) {
      alert(error);
    });
}


async function getUser() {
  try {
    const response = await fetch("/user");
    if (response.status !== 200) {
      throw new Error("Something went wrong");
    }
    const user = await response.json();
    return user;
  } catch (error) {
    alert(error);
  }
}
function changeStatus(todo, callback) {
  fetch("/change", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: todo, createdBy: userName }),
  }).then(function (response) {
    if (response.status === 200) {
      callback();
    } else {
      callback("Something went wrong");
    }
  });
}
async function getImage(todo) {
  try {
    const response = await fetch("/img", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: todo, createdBy: userName }),
    });

    if (response.status === 200) {
      const image = await response.json();
      return image;
    } else {
      alert("Something went wrong");
    }
  } catch (error) {
    console.error("Error fetching image:", error);
    alert("Error fetching image");
  }
}
function deleteTodo(todo, callback) {
  fetch("/todo", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: todo, createdBy: userName }),
  }).then(function (response) {
    if (response.status === 200) {
      callback();
    } else {
      callback("Something went wrong");
    }
  });
}