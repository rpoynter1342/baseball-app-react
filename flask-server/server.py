from flask import Flask, session, abort, redirect, request, jsonify
from jose import jwt
from jose.exceptions import JWTError
from flask_cors import CORS
from unidecode import unidecode
import requests
import os
import datetime
from private import link, GOOGLE_CLIENT_ID, GOOGLE_SECRET
from datetime import datetime, timedelta

import statsapi

import pymongo

from pymongo import MongoClient

import datetime

today = datetime.date.today()
past_week = today - timedelta(days=7)
year = today.year

# mongo db init, var link is hidden in a 'private.py' file and not tracked by git because github yealled at me
cluster = MongoClient(link)
db = cluster["App"]
collection = db["users"]

app = Flask(__name__)
CORS(app)

season_data = statsapi.latest_season()
cur_season = season_data['seasonId']

# get list of teamID nums for STATSAPI use


teams = statsapi.get('teams', {'sportId': 1, 'season': year})


def get_public_key(kid):
    url = "https://www.googleapis.com/oauth2/v3/certs"
    response = requests.get(url)
    keys = response.json()["keys"]
    for key in keys:
        if key["kid"] == kid:
            return key
    return None


@app.route('/token', methods=['POST'])
def token():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    token = request.json.get('token', None)
    if not token:
        return jsonify({"msg": "Missing token parameter"}), 400

    # Token validation
    try:
        # This will raise an error if the token is invalid
        header = jwt.get_unverified_header(token)
        key_id = header.get('kid')
        key = get_public_key(key_id)
        if key:
            decoded = jwt.decode(token, key, algorithms='RS256', audience=GOOGLE_CLIENT_ID)
        else:
            raise JWTError("Invalid key ID")
    except JWTError as e:
        return jsonify({"msg": "Invalid token", "error": str(e)}), 400

    # If we get here, the token is valid
    user_id = decoded['sub']
    
    user = collection.find_one({'userid': user_id})

    if user is None:
        new_user = {"userid": user_id}
        collection.insert_one(new_user)
        return {user_id: 'New user created.'}, 201

    return {'userid': user_id, 'favorites': user['favorites']}, 200

@app.route('/add_fav', methods=['POST'])
def add_fav():
    data = request.get_json()
    new_fav = data['newFav']
    user_id = data['user']['userid']
    query = {'userid': user_id}
    update = { "$push": {"favorites": new_fav} }

    collection.update_one(query, update)
    
    user = collection.find_one({'userid': user_id})
    print(user)
    return {'userid': user_id, 'favorites': user['favorites']}, 200

@app.route('/remove_fav', methods=['POST'])
def remove_fav():
    data = request.get_json()
    remove = data['remove']
    user_id = data['user']['userid']
    query = {'userid': user_id}
    update = { "$pull": {"favorites": remove} }

    collection.update_one(query, update)
    
    user = collection.find_one({'userid': user_id})
    print(user)
    return {'userid': user_id, 'favorites': user['favorites']}, 200

@app.route('/main_home')
def main_home():
    # needs teams, standings, scores/upcoming games
    # maybe news
    
    data = {}
    data['teams'] = teams
    data['standings'] = statsapi.get('standings', {'leagueId': '103,104'})
    data['schedule'] = statsapi.get('schedule', {'sportId': 1, 'startDate': past_week,'endDate': today})
    data['divisions'] = statsapi.get('divisions', {'sportId': 1})
    return(data)


if __name__ == '__main__':
    app.run(debug=True, host=os.getenv('IP', '0.0.0.0'), 
        port=int(os.getenv('PORT', 4444)))