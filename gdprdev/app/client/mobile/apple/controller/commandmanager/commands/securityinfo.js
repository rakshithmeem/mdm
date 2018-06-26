var Command = require('./command');

module.exports = (function () {

    class SecurityInfo extends Command {

        constructor(req, res) {

            super(req, res);
            this.commandname = "SecurityInfo";
            this.createCommandType();
        }
        createCommandType() {

            this.cmdtype = {
                "RequestType": "SecurityInfo",
                "Queries": ["HardwareEncryptionCaps", "PasscodePresent", "PasscodeCompliant", "PasscodeCompliantWithProfiles"]
            };
        }

    }
    return SecurityInfo;
    
})();