var Command = require('./command');
var plist = require('plist');

module.exports = (function () {

    class InstallProfile extends Command {

        constructor(req, res, profileJson) {

            super(req, res);
            this.commandname = "InstallProfile";
            this.createCommandType();
            this.profilejson = profileJson;
        }

        createCommandType() {

            this.profileplist = plist.build(this.profilejson); //Need to get from Model
            var profilebase64data = new Buffer(this.profileplist).toString('ascii');

            this.cmdtype = {
                "RequestType": "InstallProfile",
                "Payload": this.base64ToBuffer(profilebase64data)
            };
        }

        base64ToBuffer(base64) {

            'use strict';
            var binstr = base64;
            var buf = new Uint8Array(binstr.length);
            Array.prototype.forEach.call(binstr, function (ch, i) {
                buf[i] = ch.charCodeAt(0);
            });
            return buf;
        }

    }

    return InstallProfile;

})();