var Profile = require('app/model/schema/profileDB')
var authentication = require('app/model/api/authentication')

// module.exports.saveKeyEmail = function (email) {
//     var profile = new Profile();

//     profile.addkeyEmail(email);

//     profile.save(function (err) {
//         if (err) {
//             console.log('Error while saving add Key')
//             console.log(err)
//         } else {
//             console.log('Key email is successfully saved')
//         }
//     });
// }

module.exports.createProfile = function (tokenID, profileInfo, cb) {

    authentication.fetchIdByTokenId(tokenID, function (Id) {


        var profile = new Profile({
            'profileInfo': profileInfo,
            'admin': Id
        });

        profile.save(function (err) {
            if (err) {
                console.log('Error while saving profile info ' + err);
                cb(false);
            }
            else {
                console.log('Profile info is saved');
                cb(true);
            }
        })
    })
}

module.exports.updateProfile = function (tokenID, profileInfo) {

    var json = {
        'profilename': profileInfo.profilenewname,
        'OS': profileInfo.OS,
        'description': profileInfo.description
    }

    authentication.fetchIdByTokenId(tokenID, function (Id) {
        Profile.findOne({ 'profileInfo.profilename': profileInfo.profileoldname, 'admin': Id },
            function (err, profile) {

                profile.profileInfo = json;
                profile.save(function (err) {
                    if (err)
                        console.log('Error while editing profile info ' + err);
                    else {
                        console.log('Profile info is saved');
                    }
                })
            })
    })
}

module.exports.deleteProfile = function (tokenID, profilename) {
    authentication.fetchIdByTokenId(tokenID, function (Id) {
        Profile.findOne({ 'profileInfo.profilename': profilename, 'admin': Id },
            function (err, profile) {

                profile.remove();
                profile.save(function (err) {
                    if (err)
                        console.log('Error while editing profile info ' + err);
                    else {
                        console.log('Profile info is saved');
                    }
                })
            })
    })
}

var setProfile = function(tokenID, profilename, setQuery){
   
    authentication.fetchIdByTokenId(tokenID, function (Id) {


        Profile.findOneAndUpdate({ 'admin': Id, 'profileInfo.profilename': profilename }, { '$set': setQuery },
            //{ upsert: true, new: true },
            function (err, profile) {
                if (err) {
                    console.log('The error while fetching ' + err)
                }

                profile.save(function (err) {
                    if (err)
                        console.log('Error while saving Profile ' + err);
                    else {
                        console.log('Profile stored')
                }
            });
        })
    })
}
module.exports.setEmailProfile = function (tokenID, profilename, emailProfile) {
    var setQuery = { 'emailProfile': emailProfile }
    setProfile(tokenID, profilename, setQuery);
}

module.exports.setPasscodeProfile = function (tokenID, profilename, passcodeProfile) {

    var setQuery = { 'passcodeProfile': passcodeProfile }
    setProfile(tokenID, profilename, setQuery);
}

module.exports.setRestrictionProfileDefault = function (tokenID, profilename, restrictionProfileDefault) {

    var setQuery = {'restrictionProfile.default':restrictionProfileDefault}
    setProfile(tokenID, profilename, setQuery);
}

module.exports.setFunctionality = function (tokenID, profilename, restrictionProfileFunctionality) {
    var setQuery = {'restrictionProfile.functionality':restrictionProfileFunctionality}
    setProfile(tokenID, profilename, setQuery);
}

module.exports.setSecurity = function (tokenID, profilename, restrictionProfileSecurity) {
    var setQuery = {'restrictionProfile.security':restrictionProfileSecurity}
    setProfile(tokenID, profilename, setQuery);
}

module.exports.setAdvancedSecurity = function (tokenID, profilename, restrictionProfileAdvancedSecurity) {
    var setQuery = {'restrictionProfile.advancedSecurity':restrictionProfileAdvancedSecurity}
    setProfile(tokenID, profilename, setQuery);
}

module.exports.setCertificatepayload= function (tokenID, profilename, certificatepayload) {

    var setQuery = { 'certificatepayload': certificatepayload };
    setProfile(tokenID, profilename, setQuery);
}

module.exports.setManagedWebDomainProfile= function (tokenID, profilename, managedWebDomainpayload) {

    var setQuery = { 'managedWebDomainpayload': managedWebDomainpayload };
    setProfile(tokenID, profilename, setQuery);
}


// module.exports.setEmailProfile = function (tokenID, profilename, emailProfile1) {

//     authentication.fetchIdByTokenId(tokenID, function (Id) {
//         Profile.findOneAndUpdate({ 'admin': Id, 'profileInfo.profilename': profilename }, { '$set': { 'emailProfile': emailProfile1 } },
//             //{ upsert: true, new: true },
//             function (err, profile) {
//                 console.log(JSON.stringify(profile));

