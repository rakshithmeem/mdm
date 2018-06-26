var Command = require('./command');

module.exports = (function () {

    class InstalledApplicationList extends Command {

        constructor(req, res) {

            super(req, res);
            this.commandname = "InstalledApplicationList";
            this.createCommandType();
        }
        createCommandType() {

            this.cmdtype = {
                "RequestType": "InstalledApplicationList"
            };
        }

    }
    return InstalledApplicationList;
})();