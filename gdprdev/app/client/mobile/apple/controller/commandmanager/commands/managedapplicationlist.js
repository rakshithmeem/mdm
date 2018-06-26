var Command = require('./command');

module.exports = (function () {

    class ManagedApplicationList extends Command {

        constructor(req, res) {

            super(req, res);
            this.commandname = "ManagedApplicationList";
            this.createCommandType();
        }
        createCommandType() {

            this.cmdtype = {
                "RequestType": "ManagedApplicationList"
            };
        }

    }
    return ManagedApplicationList;
})();