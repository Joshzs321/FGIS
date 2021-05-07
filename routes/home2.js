var express = require('express');
var router = express.Router();
// 实现与MySQL交互
var mysql = require('mysql');
var config = require('../model/config');

// 使用连接池，提升性能
var pool = mysql.createPool(config.mysql);



/* GET home page. */
router.get('/', function(req, res) {
 var user = req.session.user;
//res.render('home2', { title: '实验', user: user });
 pool.getConnection(function (err, connection){
 	
//查询
 	var sql = 'select * from projects';
 	
 	connection.query(sql,function(err,rows){
      if(err){
        res.render('home2', {title: '用户列表', datas: [],user:user});
      }else {
        res.render('home2', {title: '用户列表', datas: rows,user:user});
      }
      connection.release();// 释放连接 
  }); 

});
   
});



//删除数据库工程记录

router.get("/del/:id",function(req,res){
	var id = req.params.id;
	pool.getConnection(function (err, connection){
		connection.query("delete from projects where id = " + id,function(err,rows){
			if(err){
            res.send("删除失败"+err);
        }else {
            res.redirect("/home2");
        }

		});
		
	});
});


module.exports = router;
