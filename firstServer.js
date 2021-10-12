const express = require("express"); //설치한 라이러브러리를 첨부
const app = express(); //첨부한 라이브러리를 이용해 객체 만들기

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const MongoClient = require("mongodb").MongoClient;
const { response } = require("express");
MongoClient.connect(
  "mongodb+srv://mango:mango@cluster0.s6g7j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  (error, client) => {
    if (error) {
      return console.log(error);
    }
    //database 접속이 완료되면 내부코드 실행해줘

    // let db;

    // db = client.db("todoapp"); //todoapp이라는 database(폴더)에 연결한것  (폴더 = database)

    // db.collection("post").insertOne(
    //   { 이름: "mango", 나이: 24 },
    //   (error, result) => {
    //     console.log("저장완료되고 실행된 콜백함수야");
    //   }
    // ); //todoapp폴더에 post라는 파일에 저장 (파일 = collection)
    // //저장될 데이터 형식은 무조건 객체여야함

    // //==client.db('todoapp').collection('post').insertOne(추가할 자료, 콜백함수)

    app.listen(8080, function () {
      console.log("안녕 ! 8080");
    });
    //xx경로로 들어오면 xx를 실행해줘

    app.post("/app", (request, response) => {
      console.log(request.body);
      const { title, detail } = request.body;

      client
        .db("todoapp")
        .collection("post")
        .insertOne({ title: title, detail: detail }, (error, result) => {
          console.log("저장완료");
        });

      response.send("전송완료");
    });

    // /list, get요청으로 접속하면 실제 db data를 가져와보자
    app.get("/list", (request, response) => {
      client
        .db("todoapp")
        .collection("post")
        .find()
        .toArray((error, result) => {
          console.log(result);
          response.render("list.ejs", { MangoPosts: result });
        }); //Data다 찾을거다 .find.toArray()
      //   response.render("list.ejs");
    });
  }
);

// app.listen(8080, function () {
//   console.log("안녕 ! 8080");
// });

// //xx경로로 들어오면 xx를 실행해줘

//누군가가 /pet으로 방문을 하면 pet관련된 안내문을 띄어주자
app.get("/pet", function (request, response) {
  response.send("pet용품을 쇼핑할 수 있는 페이지야");
});

app.get("/pet2", function (request, response) {
  response.send("pet용품 2222");
});

//누군가가 8080으로 방문을 하면
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

// sendFile() 함수를 쓰면 파일을 보낼 수 있다
// __dirname은 현재 파일의 경로를 뜻함

app.get("/write", function (request, response) {
  response.sendFile(__dirname + "/write.html");
});

//어떤 사람이 /add 경로로 post 요정을 했을떄
// app.post("/add", (request, response) => {
//   console.log(request.body);
//   const { title, detail } = request.body;

//   response.send("전송완료");
// });
