/* eslint-disbale-next-line no-unused vars */
/* eslint-disable no-undef */
const express = require("express");
const app = express();
const csrf = require("tiny-csrf");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const { Todo } = require("./models");

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: false }));

// Configure cookieParser with a secret
app.use(cookieParser("shh! some secret string"));

// Enable CSRF protection for specific HTTP methods
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

// Set the view engine to EJS
app.set("view engine", "ejs");

app.get("/", async (request, response) => {
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
  console.log("Creating new todo", request.body);
  try {
    // eslint-disable-next-line no-unused-vars
    await Todo.addTodo({
      title: request.body.title,
      duedate: request.body.duedate,
      completed: false,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async (request, response) => {
  console.log("We have to update a todo with ID:", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedTodo);
  } catch (err) {
    console.log(err);
    return response.status(422).json(err);
  }
});

app.delete("/todos/:id", async (request, response) => {
  console.log("Dlete a Todo with ID:", request.params.id);
  try {
    await Todo.remove(request.params.id);
    return response.json({ success: true });
  } catch (err) {
    return response.status(422).json(err);
  }
});

module.exports = app;
