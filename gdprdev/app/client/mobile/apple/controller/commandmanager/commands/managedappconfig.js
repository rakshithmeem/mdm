var Command = require('./command');


/* ApplicationConfiguration Settings Command, Used to Configure the MDM Managed Application */

module.exports = (function () {

    class ManagedApplicationFeedback extends Command {

        constructor(req, res, config) {

            super(req, res);
            this.commandname = "ApplicationConfiguration";
            this.config = config;
            this.createCommandType();
        }

        createCommandType() {
            this.cmdtype = {
                "RequestType": "Settings",
                "Settings": [
                    {
                        "Item": "ApplicationConfiguration",
                        "Identifier": "com.meemgdpr.mdm",
                        "Configuration": this.config
                    }
                ]
            };
        }
    }
    return ManagedApplicationFeedback;
})();