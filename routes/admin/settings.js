/**
 * 全局设置路由器
 */
const express = require('express');
const router = express.Router();
const pool = require('../../pool');
module.exports = router;

/*
*GET /admin/settings
*获取所有的全局设置信息
*返回数据：
*   {appName:'xx', adminUrl:'xx',appUrl:'xx',...}
*/
router.get('/',(req,res)=>{
  pool.query(`SELECT * FROM xfn_settings LIMIT 1`,(err,result)=>{
    if(err) throw err;
    //console.log(result)
    res.send(result[0]);    //查询语句   数组里一条数据
  })
})

/*
 *PUT /admin/settings
 *请求数据：
 *   {appName:'xx', adminUrl:'xx',appUrl:'xx',...}
 *修改所有的全局设置信息
 *返回数据：
 *   {code:200, msg:'settings updated succ'}
*/
router.put('/', (req, res) => {       //请求主体
  pool.query(`UPDATE xfn_settings SET ?`,req.body, (err, result) => {
    if (err) throw err;
    res.send({ code: 200, msg: 'settings updated succ' });  
  })
})
