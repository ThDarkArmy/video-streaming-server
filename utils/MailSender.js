const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
    tls: {
        ciphers: 'SSLv3'
    }
})

class SendMail{
    constructor(to, subject, text){
        this.to = to
        this.subject = subject
        this.text = text
    }

    sendMail(){
        const mailOptions = {
            from : process.env.EMAIL,
            to: this.to,
            subject: this.subject,
            html: this.text
        }
        transporter.sendMail(mailOptions, (err, info)=>{
            if(err){
                console.log(err)
                return err
            }
            else{
                console.log("email sent: ", info.response)
                return info
            }
        })
    }
}



module.exports = SendMail;

// const mail = new SendMail('jaccobrths@gmail.com', 'subject', 'message from nodemailer');
// mail.sendMail();