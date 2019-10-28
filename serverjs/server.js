const express = require('express')
const app = express()
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
app.set('view engine', 'ejs');

//const port = 3000
var mysql = require('mysql');

let con = mysql.createConnection({
  host: "remotemysql.com",
  user: "78KlqwLrcP",
  database: "78KlqwLrcP",
  password: "eFXKcEJOOb",
});

////////////////////////////////////////////////////////////////////////////////
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use('/', express.static('views'));
app.use('/clientjs', express.static('clientjs'));
app.use('/css', express.static('css'));



app.get('/', (req, res) => {
  res.render('index', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
});
app.get('/blogs', (req, res) => {
  res.redirect(301, '/blogs/1');
});
app.get('/blogs/:currentPage', (req, res) => {
  function blogsQuery(total) {
    let offset = (req.params.currentPage - 1) * 4;
    let sql = `select * from blogList where status = 'approved' limit 4 offset ${offset}`;
    con.query(sql, function(err, result, fields){
      if (err) throw err;
        res.render('blogs', {
          arrayOfBlogs: result,
          currentPage: req.params.currentPage,
          prevDisabled: offset - 4 < 0 ? 'disabled' : "",
          nextDisabled: offset + 4 >= total ? 'disabled' : "",
          loggedin: req.session.loggedin,
          exhibitionOpened: exhibitionOpened
        });
    });
  }
  if (req.params.currentPage < 1) res.status(404).render('404', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
  else {
    let sqlTotal = `select count(id) from blogList`;
    con.query(sqlTotal, function(err, result, fields){
    //  //console.log(result);
      if (err) throw err;
      let total = result[0]['count(id)'];
    //  //console.log(total)
      if ((req.params.currentPage - 1) * 4 >= total)
        res.status(404).render('404', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
      blogsQuery(total);
    });
  }
});
app.get('/blogPost/:blogid', (req, res) => {
  sql = `select * from blogList where id = ${req.params.blogid} and status = 'approved'`;
  con.query(sql, function(err, result, fields){
    if (err) throw err;
    //console.log(result);
    if (result.length == 0) res.status(404).render('404', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
    res.render('blogPost', {exhibitionOpened: exhibitionOpened, blog: result[0], loggedin: req.session.loggedin});
  });
});

app.get('/itemPost/:itemid', (req, res) => {
  sql = `select * from items where id = ${req.params.itemid}`;
  con.query(sql, function(err, result, fields){
    if (err) throw err;
    //console.log(result);
    if (result.length == 0) res.status(404).render('404', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
    result[0].author = 'Admin';
    res.render('blogPost', {exhibitionOpened: exhibitionOpened, blog: result[0], loggedin: req.session.loggedin});
  });
});


/*
app.get('/example2', (req, res) => {

  res.render('example2', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
});
app.get('/testexample2', (req, res) => {

  res.render('foot', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
});
*/


app.get('/editor', (req, res)=>{
  if (req.session.loggedin) {
    res.render('adminEditor', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
  }
  else {
    res.render('editor', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
  }
});
app.post('/submitItem', (req, res) => {
  ////console.log(req.body);
  ////console.log(req.body.content);
  //res.json(req.body);
  let item = req.body;
  let sql = `insert into items values ('${item.imageSrc}', '${item.title}', '${item.desc}', NULL , '${item.category}', '${item.content}');`;
  con.query(sql, function(err, result, fields){
    if (err) throw err;
    res.json({content: 'Your Post Has Been Sent.'});
  });

});
app.post('/submitBlog', (req, res) => {
  ////console.log(req.body);
  ////console.log(req.body.content);
  //res.json(req.body);
  let blog = req.body;
  let sql = `insert into blogList values ('${blog.title}', '${blog.desc}', NULL, '${blog.content}', 'waiting', '${blog.author}');`;
  con.query(sql, function(err, result, fields){
    if (err) throw err;
    res.json({content: 'Your Post Has Been Submitted.'});
  });

});
app.post('/delete/items', (req, res) => {
  if (req.session.loggedin) {
    //console.log(req.body);
    if (!req.body.ids) {
      res.json({message: 'Choose Something!'});
      //console.log('400 bad request');
      return;
    }
    let sql = 'delete from items where `id` in (' + req.body.ids + ');';
    con.query(sql, function(err, result, fields){
      //console.log('delet');
      if (err) throw err;
      res.json({message: 'deleted'});
    });
  }
  else {
    res.status(404).render('404', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
  }
});
app.get('/exPrep', (req, res) => {
  if (req.session.loggedin) {
    res.render('exPrep', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
  }
  else{
    res.status(404).render('404', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
  }
});

app.get('/category/:cat', (req, res) => {
  let sql = `select * from items where category = "${req.params.cat}"`;
  con.query(sql, function(err, result, fields){
    if (err) throw err;
    ////console.log(result);
    res.render('category', {exhibitionOpened: exhibitionOpened, items: result, loggedin: req.session.loggedin});
  });
});
let exhibitionOpened = false;
const globalExhibitionData = { //default || template exhibition data
  title1: 'World War II',
  title2: 'A Walk Among The Bullet Hell Of The Past',
  coverImg: 'https://fanart.tv/api/download.php?type=download&image=9839&section=1',
  facts: [{
    title: 'factaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa7',
    desc: 'desfact7',
    //href: '777facts7777',
    id: 7
    //imageSrc: 'https://fanart.tv/api/download.php?type=download&image=9839&section=1'
  }],
  relics: [{
    title: 'relics7',
    desc: 'desrelics7',
    //href: '777relics777',
    id: 8
    //imageSrc: 'https://i.ytimg.com/vi/knkkwFQFX8U/maxresdefault.jpg'
  }],
  people: [{
    title: 'ppl7',
    desc: 'desppl7',
    //href: '777ppl777',
    id: 9
    //imageSrc: ...
    //imageSrc: 'https://fanart.tv/api/download.php?type=download&image=9839&section=1'
  }],
};

app.post('/initExhibition', (req, res) => {
  if (req.session.loggedin) {
    //console.log(req.body);
    if (!req.body.ids) {
      res.json({message: 'Choose Some Exhibition Items!'});
      //console.log('empty ex ids');
      return;
    }
    // update globalExhibitionData
    let exData = req.body;
    globalExhibitionData.title1 = exData.title1;
    globalExhibitionData.title2 = exData.title2;
    globalExhibitionData.coverImg = exData.coverImg;
    globalExhibitionData.facts = [];
    globalExhibitionData.relics = [];
    globalExhibitionData.people = [];
    let sql = 'select * from items where `id` in (' + req.body.ids + ');';
    con.query(sql, function(err, result, fields){
      if (err) throw err;
      for (let item of result) {
        switch (item.category){
          case 'facts':
            globalExhibitionData.facts.push(item);
            break;
          case 'relics':
            globalExhibitionData.relics.push(item);
            break;
          case 'people':
            globalExhibitionData.people.push(item);
            break;
        }
      }
      exhibitionOpened = true;
      res.json({message: 'Exhibition initiated!'});
    });
  }
  else {
    res.status(404).render('404', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
  }
});
app.post('/previewExhibition', (req, res) => {
  if (req.session.loggedin) {
    //console.log(req.body);
    if (!req.body.ids) {
      res.send("<h1>Nothing To Preview!</h1>")
      //console.log('empty ex ids');
      return;
    }
    // update globalExhibitionData
    let clone = {};
    let exData = req.body;
    clone.title1 = exData.title1;
    clone.title2 = exData.title2;
    clone.coverImg = exData.coverImg;
    clone.facts = [];
    clone.relics = [];
    clone.people = [];
    let sql = 'select * from items where `id` in (' + req.body.ids + ');';
    con.query(sql, function(err, result, fields){
      if (err) throw err;
      for (let item of result) {
        switch (item.category){
          case 'facts':
            clone.facts.push(item);
            break;
          case 'relics':
            clone.relics.push(item);
            break;
          case 'people':
            clone.people.push(item);
            break;
        }
      }
      //exhibitionOpened = true;
      res.render('previewExhibition', {data: clone, loggedin: req.session.loggedin});
    });
  }
  else {
    res.status(404).render('404', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
  }
});
app.get('/ceaseExhibition', (req, res) => {
  if (req.session.loggedin) {
    exhibitionOpened = false;
    res.redirect('/');
  }
  else {
    res.status(404).render('404', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
  }
});
app.get('/exhibition', (req, res) => {
  if (exhibitionOpened) {
    res.render('exhibition', {exhibitionOpened: exhibitionOpened, data: globalExhibitionData, loggedin: req.session.loggedin});
  }
  else {
    res.render('closed', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
  }
});
app.post('/adminLogin', (req, res) => {
  //console.log(req.body);
  //res.json({message: 'in'});
  let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
		if (username === '1' && password === '1') {
			req.session.loggedin = true;
			req.session.username = username;
      ////console.log('in');
      res.json({message: 'in'});
		} else {
			res.json({message: 'incorrect username or password'});
		}
		res.end();
	}
	else {
	res.json({message: 'Please enter Username and Password!'});
	res.end();
  }
});

app.get('/adminLogout', (req, res) => {
  req.session.loggedin = false;
  req.session.username = null;
  res.redirect('/');
});
app.get('/approve', (req, res) => {
  if (!req.session.loggedin)
    res.status(404).render('404', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
  else {
    let sql = `select count(id) from blogList where status = "waiting"`;
    con.query(sql, function(err, result, fields){
      if (err) throw err;
      let remain = result[0]['count(id)'];
      res.render('approve', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin, remainBlogs: remain});
    });
  }
});
app.get('/approve/:blogid', (req, res) => {
  if (!req.session.loggedin)
    res.status(404).render('404', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
  else {
    let sql = "update blogList set `status` = 'approved' where id = " + req.params.blogid ;
    con.query(sql, function(err, result, fields){
      if (err) throw err;
      //console.log(result);
      res.redirect('/approve');
    });
  }
});

app.get('/reject/:blogid', (req, res) => {
  if (req.session.loggedin){
    let sql = "update blogList set `status` = 'rejected' where id = " + req.params.blogid ;
    con.query(sql, function(err, result, fields){
      if (err) throw err;
      //console.log(result);
      res.redirect('/approve');
    });
  }
  else {
    res.status(404).render('404', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
  }
});

app.get('/getBlog', (req, res) => {
  //console.log('getblog');
  if (!req.session.loggedin)
    res.status(404).render('404', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
  else {
    let sql = `select * from blogList where status = "waiting" limit 1`;
    con.query(sql, function(err, result, fields){
      if (err) throw err;
      let blog = result.length == 0 ? {over: true} : result[0];
      //console.log(blog);
      res.json(blog);
    });
  }
});


/*
app.post('/userNameRegister'(req, res) => {
  //console.log(req.body);
  let chosenName = req.body.name.toLowerCase();
  if (globalSocketClientNameSet.has(chosenName)) {
    res.json({nameExisted: true});
  }
  else {
    globalSocketClientNameSet.add(chosenName);
    res.json({nameExisted: false});
  }
}); */

app.get('/about', (req, res) => {
  res.render('about', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
});

app.all('*', function(req, res){
  res.status(404).render('404', {exhibitionOpened: exhibitionOpened, loggedin: req.session.loggedin});
});


//////////////////////////////////////////////////////////////////////////////
//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
/////////////////////////////////////////////////////////////////////////////
const http = require('http');
const ws = new require('ws');
//const wsapp = express();
const server = http.createServer();
const wss = new ws.Server({ server: server });
server.on('request', app);
let url = require('url');

const globalSocketClientNameSet = new Set();
wss.on('connection', onSocketConnect);

function onSocketConnect(ws, req) {
  //clients.add(ws);
  ////console.log(req.url);
  let queryData = url.parse(req.url, true).query;
  let chosenName = queryData.name.toLowerCase();
  if (globalSocketClientNameSet.has(chosenName)) {
    terminationMessage = JSON.stringify({terminated: true, mess: 'Name Taken!'})
    ws.send(terminationMessage, {}, ()=>{
      ws.terminate();
    });
  }
  else {
    ws.username = chosenName;
    globalSocketClientNameSet.add(ws.username);
    okMessage = JSON.stringify({terminated: false, mess: 'Name is good!'});
    ws.send(okMessage);
  }
  ws.on('message', function(message) {
    //console.log(message);
    //incoming mess = {username: '', content:''}  json string
    let m = JSON.parse(message);

    m.content = m.content.slice(0, 50); // max message length will be 50
    for(let client of wss.clients) {
      ////console.log('client name: ' + queryData.name);
      client.send(JSON.stringify(m));
    }
  });

  ws.on('close', function(){
    //globalSocketClientNameSet.delete(ws.username);

  });
}

server.listen(process.env.PORT || 3000, () => {
    console.log(`Http and WebSocket Server started on port ${server.address().port} \\(<_<)\\`);
});
