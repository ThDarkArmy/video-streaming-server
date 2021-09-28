import jwt from 'jsonwebtoken'
import fs from 'fs'

const PRIV_KEY = fs.readFileSync("\D:\\Node Js\\VideoStreamingServer\\crypto\\id_rsa_priv.pem",'utf8')
const PUB_KEY = fs.readFileSync("\D:\\Node Js\\VideoStreamingServer\\crypto\\id_rsa_pub.pem",'utf8')


const payload = {
    sub: "subject",
    name: "dark Army"
}

const options = {
    expiresIn: '1h',
    issuer: "Dark Army",
    audience: "World",
    algorithm: 'RS256'
}


const token = jwt.sign(payload, PRIV_KEY, options)

jwt.verify(token, PUB_KEY, {algorithms: ['RS256']}, (err, payload)=>{
    console.log(err)
    console.log(payload)
})