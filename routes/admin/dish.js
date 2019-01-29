const express = require('express');
const router = express.Router();
const pool = require('../../pool');

module.exports = router;

/*
*API: GET /admin/dish  
*获取所有的菜品(按类别进行分类)
*返回数据：
* [
*   {cid:1, cname:'肉类, dishList:[{},{},...]}
*   {cid:2, cname:'蔬菜类, dishList:[{},{},...]}
*   ....
* ]
*/
router.get('/', (req, res) => {
  //查询所有的菜品类别
  pool.query(`SELECT cid,cname FROM xfn_category `, (err, result) => {
    if (err) throw err;
    var categoryList = result;  //菜品类别数组
    var count = 0;

    for (var c of categoryList) {
      //循环查询每个类别下有哪些菜品
      pool.query(`SELECT * FROM xfn_dish WHERE categoryId=?`, c.cid, (err, result) => {
        c.dishList = result;
        count++;
        if(count == categoryList.length){
          res.send(categoryList);
        }
      })
    }
  })
})


/*
*POST /admin/dish/image
*请求参数：
*接收客户端上传的菜品图片，保存在服务器上，返回该图片在服务器上的随机文件名
*响应数据：
*   {code:200, msg:'upload succ', fileName:'13545644564656.jpg'}
*/
//引入multer中间件
const multer = require('multer');
const fs = require('fs');
var upload = multer({
  dest: 'tmp/'    //指定客户端上传的文件临时存储路径
})
//定义路由，使用文件上传中间件   ---专门在这使用
router.post('/image',upload.single('dishImg'),(req,res)=>{
  //console.log(req.file);  //客户端上传的文件
  //console.log(req.body);  //客户端随同图片提交的字符数据
  //把客户端上传的文件从临时目录转移到永久的图片路径下
  var tmpFile = req.file.path;  //临时文件名
  var suffix = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));  //  '.jpg'    原始文件名中的后缀部分
  var newFile = randFileName(suffix);  //目标文件名
  fs.rename(tmpFile, 'img/dish/' +newFile,()=>{
    res.send({code:200, msg:'upload succ',fileName:newFile}); //临时文件转移
  })
  //res.send({});
})

//生成一个随机文件名
//参数：suffix表示要生成的文件名中的后缀
//min max: Math.random()*(max-min) + min;
function randFileName(suffix){
  var time = new Date().getTime();
  var num = Math.floor(Math.random()*(10000-1000)+1000); //四位随机数 0-9999
  return time+'-'+num+suffix;
}




/*
*POST /admin/dish/image
*请求参数：  {title:'xx',imgUrl:'..jpg',price:'xx',detail:'xx',categoryId:xx}
*添加一个新的菜品
*输出消息：
*   {code:200,msg:'dish added succ',dishId:46}
*/
router.post('/',(req,res)=>{
  pool.query('INSERT INTO xfn_dish SET ?',req.body,(err,result)=>{
    if(err) throw err;
    //将insert语句产生的自增编号输出给客户端
    res.send({ code: 200, msg: 'dish added succ', dishId:result.insertId})
  })
})


/*
 *DELETE /admin/dish/:did 
 * 根据指定的菜品编号删除该菜品
 * 输出数据：
 * {code:200,msg:'dish deleted succ'}
 * {code:400,msg:'dish not exists'}
 */


/*
 *PUT /admin/dish
*请求参数：  {did:'xx',title:'xx',imgUrl:'..jpg',price:'xx',detail:'xx',categoryId:xx}
*根据指定的菜品编号修改菜品
 * 输出数据：
 * {code:200,msg:'dish updated succ'}
 * {code:400,msg:'dish not exists'}
*/




