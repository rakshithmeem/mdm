var mongoose = require('mongoose');
var console = require('console');
var Schema = mongoose.Schema;



var profileSchema = new mongoose.Schema({
    
    profileInfo:{
        profilename: {
            type: String,
            unique: true,
            required: true
        },
        OS: Number, //1- Apple, 2-Android, 3- Windows, 4-MacOS, 5-Linux
        description: String,
    },
    profileidentifier:mongoose.Schema.Types.Mixed,
    admin: {
        type: mongoose.Schema.Types.ObjectId, ref:'User'
    },
    deviceLinked:{
        type: mongoose.Schema.Types.ObjectId, ref:'device'
    }
}, {strict: false});

var Profile = mongoose.model('profile', profileSchema);
module.exports = Profile;



// var profileInfoSchema = new Schema({
//     profilename: {
//         type: String,
//         unique: true,
//         required: true
//     },
//     OS: Number, //1- Apple, 2-Android, 3- Windows, 4-MacOS, 5-Linux
//     description: String,
//     profileidentifier:mongoose.Schema.Types.Mixed
    
// }, { _id: false});

// var ProfileInfoModel = mongoose.model('profileInfo', profileInfoSchema);

// var emailProfileSchema = new Schema({
//     PayloadContent: {
//         EmailAccountDescription: String,
//         EmailAccountName: String,
//         EmailAccountType: String,
//         EmailAddress: String,
//         PreventMove: Boolean,
//         PreventAppSheet: Boolean,
//         disableMailRecentsSyncing: Boolean,
//         allowMailDrop: Boolean,
//         IncomingMailServerAuthentication: String,
//         IncomingMailServerHostName: String,
//         IncomingMailServerPortNumber: Number,
//         IncomingMailServerUseSSL: Boolean,
//         IncomingMailServerUsername: String,
//         IncomingPassword: String,
//         OutgoingPassword: String,
//         OutgoingPasswordSameAsIncomingPassword: Boolean,
//         OutgoingMailServerAuthentication: String,
//         OutgoingMailServerHostName: String,
//         OutgoingMailServerPortNumber: Number,
//         OutgoingMailServerUseSSL: Boolean,
//         OutgoingMailServerUsername: String,
//         SMIMEEnabled: Boolean,
//         SMIMESigningEnabled: Boolean,
//         SMIMESigningCertificateUUID: String,
//         SMIMEEncryptionEnabled: Boolean,
//         SMIMEEncryptionCertificateUUID: String,
//         SMIMEEnablePerMessageSwitch: Boolean,
//         _id: false
//     }
// }, { _id: false, strict: false });

// var emailProfileModel = mongoose.model('emailProfileSchema', emailProfileSchema);

// var passcodeProfileSchema = new Schema({
//     PayloadContent:
//         {
//             PayloadDescription: String,
//             PayloadDisplayName: String,
//             PayloadIdentifier: String,
//             PayloadType: String,
//             PayloadUUID: String,
//             PayloadVersion: Number,
//             allowSimple: Boolean,
//             forcePIN: Boolean,
//             maxFailedAttempts: Number,
//             maxGracePeriod: Number,
//             maxInactivity: Number,
//             maxPINAgeInDays: Number,
//             minComplexChars: Number,
//             minLength: Number,
//             pinHistory: Number,
//             requireAlphanumeric: Boolean,
//             _id: false
//         }
// }, { _id: false, strict: false });

// var passcodeProfileModel = mongoose.model('passcodeProfileSchema', passcodeProfileSchema);

// // var restrictionProfileSchema = new Schema({

// //     defaultRestrictions : mongoose.Schema.Types.Mixed,
// //     functionality : mongoose.Schema.Types.Mixed,
// //     security : mongoose.Schema.Types.Mixed,
// //     advancedSecurity : mongoose.Schema.Types.Mixed
// // }, { _id: false, strict: false });

// //var restrictionProfileModel = mongoose.model('restrictionProfile', restrictionProfileSchema);

// // var icloudSchema = new Schema({
// //     PayloadContent: {
// //         PayloadDescription : String,
// //         PayloadDisplayName :  String ,
// //         PayloadIdentifier :  String ,
// //         PayloadType :  String,
// //         PayloadUUID :  String ,
// //         PayloadVersion : Number,
// //          allowCloudBackup : Boolean,
// //          allowCloudDocumentSync : Boolean,
// //          allowPhotoStream : Boolean,
// //          allowCloudKeychainSync : Boolean,
// //          allowCloudPhotoLibrary : Boolean,
// //          allowSharedStream : Boolean,
// //          allowEnterpriseBookBackup : Boolean,
// //          allowEnterpriseBookMetadataSync : Boolean
// //     }
// // });

