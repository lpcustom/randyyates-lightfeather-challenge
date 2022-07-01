const express = require('express');
const https = require('https');
const cors = require('cors');
const validatePhoneNumber = require('validate-phone-number-node-js');
const app = new express();
app.use(require('body-parser').urlencoded({extended: false}));
app.use(cors());
app.use(express.json());

const filterAndSort = function(data) {
    const newData = data.filter(d => {
        const regex = /\d/
        if (d.jurisdiction.match(regex) !== null) {
            return false;
        } else {
            return d;
        }
      }
    );
    newData.sort(
      function(a, b) {
          if(a.jurisdiction === b.jurisdiction) {
              if(a.lastName === b.lastName) {
                  return a.firstName.localeCompare(b.firstName);
              } else {
                  return a.lastName.localeCompare(b.lastName);
              }
          } else {
              return a.jurisdiction.localeCompare(b.jurisdiction);
          }
      }
    )
    const ret = [];
    newData.forEach((n) => {
        ret.push(n.jurisdiction + ' - ' + n.lastName + ', ' + n.firstName);
    });
    return ret;
}

const validEmail = function(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
}

const validPhoneNumber = function(number) {
    console.log(number);
    return validatePhoneNumber.validate(number);
}

app.get('/api/supervisors', async (req, res) => {
    https.get('https://o3m5qixdng.execute-api.us-east-1.amazonaws.com/api/managers', (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            data = filterAndSort(JSON.parse(data));
            res.setHeader('Content-Type', 'application/json');
            const ret = {'results': data};
            res.json(ret);
        });
    })
});

app.post('/api/submit',  (req, res) => {
    if (!req.body.firstName || req.body.firstName.length < 1) {
        return res.status(400).json({success: false, message: 'firstName required'});
    }
    if (!req.body.lastName || req.body.lastName.length < 1) {
        return res.status(400).json({success: false, message: 'lastName required'});
    }
    if (!req.body.supervisor || req.body.supervisor.length < 1) {
        return res.status(400).json({success: false, message: 'supervisor required'});
    }
    if (req.body.email && req.body.email.length > 0 && !validEmail(req.body.email)) {
        return res.status(400).json({success: false, message: 'Invalid email address provided'});
    }
    if (req.body.phoneNumber && req.body.phoneNumber.length > 0 && !validPhoneNumber(req.body.phoneNumber)) {
        return res.status(400).json({success: false, message: 'Invalid phone number provided'});
    }
    const fn = req.body.firstName ? req.body.firstName : '';
    const ln = req.body.lastName ? req.body.lastName : '';
    const pn = req.body.phoneNumber ? req.body.phoneNumber : '';
    const em = req.body.email ? req.body.email : '';
    const su = req.body.supervisor ? req.body.supervisor : '';

    const ret = {firstName: fn, lastName: ln, phoneNumber: pn, email: em, supervisor: su};
    console.log(ret);
    return res.json(ret);
});

app.listen(5001, () => {
    console.log('Listening on 5001. Ctrl+c to stop this server.')
});
