const express = require('express');
const router = express.Router();
const pool = require('../../pool');

router.get('/',(req,res)=>{
  var sql = `SELECT * FROM xfn_settings`;
  pool.query(sql,[],(err,result)=>{
    if(err) throw err;
    console.log(result);
    res.send(result);
  })
})
