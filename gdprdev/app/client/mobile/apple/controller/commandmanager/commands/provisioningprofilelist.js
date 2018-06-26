var Command = require('./command');

module.exports = (function () {

    class ProvisioningProfileList extends Command {

        constructor(req, res) {

            super(req, res);
            this.commandname = "ProvisioningProfileList";
            this.createCommandType();
        }
        createCommandType() {

            this.cmdtype = {
                "RequestType": "ProvisioningProfileList"
            };
        }

    }
    return ProvisioningProfileList;
})();