var Command = require('./command');

module.exports = (function () {

    class DeviceLock extends Command {

        constructor(req, res) {

            super(req, res);
            this.commandname = "DeviceLock";
            this.createCommandType();
        }

        createCommandType() {

            this.cmdtype = {
                "RequestType": "DeviceLock"
            };

        }

    }
    return DeviceLock;
})();