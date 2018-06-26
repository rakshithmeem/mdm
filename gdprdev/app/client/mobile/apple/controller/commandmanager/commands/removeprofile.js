var Command = require('./command');

module.exports = (function () {

    class RemoveProfile extends Command {

        constructor(req, res, profileidentifier) {

            super(req, res);
            this.commandname = "RemoveProfile";
            this.profileidentifier = profileidentifier;
            this.createCommandType();
        }

        createCommandType() {

            this.cmdtype = {
                "RequestType": "RemoveProfile",
                "Identifier": this.profileidentifier
            };

        }
    }
    return RemoveProfile;

})();