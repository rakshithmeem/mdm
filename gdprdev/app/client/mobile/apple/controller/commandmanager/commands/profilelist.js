var Command = require('./command');

module.exports = (function () {

    class ProfileList extends Command {

        constructor(req, res) {

            super(req, res);
            this.commandname = "ProfileList";
            this.createCommandType();
        }
        createCommandType() {

            this.cmdtype = {
                "RequestType": "ProfileList"
            };
        }

    }
    return ProfileList;
})();