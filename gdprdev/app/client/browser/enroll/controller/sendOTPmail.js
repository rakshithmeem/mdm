'use strict';
const nodemailer = require('nodemailer');
var constants = require('utils/constants');

var hbs = require('nodemailer-express-handlebars');
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "meemqatest@gmail.com",
        pass: "meemsl123"
    }
});

transporter.use('compile', hbs({
    viewPath: '',
    extName: '.hbs'
}));






module.exports.sendMail = function (obj, callback) {

    console.log("", obj.req.email);
    // setup email data with unicode symbols
    var httpLink ;
    if (constants.MICROSOFT_AZURE) {
        httpLink = constants.AZURE.SERVERURL;
    } else if (constants.LOCAL_SERVER) {
        httpLink = constants.LOCAL.SERVERURL;
    }

    let mailOptions = {
        from: '"Admin" <meemqatest@gmail.com>', // sender address
        to: obj.req.email, // list of receivers
        subject: 'Device Enrollment Request from MDM ', // Subject line
        //text: 'Hello world?', // plain text body
        //html: '<b>Hello world?</b>' // html body
        template: 'otp',
        context: {
            user_name: obj.req.name,
            opt_string: obj.otp,
            http_link: httpLink + '/meem/mdm/enr/' + obj.routeId+"?id="+obj.hash
        }
    };

    console.log("mail options", mailOptions);
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            callback(error);
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        callback(null);
    });
}

