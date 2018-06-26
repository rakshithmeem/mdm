var Command = require('./command');

module.exports = (function () {

    class RemoveApp extends Command {

        constructor(req, res) {

            super(req, res);
            this.commandname = "RemoveApp";
            this.createCommandType();
        }

        createCommandType() {

            this.cmdtype = {
                "RequestType": "RemoveApplication",
                "Identifier": "com.meemgdpr.mdm"
            };

        }

    }
    return RemoveApp;
})();