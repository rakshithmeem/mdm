/** This function Saves Device Wifi Details to a profile
*/

exports.WifiProfile = function (req, res) {

    if (!req.body) return res.sendStatus(406)

    console.log('Manage Restriction Profiles..');
    res.end();

};