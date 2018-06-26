var Command = require('./command');

module.exports = (function () {

    class Restrictions extends Command {

        constructor(req, res) {

            super(req, res);
            this.commandname = "Restrictions";
            this.createCommandType();
        }
        createCommandType() {

            this.cmdtype = {
                "RequestType": "Restrictions"
            };
        }

    }
    return Restrictions;
})();