//                 if (err) {
//                     console.log('The error while fetching ' + err)
//                 }

//                 profile.save(function (err) {
//                     if (err)
//                         console.log('Error while saving emailProfile ' + err);
//                     else {
//                         console.log('emailProfile stored')
//                 }
//             });
//         })
//     })
// }

module.exports.getEmailProfile = function (tokenID, profileName, emailProfileCB) {

    authentication.fetchIdByTokenId(tokenID, function (Id) {
        Profile.findOne({ 'admin': Id, 'profileInfo.profilename': profileName}, 'emailProfile', { '_id': 0, '__v': 0 }, function (err, profile) {
            if (err) {
                console.log('Error while getting email profile')
            } else if (!profile) {
                console.log('Profile is null');
            } else {

                console.log(JSON.stringify(profile));
                // var emailJson = JSON.stringify(profile.profileArray[0].emailProfile);
                // var emailParsedJson = JSON.parse(emailJson);

                emailProfileCB(emailParsedJson);
            }
        })
    })

}

module.exports.getPasscodeProfile = function (tokenID, profileName, passcodeProfileCB) {

    authentication.fetchIdByTokenId(tokenID, function (Id) {

        Profile.findOne({ 'admin': Id, 'profileInfo.profilename': profileName},'passcodeProfile', { '_id': 0, '__v': 0 }, function (err, profile) {
            if (err) {
                console.log('Error while getting email profile')
            } else if (!profile) {
                console.log('Profile is null');
            } else {

                var passcodeJson = JSON.stringify(profile.profileArray[0].passcodeProfile);
                var passcodeParsedJson = JSON.parse(passcodeJson);
                passcodeProfileCB(passcodeParsedJson);
            }
        })
    })
}

module.exports.getRestrictionProfile = function (tokenID, profileName, restrictionProfileCB) {

    authentication.fetchIdByTokenId(tokenID, function (Id) {

        Profile.findOne({'admin': Id, 'profileInfo.profilename': profileName}, 'restrictionProfile', { '_id': 0, '__v': 0 }, function (err, profile) {
            if (err) {
                console.log('Error while getting email profile')
            } else if (!profile) {
                console.log('Profile is null');
            } else {
                //console.log('% '+profile.profileArray[0].restrictionProfile)

                var restrictionJson = JSON.stringify(profile.profileArray[0].restrictionProfile);
                var restrictionParsedJson = JSON.parse(restrictionJson);
                restrictionProfileCB(restrictionParsedJson);
            }
        })
    })
}

module.exports.getProfiles = function (tokenID, profileName, profilesCB) {

    authentication.fetchIdByTokenId(tokenID, function (Id) {

        Profile.findOne({ 'admin': Id, 'profileInfo.profilename': profileName}, { '_id': 0, '__v': 0 }, function (err, profile) {
            if (err) {
                console.log('Error while getting email profile')
            } else if (!profile) {
                console.log('Profile is null');
            } else {
                
                var profileJson = JSON.stringify(profile);
                var profileParsedJson = JSON.parse(profileJson);
                // console.log('11')
                // console.log(profile.profileInfo.prof)
                // var profileIdentifierJson = JSON.stringify(profile.profileInfo);
                // var profileIdentifierParsedJson = JSON.parse(profileIdentifierJson);

                // console.log('2')
                // console.log(JSON.stringify(profile))

                // var emailJson = JSON.stringify(profile.emailProfile);
                // var emailParsedJson = JSON.parse(emailJson);

                // console.log('3')

                // // var passcodeJson = JSON.stringify(profile.passcodeProfile);
                // // var passcodeParsedJson = JSON.parse(passcodeJson);

                // passcodeParsedJson = null;
                // console.log('4')

                // var restrictionJson = JSON.stringify(profile.restrictionProfile);
                // var restrictionParsedJson = JSON.parse(restrictionJson);

                console.log('5')

                // var webclipJson = JSON.stringify(profile.webClipProfile);
                // var webclipParsedJson = JSON.parse(webclipJson);
                //webclipParsedJson = null;
                profilesCB(profileParsedJson.profileInfo, profileParsedJson.emailProfile, profileParsedJson.passcodeProfile, profileParsedJson.webClipProfile,
                    profileParsedJson.certificatepayload, profileParsedJson.managedWebDomainpayload, profileParsedJson.restrictionProfile);
            }
        })
    })
}

module.exports.deregisterAdmin = function (email) {
    Profile.deleteOne({ 'adminKeyEmail': email }, function (err) {
        if (err) {
            console.log('Error in droping the profile details of ' + email)
        } else
            console.log('Droping profile detail success for ' + email)
    })
}

