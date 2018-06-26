
const uuidv1 = require('uuid/v1');
var authentication = require('app/model/api/authentication');

/** This function Saves Device Email Configuration Details to a profile
*/
var Profile = require('app/model/api/profile');

exports.ManageEmailProfile = function (req, res) {
	if (!req.body) return res.sendStatus(400)

	var tokenID = req.body.tokenID;
	var emailprofileName = req.body.profilename;

	console.log('SetEmail Profile ,Name: ' + emailprofileName + ' ' + tokenID);

	var emailUUID = uuidv1();

	var emailJson = {
		
		"PayloadContent":{

			"EmailAccountDescription": req.body.EmailAccountDescription,
			"EmailAccountName": req.body.AccountDisplay,
			"EmailAccountType": req.body.accountType,
			"EmailAddress": req.body.senderEmail,
			"IncomingMailServerAuthentication": req.body.incoming.authType,
			"IncomingMailServerHostName": req.body.incoming.mailServer,
			"IncomingMailServerPortNumber": parseInt(req.body.incoming.port),
			"IncomingMailServerUseSSL": req.body.incoming.ssl,
			"IncomingMailServerUsername": req.body.incoming.userName,
			"OutgoingMailServerAuthentication": req.body.outgoing.authType,
			"OutgoingMailServerHostName": req.body.outgoing.mailServer,
			"OutgoingMailServerPortNumber": parseInt(req.body.outgoing.port),
			"OutgoingMailServerUseSSL": req.body.outgoing.ssl,
			"OutgoingMailServerUsername": req.body.outgoing.userName,
			"OutgoingPasswordSameAsIncomingPassword": req.body.outgoing.outgoingIncomingMailserverSamePass,
			"PayloadDescription": "Configures Email settings",
			"PayloadDisplayName": req.body.EmailAccountDescription,
			"PayloadIdentifier": "com.apple.mail.managed." + emailUUID,
			"PayloadType": "com.apple.mail.managed",
			"PayloadUUID": emailUUID,
			"PayloadVersion": 1,
			//  these params yet to be decided on how to present it to user 
			"PreventMove": true,
			"SMIMEEnablePerMessageSwitch": false,
			"SMIMEEnabled": false,
			"SMIMEEncryptionEnabled": false,
			"SMIMESigningEnabled": false,
			"allowMailDrop": false,
			"disableMailRecentsSyncing": true
		}
	};

	console.log("Email Json: " + JSON.stringify(emailJson));
	Profile.setEmailProfile(tokenID, emailprofileName, emailJson)
	res.sendStatus(200);


}