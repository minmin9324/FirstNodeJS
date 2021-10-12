const express = require("express"); //설치한 라이러브러리를 첨부
const app = express(); //첨부한 라이브러리를 이용해 객체 만들기

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const MongoClient = require("mongodb").MongoClient;
const { response, request } = require("express");

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
      //누가 form에서 /add로 post요청을 하면

      const { title, detail } = request.body;

      client
        .db("todoapp")
        .collection("counter") //하낫만 찾을려면 findOne함수 사용 (쿼리문)
        .findOne({ name: "게시물 갯수" }, (error, result) => {
          client
            .db("todoapp")
            .collection("post")
            .insertOne(
              { _id: result.total + 1, title: title, detail: detail },
              (error, result) => {
                if (error) return console.log(error, "mango");

                client
                  .db("todoapp") //total id 값을 증가시키는 코드 => 글 발행을 완료되면 증가시키는 것이 좋다.=> 발행 뒤 실행되는 콜백함수(순차적으로 실행가능)에서 실행                  .db("todoapp")
                  .collection("counter")
                  .updateOne(
                    { name: "게시물 갯수" }, //name이 게시물 갯수인 객체를 찾아줌  바꾸고 싶은 것
                    { $inc: { total: 1 } }, // 바꿀 것  $set(변경),$inc(증가),$min(기존값보다 작을때 변경),$rename(key값 이름변경) 등등 $operate
                    (error, result) => {
                      if (error) return console.log(error);
                    }
                  );
              }
            );

          // set은 update하는 값을 정확히 넣어줘야하고 inc는 기존값에서 넣어준 값만큼 증가시킨다.
          // $ 표시 = operator 문법
          //set으로 한것
          // client
          //   .db("todoapp")
          //   .collection("counter")
          //   .updateOne(
          //     { name: "게시물 갯수" },
          //     { $set: { total: result.total + 1 } },
          //     (error, result) => {
          //       console.log("저장완료");
          //       if (error) return console.log(error);
          //     }
          //   );
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

    app.delete("/delete", (request, response) => {
      console.log(request.body);
      request.body._id = parseInt(request.body._id);
      client
        .db("todoapp")
        .collection("post")
        .deleteOne(request.body, (request, response) => {
          response.status(200).send({ message: "성공이야" });
        });
    });
    // app.get('/어쩌구', function(요청, 응답){
    //   응답.send('<p>some html</p>')                          send는 간단한 문자나 HTML을 보낼 수 있음.
    //   응답.status(404).send('Sorry, we cannot find that!')   status는 응답코드를 보낼 수 있음
    //   응답.sendFile('/uploads/logo.png')                     sendFile은 static 파일들을 보낼 수 있음
    //   응답.render('list.ejs', { ejs에 보낼 데이터 })            render는 ejs등의 템플릿이 적용된 페이지들을 렌더링해줄 수 있음
    //   응답.json(제이슨데이터)                                    json은 제이슨 데이터를 담아보낼 수 있음
    // });
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
