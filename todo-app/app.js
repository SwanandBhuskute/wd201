/* eslint-disbale-next-line no-unused vars */
// const {request, response} = require('express')
const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.get("/todos", (response) => {
  response.send("hello world");
  // console.log("Todo list")
});

app.post("/todos", async (request, response) => {
  console.log("Creating a todo", request.body);
  //Todo
  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json();
  }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {
  console.log("We have to update a todo with ID: ", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updateTodo = await todo.markAsCompleted();
    return response.json(updateTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json();
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
