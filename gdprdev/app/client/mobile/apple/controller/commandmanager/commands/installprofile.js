var Command = require('./command');
var plist = require('plist');
var jsonxml = require('jsontoxml');
var fs = require('fs');
module.exports = (function () {

    class InstallProfile extends Command {

        constructor(req, res, profileJson) {

            super(req, res);
            this.commandname = "InstallProfile";
            this.profilejson = profileJson;
            console.log("InstallProfile Constructor");

            this.createCommandType();

        }

        createCommandType() {



            // var emailpath = global.__basedir + '/tmp/Email.plist';
            // var plistfile = fs.readFileSync(emailpath, "utf8");

           // var json = {"PayloadContent":[{"EmailAccountDescription":"ACC","EmailAccountName":"ACC","EmailAccountType":"EmailTypeIMAP","EmailAddress":"aswin@meemmemory.com","IncomingMailServerAuthentication":"EmailAuthNone","IncomingMailServerHostName":"imap.gmail.com","IncomingMailServerPortNumber":993,"IncomingMailServerUseSSL":true,"IncomingMailServerUsername":"aswin@meemmemory.com","OutgoingMailServerAuthentication":"EmailAuthNone","OutgoingMailServerHostName":"smtp.gmail.com","OutgoingMailServerPortNumber":465,"OutgoingMailServerUseSSL":true,"OutgoingMailServerUsername":"aswin@meemmemory.com","OutgoingPasswordSameAsIncomingPassword":true,"PayloadDescription":"Configures Email settings","PayloadDisplayName":"ACC","PayloadIdentifier":"com.apple.mail.managed.f2825cc0-5ddf-11e8-82b1-4777769aa07d","PayloadType":"com.apple.mail.managed","PayloadUUID":"f2825cc0-5ddf-11e8-82b1-4777769aa07d","PayloadVersion":1,"PreventMove":true,"SMIMEEnablePerMessageSwitch":false,"SMIMEEnabled":false,"SMIMEEncryptionEnabled":false,"SMIMESigningEnabled":false,"allowMailDrop":false,"disableMailRecentsSyncing":true}],"PayloadDisplayName":"MEEM","PayloadIdentifier":"com.apple.applicationaccess.f2825cc1-5ddf-11e8-82b1-4777769aa07d","PayloadOrganization":"Meem Memory pvt ltd","PayloadRemovalDisallowed":false,"PayloadType":"Configuration","PayloadUUID":"f2825cc1-5ddf-11e8-82b1-4777769aa07d","PayloadVersion":1}

            console.log("Profile JSON: " +this.profilejson);

            var plistfile = plist.build(this.profilejson);
            console.log("Profile Plist: " +plistfile);

            // convert binary data to base64 encoded string
            var profilebase64data = new Buffer(plistfile).toString('ascii');

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