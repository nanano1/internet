const express=require('express')
const util=require('./util')
const app=express()
const path =require('path')

app.use('/static',express.static(__dirname+'/static'))
app.engine('.html',require('ejs').__express);
app.set('views',path.join(__dirname,'pages'));
app.set('view engine','html');
app.get('/',(req,resp)=>{

    resp.render('home')
})
app.get('/allpic',async(req,resp)=>{

    resp.render('allpic',{json: {arr: [
        {url: '../static/pic/1594805927-ba399df52fb3d61.jpg', tittle: '123456'},
        {url: '../static/pic/1594805927-ba399df52fb3d61.jpg', tittle: '123456'},
        {url: '../static/pic/1594805927-ba399df52fb3d61.jpg', tittle: '123456'},
      ]}})
})
app.get('/product',async(req,resp)=>{
    resp.render('product')
})
app.get('/demo',async(req,resp)=>{
    resp.render('demo')
})
app.get('/login',async(req,resp)=>{
    resp.render('login')
})
app.listen(3000,()=>{
    console.log("server is strart,open localhost:3000")
})