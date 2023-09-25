/* eslint-disbale-next-line no-unused vars */
/* eslint-disable no-undef */
const express = require("express");
const path = require("path");
const app = express();
const { Todo } = require("./models");
var csrf = require("tiny-csrf");
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secert string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");

app.get("/", async (request, response) => {
  // const all_Todos = await Todo.getTodos();
  // if (request.accepts("html")) {
  //   response.render("index", { all_Todos });
  // } else {
  //   response.json(all_Todos);
  // }
  const allTodos = await Todo.getTodos();
  const overdue = await Todo.overdue();
  const dueToday = await Todo.dueToday();
  const dueLater = await Todo.dueLater();
  const completedItems = await Todo.completedItems();

  if (request.accepts("html")) {
    response.render("index", {
      title: "Todo Application",
      allTodos,
      overdue,
      dueLater,
      dueToday,
      completedItems,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json(overdue, dueLater, dueToday, completedItems);
  }
});

app.get("/todos", async (_request, response) => {
  console.log("We have to fetch all the todos");
  try {
    const all_todos = await Todo.findAll();
    return response.send(all_todos);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/todos", async (_request, response) => {
  console.log("We have to fetch all the todos");
  try {
    const all_todos = await Todo.findAll();
    return response.send(all_todos);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async (request, response) => {
  // console.log("Creating a todo", request.body);
  // //Todo
  // try {
  //   const todo = await Todo.addTodo({
  //     title: request.body.title,
  //     duedate: request.body.duedate,
  //   });
  //   // return response.json(todo);
  //   return response.redirect("/");
  // } catch (error) {
  //   console.log(error);
  //   return response.status(422).json();
  // }
  console.log("Creating new todo", request.body);
  try {
    // eslint-disable-next-line no-unused-vars
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      commpleted: false,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async (request, response) => {
  // console.log("We have to update a todo with ID: ", request.params.id);
  // const todo = await Todo.findByPk(request.params.id);
  // try {
  //   const updateTodoToCompleted = await todo.markAsCompleted();
  //   return response.json(updateTodoToCompleted);
  // } catch (error) {
  //   console.log(error);
  //   return response.status(422).json();
  // }
  console.log("We have to update a todo with ID:", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedtodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedtodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async (request, response) => {
  // console.log("Delete a todo by ID: ", request.params.id)
  console.log("We have to delete a todo with ID: ", request.params.id);
  try {
    const dltTodo = await Todo.destroy({ where: { id: request.params.id } });
    response.send(dltTodo ? true : false);
  } catch (error) {
    console.log(error);
    return response.status(422).json();
  }
});

module.exports = app;
