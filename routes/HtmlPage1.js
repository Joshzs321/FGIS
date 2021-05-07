var express = require('express');
var router = express.Router();

var mysql=require('mysql');
var config=require('../model/config');
var pool=mysql.createPool(config.mysql);

/* GET home page. */
router.get('/', function(req, res, next) {
 var user = req.session.user;
 pool.getConnection(function (err, connection) {

    //查询
    var sql = 'select * from projects';

    connection.query(sql, function (err, rows) {
      if (err) {
        res.render('HtmlPage1', { title: '用户列表', datas: [], user: user });
        //console.log(datas[0].layers);
      } else {
        res.render('HtmlPage1', { title: '用户列表', datas: rows, user: user });
       // console.log(datas[0].layers);
      }
      connection.release();// 释放连接 
    });

  });
//res.sendfile("./views/HtmlPage1.html",{ title: '实验', user: user });

});


router.post('/projectname',function(req,res,next){
	var projectname=req.body.projectname;
	var username=req.session.user.username;

	pool.getConnection(function(err,connection){
		var $sql2="select * from  projects where projectname=? and username=?";
		connection.query($sql2,[projectname,username],function(err,result){
			var resultJson=result;
			console.log(resultJson.length);
			if(resultJson.length!==0){
				result={
					code:300,
					msg:'该项目已存在'
				};
				res.json(result);
				connection.release();
			}else{
				result={
					code:200,
					msg:username
				};
				res.json(result);
				connection.release();
			};
		});
	});
})

router.post('/projectInfo',function(req,res,next){
	var projectname=req.body.projectName;
	var username=req.body.userName;
	var points=req.body.points;
	var bufferdistance=req.body.bufferSize;
	var layers=req.body.layers;
	var transport=req.body["gis.osm_transport_free_1"];
	var traffic=req.body["gis.osm_traffic_free_1"];
	var places=req.body["gis.osm_places_free_1"];
	var waterways=req.body["gis.osm_waterways_free_1"];
	var roads=req.body["gis.osm_roads_free_1"];
	var railways=req.body["gis.osm_railways_free_1"];
	var water=req.body["gis.osm_water_a_free_1"];
	var GlobalData=req.body["GlobalData"];
	var date=req.body["date"];
	console.log(date);
	
	pool.getConnection(function(err,connection){
		var $sql="select * from  projects where projectname=? and username=?";
		connection.query($sql,[projectname,username],function(err,result){
			var resultJson=result;
			//为0，说明目前数据库中还没有
			console.log(resultJson.length);
			if(resultJson.length!==0){
				result={
					code:300,
					msg:'该项目已保存'
				};
				res.json(result);
				connection.release();
			}else{
				var $sql1="INSERT INTO projects(id,projectname,username,points,bufferdistance,layers,"+
				"osm_transport_free_1,osm_traffic_free_1,osm_places_free_1,osm_waterways_free_1,osm_roads_free_1,osm_railways_free_1,osm_water_a_free_1,GlobalData,date)"+
				" VALUES(0,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
							
				connection.query($sql1,[projectname,username,points,bufferdistance,layers,transport,traffic,places,waterways,roads,railways,water,GlobalData,date],function(err,result){
				if (result) {
					result = {
					  code: 200,
					   msg: '项目执行成功并已保存'
					};
				}else {
					result = {
					  code: 400,
					  msg: '项目执行成功但保存失败'
					};
			  	}
				res.json(result); // 以json形式，把操作结果返回给前台页面
				connection.release();// 释放连接
			
			});
				
				

			};
		});

	

	})
})

router.get("/del/:id", function (req, res) {
	var id = req.params.id;
	pool.getConnection(function (err, connection) {
	  connection.query("delete from projects where id = " + id, function (err, rows) {
		if (err) {
		  res.send("删除失败" + err);
		} else {
		  //重定向，让页面再动态加载一次
		  res.redirect("/HtmlPage1");
		}
  
	  });
  
	});
  });
module.exports = router;
