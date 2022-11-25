const server = require('http').createServer()
const io = require('socket.io')(server)
var mysql = require("mysql");

//connect mysql
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "ltm"
});

io.on('connection', client => {
  console.log("new connect");
  con.connect;
  con.query("SELECT * FROM ltm.music", function (err, rows) {
    if(err) throw err;
    // console.log('Data received from Db:\n');
    // console.log(rows);
    client.emit('music', rows);
  })

  client.on("msg", data => { console.log(data); })

  //login
  client.on("login", data => {
    var sql = "SELECT role FROM ltm.user WHERE (username = ? && password = ?)";
    con.query(sql,[ data["user"] , data["password"]], function (err, rows) {
      if(err) throw err;
      console.log('Data received from Db:\n');
      console.log(rows);
      client.emit('returnLogin', rows);
    })
  })


  //laays id
  client.on("getId", data => {
    var sql = "select iduser from ltm.user where username = ?";
    con.query(sql,[ data ], function (err, rows) {
      if(err) throw err;
      console.log('Data received from Db:\n');
      console.log(rows);
      client.emit('getIdServer', rows);
    })
  })

  //registe
  client.on("registe", data => {
    var sql = "INSERT INTO ltm.user (username, password, role) VALUES (? ,? , ? )";
    con.query(sql,[ data["user"] , data["password"],data["role"]], function (err, rows) {
      if(err) throw err;
      console.log('Data received from Db:\n');
      console.log(rows);
      client.emit('returnRegiste', rows);
    })
  })

  //---------------Admin-------------
  client.on("addMusic", data => {
    var sql = "INSERT INTO ltm.music ( name, des, image, url) VALUES (? , ? , ?, ?);";
    con.query(sql,[ data["name"] , data["des"], data["image"],data["link"]], function (err, rows) {
      if(err) throw err;
      console.log('Data received from Db:\n');
      console.log(rows);
      client.emit('add', "thành công");
    })
  })

  client.on("deleteMusic", data => {
    console.log(data);
    var sql = "DELETE FROM ltm.music WHERE name = ?";
    con.query(sql,[data], function (err, rows) {
      if(err) throw err;
      console.log('Data received from Db:\n');
      console.log(rows);
      client.emit('delete', "thành công");
    })
  })
 //----------------comment---------------

 client.on("comment", data => {
  var sql = "SELECT ltm.user.username, ltm.tb_comment.comment FROM  ltm.tb_comment,ltm.user where ltm.tb_comment.idMusic = ? and ltm.user.iduser = ltm.tb_comment.iduser;";
  con.query(sql,[data], function (err, rows) {
    if(err) throw err;
    console.log('Data received from Db:\n');
    console.log(rows);
    client.emit('cmt', rows);
  })
 })


 client.on("putComment", data => {
  var sql = "insert into ltm.tb_comment (iduser, idMusic, comment) VALUES  (?, ?, ?);";
  con.query(sql,[data["idUser"], data["idMusic"], data["comment"]], function (err, rows) {
    if(err) throw err;
    console.log('Data received from Db:\n');
    console.log(rows);
    client.emit('updateCmt', rows);
  })
 })

  

  client.on("disconnect", () => console.log("disconnect"))
})

var server_port = process.env.PORT || 3000;
server.listen(server_port, function (err) {
  if (err) throw err
  console.log('Listening on port %d', server_port);
});