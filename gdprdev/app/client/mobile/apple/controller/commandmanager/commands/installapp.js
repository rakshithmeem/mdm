var Command = require('./command');
require('rootpath')();
var constants = require('utils/constants');

module.exports = (function () {

    class InstallApp extends Command {

        constructor(req, res) {

            super(req, res);
            this.commandname = "InstallApp";
            this.createCommandType();
        }



        createCommandType() {
            var serverURL
            if (constants.MICROSOFT_AZURE) {
                serverURL =  constants.AZURE.SERVERURL
            } else if (constants.LOCAL_SERVER) {
                serverURL =  constants.LOCAL.SERVERURL
            }
            this.cmdtype = {
                "ChangeManagementState": "Managed",
                "ManagementFlags": 1,
                "options": {
                    "PurchaseMethod": 1
                },
                "RequestType": "InstallApplication",
                "ManifestURL":  serverURL + "/meem/mdm/apple/managedapp/manifest.plist"
            }

        }

    }
    return InstallApp;
})();