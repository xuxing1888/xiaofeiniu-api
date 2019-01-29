/**
 * 菜品类别相关的路由
 */
//创建路由器
const express = require('express');
const pool = require('../../pool')
var router = express.Router();

/*   RESTful 风格的API   ---阮一峰
 *get:查询  post:添加(非幂等)  put:修改(更新) patch(部分更新) delete
 *
//http://127.0.0.1:8090/admin/category  ---> 测试的 .html 文件
 * API: GET /admin/category
 * 含义：客户端获取所有的菜品类别，按编号升序排列
 * 返回值形如：
 *   [{cid: 1, cname: ''},{...}]
 */
router.get('/', (req, res) => {
  var sql = `SELECT * FROM xfn_category ORDER BY cid`;
  pool.query(sql, [], (err, result) => {
    if (err) throw err;
    res.send(result);
  })
})

/*
 * API: DELETE /admin/category/:cid
 * 含义：根据表示菜品编号的路由参数，删除该菜品
 * 返回值形如：
 *   {code: 200, msg:'1 category deleted'}
 *   {code: 400, msg:'0 category deleted'}
 */
router.delete('/:cid', (req, res) => {
  //注意：删除菜品类别之前必须先把属于该类别的菜品的类别编号设置为NULL
  pool.query(`UPDATE xfn_dish SET categoryId=NULL WHERE categoryId=?`, req.params.cid, (err, result) => {
    if (err) throw err;
    //至此指定类别的菜品已经修改完毕      外键约束
    var sql = `DELETE FROM xfn_category WHERE cid=?`;
    pool.query(sql, req.params.cid, (err, result) => {
      if (err) throw err;
      //获取DELETE语句在数据库中影响的行数
      //console.log(result);
      if (result.affectedRows > 0) {
        res.send({ code: 200, msg: '1 category deleted' })
      } else {
        res.send({ code: 400, msg: '0 category deleted' })
      }
    })
  })


})

/*
 * API: POST /admin/category
 * 请求参数：{cname:'xxx'}
 * 含义：添加新的菜品类别
 * 返回值形如：
 *   {code: 200, msg:'1 category added', cid: x}
*/
router.post('/', (req, res) => {
  //console.log('获取到请求数据：')
  //console.log(req.body)
  var data = req.body;    //形如{cname: 'xxx', age:10}   
  //UPDATE ,INSERT    注意此处SQL语句的简写
  pool.query(`INSERT INTO xfn_category SET ?`, data, (err, result) => {
    if (err) throw err;
    res.send({ code: 200, msg: '1 category added' })
  })
})

/*
 * API: PUT /admin/category
 * 请求参数：{cid: xx, cname:'xxx'}
 * 含义：根据菜品类别编号修改该类别
 * 返回值形如：
 *   {code: 200, msg:'1 category modified'}
 *   {code: 400, msg:'0 category modified, not exists'}   //不存在   0修改
 *   {code: 401, msg:'0 category modified, no modification'}//存在，改名一样
 */
router.put('/', (req, res) => {
  var data = req.body;    //请求数据{cid:xx, cname:'xx'}
  console.log(data);
  //TODO: 此处可以对输入数据进行验证
  pool.query('UPDATE xfn_category SET ? WHERE cid=?', [data, data.cid], (err, result) => {
    if (err) console.log(err);
    console.log(result)
    if(result.changedRows>0){          //实际更新了一行
      res.send({ code: 200, msg: '1 category modified'})
    }else if(result.affectedRows==0){  //影响为0  
      res.send({ code: 400, msg: '0 category modified, not exists'})
    } else if (result.affectedRows == 1 && result.changedRows == 0){
      //影响到1行，但修改了0行——新值与旧值完全一样
      res.send({ code: 401, msg: '0 category modified, no modification'})
    }
  })
})

module.exports = router;





