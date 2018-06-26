var Command = require('./command');


/* ManagedApplicationFeedback Command, Used to retrieve the feedback from the MDM Managed Application */

module.exports = (function () {

    class ManagedApplicationFeedback extends Command {

        constructor(req, res) {

            super(req, res);
            this.commandname = "ManagedApplicationFeedback";
            this.createCommandType();
        }

        createCommandType() {
            this.cmdtype = {
                "RequestType": "ManagedApplicationFeedback",
                "Identifiers": ["com.meemgdpr.mdm"],
                "DeleteFeedback": true
            };
        }
    }
    return ManagedApplicationFeedback;
})();