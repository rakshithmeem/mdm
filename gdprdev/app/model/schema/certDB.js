var mongoose = require('mongoose')

var certificateSchema = new mongoose.Schema({
	admin:{
		type: mongoose.Schema.Types.ObjectId, ref:'User',
		unique: true
	},
	apnCert: Buffer,
	apnKey: Buffer,
	mobConfigCert: Buffer
});

certificateSchema.methods.addKeyEmail = function(email){
    this.adminKeyEmail = email;
};

certificateSchema.methods.addAPNCert = function(apnCert, apnKey){

	console.log('Inserting to CERT and KEY')
	this.apnCert = apnCert;
	this.apnKey  = apnKey;
};

certificateSchema.methods.addMobileConfig = function(mobconfig){
    this.mobConfigCert = mobconfig;
} 

var Certificate = mongoose.model('cert', certificateSchema);
module.exports = Certificate; 
