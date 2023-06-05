const express = require('express');
const util = require('./util');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/static', express.static(__dirname + '/static'))
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'html');

app.get('/', (req, resp) => {
  resp.render('home', { username: req.session.username });
});

app.get('/allpic', async (req, resp) => {
  resp.render('allpic', {
    username: req.session.username,
    json: {
      arr: [
        { url: '../static/pic/1594805927-ba399df52fb3d61.jpg', tittle: '123456' },
        { url: '../static/pic/1594805927-ba399df52fb3d61.jpg', tittle: '123456' },
        { url: '../static/pic/1594805927-ba399df52fb3d61.jpg', tittle: '123456' },
      ]
    }
  });
});

app.get('/product', async (req, resp) => {
  resp.render('product', { username: req.session.username });
});

app.get('/demo', async (req, resp) => {
  resp.render('demo', { username: req.session.username });
});

app.get('/login', async (req, resp) => {
  resp.render('login', { username: req.session.username });
});

app.get('/regists', async (req, resp) => {
  resp.render('regists', { username: req.session.username });
});

app.get('/logout', (req, res) => {
  req.session.username = null;
  res.redirect('/login');
});

// 引入必要的模块
const mysql = require('mysql');

// 创建数据库连接
const connection = mysql.createConnection({
  host: 'localhost', // 数据库主机名
  user: 'root',      // 数据库用户名
  password: '1234567',  // 数据库密码
  database: 'wyk'    // 数据库名称
});

// 连接到数据库
connection.connect((err) => {
  if (err) {
    console.error('无法连接到数据库:', err);
    return;
  }
  console.log('已成功连接到数据库！');
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // 查询数据库以验证用户名和密码
  const query = 'SELECT * FROM user WHERE username = ? AND password = ?';
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('查询出错:', err);
      res.status(500).send('内部服务器错误');
      return;
    }

    if (results.length === 0) {
      // 未找到匹配的用户名和密码
      res.status(401).send('无效的用户名或密码');
    } else {
      // 登录成功
      req.session.username = username; // 将用户名存储在会话中
      res.redirect('/');
    }
  });
});



// 处理注册表单的请求
app.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  if(username.length < 6) {
    res.send('<script>alert("用户名需要在6个字符以上")')
  }
  // 检查用户名是否已存在
  const checkUsernameQuery = 'SELECT * FROM user WHERE username = ?';
  connection.query(checkUsernameQuery, [username], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      // 用户名已存在，弹窗提示
      res.send('<script>alert("用户名已存在");window.location.href="/regists";</script>');
    } else {
      // 检查邮箱是否已存在
      const checkEmailQuery = 'SELECT * FROM user WHERE email = ?';
      connection.query(checkEmailQuery, [email], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
          // 邮箱已存在，弹窗提示
          res.send('<script>alert("邮箱已存在");window.location.href="/regists";</script>');
        } else {
          // 可以注册，写入数据库
          const registerQuery = 'INSERT INTO user (username, password, email, role, registration_date) VALUES (?, ?, ?, "用户", CURRENT_TIMESTAMP)';
          connection.query(registerQuery, [username, password, email], (err, results) => {
            if (err) throw err;

            // 注册成功，重定向到登录页面
            res.redirect('/login');
          });
        }
      });
    }
  });
});

app.get('/search', (req, res) => {
  const keyword = req.query.keyword;

  // 执行搜索逻辑，根据关键词返回匹配的图片地址和标题

  // 示例代码
  const searchQuery = `SELECT Image.image_path, Upload.title FROM Image 
                      INNER JOIN Upload ON Image.upload_id = Upload.upload_id 
                      WHERE Upload.title LIKE '%${keyword}%' 
                      OR Upload.description LIKE '%${keyword}%' 
                      OR Upload.image_tag LIKE '%${keyword}%'`;

  connection.query(searchQuery, (err, results) => {
    if (err) {
      console.error('搜索出错:', err);
      res.status(500).send('内部服务器错误');
      return;
    }

    const searchResults = results.map(result => ({
      image_path: result.image_path,
      title: result.title
    }));

    res.render('allpic', {
      username: req.session.username,
      json: {
        arr: searchResults
      }
    });
  });
});


app.listen(3000, () => {
  console.log("server is strart, open localhost:3000");
});