module.exports.setiCloudProfile = function (tokenID, profilename, iCloudProfile) {

    authentication.fetchIdByTokenId(tokenID, function (Id) {

        console.log('##'+profilename+'  '+Id);
        Profile.findOneAndUpdate({ 'admin': Id, 'profileInfo.profilename': profilename}, { '$set': { 'restrictionProfile.iCloudProfile': iCloudProfile}},function (err, profile) {

            console.log('111')
            if (err) {
                console.log('The error while fetching ' + err)
            }
            profile.save(function (err) {
                if (err)
                    console.log('Error while saving iCloudProfile ' + err);
                else {
                    console.log('iCloudProfile stored')
                }
            });
        })
    })
}

module.exports.setWebClipProfile = function (tokenID, profilename, webClipProfile) {


    authentication.fetchIdByTokenId(tokenID, function (Id) {
        Profile.findOneAndUpdate({ 'admin': Id, 'profileInfo.profilename': profilename}, { '$set': { 'restrictionProfile.webClipProfile': webClipProfile}},function (err, profile) {
            if (err) {
                console.log('The error while fetching ' + err)
            }
            profile.save(function (err) {
                if (err)
                    console.log('Error while saving webClipProfile ' + err);
                else {
                    console.log('webClipProfile stored')
                }
            });
        })
    })
}


module.exports.setBrowserProfile = function (tokenID, profilename, browserProfile) {

    authentication.fetchIdByTokenId(tokenID, function (Id) {
        Profile.findOneAndUpdate({ 'admin': Id, 'profileInfo.profilename': profilename}, { '$set': { 'restrictionProfile.browserProfile': browserProfile }},function (err, profile) {
            if (err) {
                console.log('The error while fetching ' + err)
            }
            profile.save(function (err) {
                if (err)
                    console.log('Error while saving browserProfile ' + err);
                else {
                    console.log('browserProfile stored')
                }
            });
        })
    })
}

module.exports.setNetworkProfile = function (tokenID, profilename, networkProfile) {

    authentication.fetchIdByTokenId(tokenID, function (Id) {
        Profile.findOneAndUpdate({ 'admin': Id, 'profileInfo.profilename': profilename},{ '$set': { 'restrictionProfile.networkProfile': networkProfile }}, function (err, profile) {
            if (err) {
                console.log('The error while fetching ' + err)
            }
            profile.save(function (err) {
                if (err)
                    console.log('Error while saving networkProfile ' + err);
                else {
                    console.log('networkProfile stored')
                }
            });
        })
    })
}

module.exports.setContentratingProfile = function (tokenID, profilename, contentRating) {

    authentication.fetchIdByTokenId(tokenID, function (Id) {

        //console.log('Email: ' + email + '    ' + profilename);
        Profile.findOneAndUpdate({ 'admin': Id, 'profileInfo.profilename': profilename }, 
                                    {'$set':{'restrictionProfile.contentRating':contentRating}},
                                     function (err, profile) {
            if (err) {
                console.log('The error while fetching ' + err)
            }
            profile.save(function (err) {
                if (err)
                    console.log('Error while saving restrictionProfile ' + err);
                else {
                    console.log('restrictionProfile SUCCESSFULY stored')
                }
            });
        })
    })
}

module.exports.setPrivacyProfile = function (tokenID, profilename, privacy) {

    authentication.fetchIdByTokenId(tokenID, function (Id) {

        //console.log('Email: ' + email + '    ' + profilename);
        Profile.findOneAndUpdate({ 'admin': Id, 'profileInfo.profilename': profilename }, 
                                    {'$set':{'restrictionProfile.privacy':privacy}},
                                     function (err, profile) {
            if (err) {
                console.log('The error while fetching ' + err)
            }
            profile.save(function (err) {
                if (err)
                    console.log('Error while saving restrictionProfile ' + err);
                else {
                    console.log('restrictionProfile SUCCESSFULY stored')
                }
            });
        })
    })
}

module.exports.setApplicationsProfile = function (tokenID, profilename, applications) {

    authentication.fetchIdByTokenId(tokenID, function (Id) {

        //console.log('Email: ' + email + '    ' + profilename);
        Profile.findOneAndUpdate({ 'admin': Id, 'profileInfo.profilename': profilename }, 
                                    {'$set':{'restrictionProfile.applications':applications}},
                                     function (err, profile) {
            if (err) {
                console.log('The error while fetching ' + err)
            }
            profile.save(function (err) {
                if (err)
                    console.log('Error while saving restrictionProfile ' + err);
                else {
                    console.log('restrictionProfile SUCCESSFULY stored')
                }
            });
        })
    })
}




