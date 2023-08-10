const http = require("http");
const fs = require("fs");
const readline = require("readline")

const lineDetail = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let homeContent = "";
let projectContent = "";
let registrationContent = "";

fs.readFile("home.html", (err, home) => {
  if (err) {
    throw err;
  }
  homeContent = home;
});

fs.readFile("project.html", (err, project) => {
  if (err) {
    throw err;
  }
  projectContent = project;
});

fs.readFile("registration.html", (err, registration) => {
  if (err) {
    throw err;
  }
  registrationContent = registration;
});


lineDetail.question(`node index.js --port `, (name) => {
    const port = parseInt(name);
    
    http
    .createServer((request, response) => {
        let url = request.url;
        response.writeHeader(200, { "Content-Type": "text/html" });
        switch (url) {
            case "/project":
                response.write(projectContent);
                response.end();
                break;
            case "/registration":
                response.write(registrationContent);
                response.end();
                break;
            default:
                response.write(homeContent);
                response.end();
                break;
                    }
                })
                .listen(port, () => {
                    console.log(`node index.js --port ${port}`);
                });
});

