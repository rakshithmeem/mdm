var express = require('express');
var router = express.Router();
var constants = require('utils/constants')
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
require('rootpath')();

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(bodyParser.text({ type: "*/*" }));

router.get('/enr/:routeID', function (req, res) {
    // TODO : get admin hash and Org Name from DB and Id 

    console.log('routeId '+ req.params.routeID);
    console.log(JSON.stringify(req.query));

    var id = req.query.id;
    var routeId = req.params.routeID;
    
    var actionLink ;
    if (constants.MICROSOFT_AZURE) {
        actionLink =  constants.AZURE.SERVERURL +  "/meem/enrollment/mobileconfig";
    } else if (constants.LOCAL_SERVER) {
        actionLink =  constants.LOCAL.SERVERURL + "/meem/enrollment/mobileconfig";
    }

    res.render('enroll',{
        //org: 'Meem memory pvt ltd',
        //TODO: Add company name
        action_link: actionLink,
        route_id : routeId,
        admin_hash : id,
        ca_link : constants.LOCAL.SERVERURL+'/getca',
        caBtn_active : constants.LOCAL_SERVER
        });
});


var apple =require('./apple/index');
//var android =require('./android/index');

router.use('/apple', apple);
//router.use('/android', android);
var applecommands =require('./apple/controller/commandmanager/commandmanager');

router.use('/commands', function (req,res) {

    var OS = req.body.OS;
    
    if(OS == "Apple"){
        applecommands.ManageCommands(req,res)
    }
    else if(OS == "Android"){

    } 
});


module.exports = router;