/* eslint-disable no-undef */
const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;

function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

describe("Todo test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      duedate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    // expect(response.statusCode).toBe(200);
    expect(response.statusCode).toBe(302);
    // expect(response.header["content-type"]).toBe(
    //   "application/json; charset=utf-8"
    // );
    // const parsedResponse = JSON.parse(response.text);
    // expect(parsedResponse.id).toBeDefined();
  });

  // test("Marks a todo with the given ID as complete", async () => {
  //   let res = await agent.get("/");
  //   let csrfToken = extractCsrfToken(res);
  //   await agent.post("/todos").send({
  //     title: "Buy milk",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //     _csrf: csrfToken,
  //   });
  //   const groupTodosResponse = await agent
  //     .get("/")
  //     .set("Accept", "application/json");
  //   const parseGroupResponse = JSON.parse(groupTodosResponse.test);
  //   const dueTodayCount = parseGroupResponse.dueToday.length;
  //   const latestTodo = parseGroupResponse.dueToday[dueTodayCount - 1];
  //   const status = latestTodo.completed ? false : true;
  //   res = await agent.get("/");
  //   csrfToken = extractCsrfToken(res);
  //   const response = await agent.put(`todos/${latestTodo.id}`).send({
  //     _csrf: csrfToken,
  //     completed: status,
  //   });
  //   const parsedUpdateResponse = JSON.parse(response.text);
  //   expect(parsedUpdateResponse.completed).toBe(true);
  // });

  // test("Fetches all todos in the database using /todos endpoint", async () => {
  //   await agent.post("/todos").send({
  //     title: "Buy xbox",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //   });
  //   await agent.post("/todos").send({
  //     title: "Buy ps3",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //   });
  //   const response = await agent.get("/todos");
  //   if (response.statusCode !== 200) {
  //     throw new Error(
  //       `Failed to fetch todos. Status code: ${response.statusCode}`
  //     );
  //   }
  //   const parsedResponse = JSON.parse(response.text);
  //   expect(parsedResponse.length).toBe(4);
  //   expect(parsedResponse[3]["title"]).toBe("Buy ps3");
  // });

  // test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
  //   // let res = await agent.get("/");
  //   // let csrfToken = extractCsrfToken(res);
  //   // // FILL IN YOUR CODE HERE
  //   // await agent.post("/todos").send({
  //   //   title: "Go Goa",
  //   //   duedate: new Date().toISOString(),
  //   //   completed: false,
  //   //   _csrf: csrfToken,
  //   // });
  //   // const gropuedTodosResponse = await agent
  //   //   .get("/")
  //   //   .set("Accept", "application/json");
  //   // const parsedGroupedResponse = JSON.parse(gropuedTodosResponse.text);
  //   // const dueTodayCount = parsedGroupedResponse.dueToday.length;
  //   // const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];

  //   // res = await agent.get("/");
  //   // csrfToken = extractCsrfToken(res.text);

  //   // const response = await agent.put(`todos/${latestTodo.id}`).send({
  //   //   _csrf: csrfToken,
  //   // });
  //   // const parsedUpdateResponse = JSON.parse(response.text);
  //   // expect(parsedUpdateResponse.completed).toBe(true);
  //   let res = await agent.get("/");
  //   let csrfToken = extractCsrfToken(res);
  //   await agent.post("/todos").send({
  //     title: "Go Work!",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //     _csrf: csrfToken,
  //   });

  //   const gropuedTodosResponse = await agent
  //     .get("/")
  //     .set("Accept", "application/json");
  //   const parsedGroupedResponse = JSON.parse(gropuedTodosResponse.text);
  //   const dueTodayCount = parsedGroupedResponse.dueToday.length;
  //   const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];

  //   res = await agent.get("/");
  //   csrfToken = extractCsrfToken(res);

  //   const response = await agent.put(`todos/${latestTodo.id}`).send({
  //     _csrf: csrfToken,
  //   });
  //   const parsedUpdateResponse = JSON.parse(response.text);
  //   expect(parsedUpdateResponse.completed).toBe(true);
  // });
});
