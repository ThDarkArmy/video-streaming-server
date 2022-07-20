import {createTransport } from 'nodemailer';
import { EMAIL, PASSWORD} from "../constants";


const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: EMAIL,
        pass: PASSWORD
    },
    tls: {
        ciphers: 'SSLv3'
    }
})


class MailSender{
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

        console.log(mailOptions, PASSWORD)
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



export default MailSender;

// const mail = new MailSender('jaccobrths@gmail.com', 'subject', 'message from nodemailer');
// mail.sendMail();