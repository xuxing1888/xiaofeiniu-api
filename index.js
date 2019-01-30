/*
*小肥牛扫码点餐系统API子系统
*/
//console.log('准备启动API服务器...');
//console.log(new Date().toLocaleString());

const PORT = 8090;
const express = require('express');
const cors = require('cors');   //中间件模块
const bodyParser = require('body-parser');

/*引入路由模块*/
const categoryRouter = require('./routes/admin/category');
const adminRouter = require('./routes/admin/admin');
const dishRouter = require('./routes/admin/dish');
const settingsRouter = require('./routes/admin/settings');
const tableRouter = require('./routes/admin/table');

//创建HTTP应用服务器，启动 
var app = express();
app.listen(PORT,()=>{   // req,res
  console.log('Server Listening: '+PORT);
})
 
//使用中间件
app.use(cors({
  //origin: 'http://127.0.0.1:5500',
  //directives: true        //要求客户端必须携带cookie
}));
//把application/x-www-form-urlencoded格式的请求主体数据解析出来放入req.body属性
//app.use(bodyParser.urlencoded({extends:false}));
//把application/JSON格式的请求主体数据解析出来放入req.body属性 ******
app.use(bodyParser.json()); 

/*使用路由器来管理路由 挂载*/
app.use('/admin/category', categoryRouter);
app.use('/admin', adminRouter);
app.use('/admin/dish', dishRouter);
app.use('/admin/settings', settingsRouter);
app.use('/admin/table', tableRouter);







