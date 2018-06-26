var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var console = require('console');

var userSchema = new mongoose.Schema({
	email:{
		type:String,
		unique:true,
		required:true
	},
	username:{
		type:String,
		required:true
	},
	hash:String,
	salt:String,
	authID:String,
	orgIdHash:String,
	deviceArray: [{type : mongoose.Schema.ObjectId, ref:'device'}],
	profileArray:  [{type : mongoose.Schema.ObjectId, ref:'profile'}]
});

/*
 * Hash is generated from password and salt using PBKDF2. Password 
 * is not stored anywhere in the database. 
 * @param password - password set by the user
*/
userSchema.methods.SetPassword = function(password){
	console.log('password %s', password);
	/* Get types of Hashing algo supported
     * const hashes = crypto.getHashes();
     * console.log(hashes);
    */
	this.salt = crypto.randomBytes(16).toString('hex');
	console.log('salt %s', this.salt);
	/*number of iterations:1000
	  Key length:64
	  digest used:sha512*/
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
	console.log('hash %s', this.hash);
};

/*
 * Verifies whether the given password matches with the password
 * stored in the DB. The hash is generated using the given password
 * and compared with the hash stored in the DB.
 * @param password - password to be verified
 * @returns if hash match is true or false 
 */
userSchema.methods.verifyPassword = function(password){
    console.log('password %s',password);
	var hashnew = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
	return this.hash === hashnew;
};
/*
  Json WebToken is generated. This token will be used as 
the authentication ID in all the REST APIs
*/
userSchema.methods.generateJWT = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
    console.log('email %s', this.email);

  this.authID = jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.username,
    exp: parseInt(expiry.getTime() / 1000),
  }, process.env.CUSTOMCONNSTR_jwtsecret || "meemmemory"); 
  return this.authID;
};

// userSchema.method.setAPNCert = function(certObj) {
// 		this.email = certObj.email;
// 		this.organization = certObj.organization;
// 		this.appleID = certObj.appleID;
// 		this.certificatename = certObj.certificatename;
// 		this.UID = certObj.UID;
// 		this.creationdate = certObj.creationdate;
// 		this.expirydate = certObj.expirydate;
// 		this.notificationemail = certObj.notificationemail;
// }

userSchema.methods.verifyAuthID = function(authID) {
	return this.authID === authID;
};

module.exports = mongoose.model('user', userSchema,'user');
