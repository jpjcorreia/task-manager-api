const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "gravecard@gmail.com",
        subject: "Thanks for joining our awesome task app",
        text: `Welcome to the app, ${name}. Please provide any feedback to us.`
    });
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "gravecard@gmail.com",
        subject: "Sorry to see you go!",
        text: `Goodbye, ${name}. Please comeback.`
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}