// // var iCloudModel = mongoose.model('icloudSchema', icloudSchema);


// var webClipSchema = new Schema({
//     FullScreen : Boolean,
//     Icon : Buffer,
//     IsRemovable : Boolean,
//     Label :  String ,
//     PayloadDescription :  String ,
//     PayloadDisplayName :  String ,
//     PayloadIdentifier :  String ,
//     PayloadType :  String ,
//     PayloadUUID :  String ,
//     PayloadVersion : Number,
//     Precomposed : Boolean,
//     URL :  String 
// }, {strict: false});

// var webClipModel = mongoose.model('webClipSchema', webClipSchema);

// var profileArraySchema = Schema({
//     profileInfo: profileInfoSchema,
//     emailProfile: {
//         type: emailProfileSchema,
//         default: null
//     },
//     passcodeProfile: {
//         type: passcodeProfileSchema,
//         default: null
//     },

//     restrictionProfile: {
//         defaultRestrictions: { type: mongoose.Schema.Types.Mixed, default: null },
//         functionality: { type: mongoose.Schema.Types.Mixed, default: null },
//         security: { type: mongoose.Schema.Types.Mixed, default: null },
//         advancedSecurity: { type: mongoose.Schema.Types.Mixed, default: null },
//         icloudProfile :{type: mongoose.Schema.Types.Mixed, default: null},
//         browserProfile :{type: mongoose.Schema.Types.Mixed, default: null},
//         networkProfile :{type: mongoose.Schema.Types.Mixed, default: null}
//         //default: null
//     },

//     webClipProfile: {
//         type: webClipSchema,
//         default: null
//     }
// }, { _id: false, strict: false });

// var profileArrayModel = mongoose.model('profileArraySchema', profileArraySchema);

// // profileArraySchema.methods.createProfile = function(profileInfo){
// //     this.profileInfo = profileInfo;
// // };

// profileArraySchema.methods.updateProfile = function (profileInfo) {
//     this.profileInfo.profilename = profileInfo.profilenewname;
//     this.profileInfo.OS = profileInfo.OS,
//         this.profileInfo.description = profileInfo.description
// }


// profileArraySchema.methods.setEmailProfile = function (emailProfile) {

//     console.log('*****')
//     console.log(JSON.stringify(emailProfile));
//     this.emailProfile = emailProfile;
// }

// profileArraySchema.methods.setPasscodeProfile = function (passcodeProfile) {
//     this.passcodeProfile = passcodeProfile;
// }

// profileArraySchema.methods.setRestrictionProfileDefault = function (restrictionProfileDefault) {

//     this.restrictionProfile.defaultRestrictions = restrictionProfileDefault;
// }

// profileArraySchema.methods.setRestrictionProfileFunctionality = function (restrictionProfileFunctionality) {

//     this.restrictionProfile.functionality = restrictionProfileFunctionality;
// }
// profileArraySchema.methods.setRestrictionProfileSecurity = function (restrictionProfileSecurity) {
//     this.restrictionProfile.security = restrictionProfileSecurity;
// }
// profileArraySchema.methods.setRestrictionProfileAdvancedSecurity = function (restrictionProfileAdvancedSecurity) {

//     this.restrictionProfile.advancedSecurity = restrictionProfileAdvancedSecurity;
// }
// profileArraySchema.methods.setiCloudProfile = function (iCloudProfile) {
//     this.restrictionProfile.icloudProfile = iCloudProfile;
// }

// profileArraySchema.methods.setWebClipProfile = function (webClipProfile) {
//     this.webClipProfile = webClipProfile;
// }

// profileArraySchema.methods.setBrowserProfile = function (browserProfile) {
//     this.restrictionProfile.browserProfile = browserProfile;
// }
// profileArraySchema.methods.setNetworkProfile = function (networkProfile) {
//     this.restrictionProfile.networkProfile = networkProfile;
// }




// var profileSchema = new mongoose.Schema({
//     adminKeyEmail: {
//         type: String,
//         unique: true,
//         required: true
//     },
//     profileArray: [profileArraySchema]
// });

// profileSchema.methods.createProfile = function (profileInfo) {
//     var profileinfo = profileArrayModel({ 'profileInfo': profileInfo });

//     this.profileArray.push(profileinfo);
// }


// profileSchema.methods.addkeyEmail = function (email) {
//     this.adminKeyEmail = email;
// }

// // profileSchema.methods.addProfileName = function (profileInfo) {
// //     this.profileArray.profileInfo = profileInfo;
// // }


// var Profile = mongoose.model('profile', profileSchema);
// module.exports = Profile;
