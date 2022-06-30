import json
import re

import phonenumbers
import requests
from flask import Flask, make_response, request, logging
from flask_cors import CORS
from flask_restful import Api, Resource


class Supervisors(Resource):

    def get(self):
        response = requests.get('https://o3m5qixdng.execute-api.us-east-1.amazonaws.com/api/managers')
        resp = json.loads(response.text)
        clean_resp = []
        for r in resp:
            if not r['jurisdiction'].isnumeric():
                clean_resp.append(r)
        resp = sorted(clean_resp, key=lambda k: (k['jurisdiction'], k['lastName'], k['firstName']))
        formatted_resp = []
        for r in resp:
            formatted_resp.append(r['jurisdiction'] + ' - ' + r['lastName'] + ', ' + r['firstName'])
        ret = {
            'success': True,
            'results': formatted_resp
        }
        return ret, 200


class Submit(Resource):

    def post(self):
        d = {}
        if 'firstName' not in request.values:
            return {'message': 'firstName is required'}, 400
        else:
            d['firstName'] = request.values['firstName']

        if 'lastName' not in request.values:
            return {'message': 'lastName is required'}, 400
        else:
            d['lastName'] = request.values['lastName']

        if 'supervisor' not in request.values:
            return {'message': 'supervisor is required'}, 400
        else:
            d['supervisor'] = request.values['supervisor']

        if 'email' in request.values and not self.is_email_address(request.values['email']):
            return {'message': 'invalid email address'}, 400
        elif 'email' in request.values:
            d['email'] = request.values['email']

        if 'phoneNumber' in request.values and len(request.values['phoneNumber']) > 0 and not self.is_phone_number(request.values['phoneNumber']):
            return {'message': 'invalid phone number'}, 400
        elif 'phoneNumber' in request.values:
            d['phoneNumber'] = request.values['phoneNumber']

        print(d)
        return d, 200

    def is_phone_number(self, value):
        try:
            number = phonenumbers.parse(value)
        except Exception as e:
            print(e)
            return False
        if phonenumbers.is_possible_number(number):
            return number
        else:
            return False

    def is_email_address(self, value):
        regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        if re.fullmatch(regex, value):
            return value
        else:
            return False


app = Flask(__name__)
app.debug = True
CORS(app, resources={"*": {"origins": "*"}})
rest_api = Api(app)


@rest_api.representation('application/json')
def output_json(data, code, headers=None):
    resp = make_response(json.dumps(data), code)
    resp.headers.extend(headers or {})
    return resp


rest_api.add_resource(Supervisors, '/api/supervisors/', '/api/supervisors')
rest_api.add_resource(Submit, '/api/submit/', '/api/submit')

if __name__ == '__main__':
    app.run()
