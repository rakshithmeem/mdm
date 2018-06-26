var Command = require('./command');

module.exports = (function () {

    class CertificateList extends Command {

        constructor(req, res) {

            super(req, res);
            this.commandname = "CertificateList";
            this.createCommandType();
        }
        createCommandType() {

            this.cmdtype = {
                "RequestType": "CertificateList"
            };
        }

    }
    return CertificateList;
})();