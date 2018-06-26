const uuid = require('uuid/v1');
var plist = require('plist');
var MDM = require('../../mdmqueue');

/**Base MDM Command Class*/

module.exports = (function () {

    class Command {

        constructor(req, res, name) {

            this.req = req;
            this.res = res;
            this.commandjson = null;
            this.commanddata = null;
            this.commandname = "Command";
            this.cmdtype = null;
        }

        /*** Implementation required, Abstract function*/

        createCommandType() {

            throw new Error('Command Type Should be Implemented!!');
        }

        push() {

            this.commandjson = {
                "Command": this.cmdtype,
                "CommandUUID": uuid()
            };
            this.commanddata = plist.build(this.commandjson);

            console.log("******Queuing Cmd*********");
            console.log("Type: " + this.commandname);
            console.log("Data: " + this.commanddata );

            MDM.Queue.push(this.commanddata);

        }

    }
    return Command;
})();