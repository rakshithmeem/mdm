authentication = require('./authentication');
certificate = require('./certificate');
device = require('./device');
profile = require('./profile');
module.exports.deRegisterAdmin = function (req, res) {


    authentication.fetchHashByTokenId(req.body.tokenID, function (hash) {
        var utility = require("utils/utility.js");
        utility.delete_adminDir(hash, function () {

            authentication.fetchIdByTokenId(req.body.tokenID, function (Id) {
                //console.log("email", email);
                authentication.deregisterAdmin(Id)
                certificate.deregisterAdmin(Id);
                device.deregisterAdmin(Id);
                profile.deregisterAdmin(Id);
            });
            
            console.log("Accouts/"+hash+" deleted");
            res.status(200);
            res.json(
                {
                    "message": "De Registration success"
                }
            );
        });
    });



}