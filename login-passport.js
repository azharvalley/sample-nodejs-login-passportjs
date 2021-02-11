var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const fs = require('fs')
var passport = require('passport');
var saml = require('passport-saml');

const hostname = '127.0.0.1';
const port = 3030;

const decryptionCert = fs.readFileSync('./certificates/certificate.crt', 'utf8')

//**Passport saml Strategy */

var samlStrategy = new saml.Strategy({
    path: `http://${hostname}:${port}/login/callback`,
    entryPoint: "https://idp.testshib.org/idp/profile/SAML2/Redirect/SSO",
    issuer: `http://${hostname}:${port}`,
    decryptionPvk: decryptionCert
}, function (profile, done) {
    return done(null, profile);
});

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(samlStrategy);
samlStrategy.generateServiceProviderMetadata(decryptionCert);
//**  */

var app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/login-passport.html'));
});

app.get(
    '/login',
    passport.authenticate('saml', { 'successRedirect': '/', 'failureRedirect': '/login' })
);


app.post(
    '/login/callback',
    passport.authenticate('saml', { 'failureRedirect': '/', 'failureFlash': true }),
    function (req, res) {
        console.log('POST [/login] \n');
        res.redirect('/');
    }
);


app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

