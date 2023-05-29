from flask import Flask, session, abort, redirect, request, jsonify
from jose import jwt
from jose.exceptions import JWTError
from flask_cors import CORS
from flask_socketio import SocketIO, emit
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

print(today)
# mongo db init, var link is hidden in a 'private.py' file and not tracked by git because github yealled at me
cluster = MongoClient(link)
db = cluster["App"]
collection = db["users"]

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

season_data = statsapi.latest_season()
cur_season = season_data['seasonId']

# get list of teamID nums for STATSAPI use

league_leader_stat_cats = [ 
'battingAverage', 
'sluggingPercentage',
'onBasePercentage',
'onBasePlusSlugging',
'doubles',
'triples',
'homeRuns',
'runs', 
'runsBattedIn',
'hits',
'strikeouts',
'stolenBases', 
'earnedRunAverage',
'walksAndHitsPerInningPitched',
'strikeoutsPer9Inn',
'strikeoutWalkRatio',
'pitchesPerInning',
'wins',
]


# 'errors',
# 'losses',
# 'walksPer9Inn',

teams = statsapi.get('teams', {'sportId': 1, 'season': year})


def get_public_key(kid):
    url = "https://www.googleapis.com/oauth2/v3/certs"
    response = requests.get(url)
    keys = response.json()["keys"]
    for key in keys:
        if key["kid"] == kid:
            return key
    return None


@app.route('/get_user', methods=['POST'])
def get_user():
    login = request.get_json()['token']
    # Token validation
    try:
        # This will raise an error if the token is invalid
        header = jwt.get_unverified_header(login)
        key_id = header.get('kid')
        key = get_public_key(key_id)
        if key:
            decoded = jwt.decode(login, key, algorithms='RS256', audience=GOOGLE_CLIENT_ID)
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

    print(user)
    return {'userid': user_id, 'favorites': user['favorites'], 'darkmode': user['darkmode']}, 200

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
    return {'userid': user_id, 'favorites': user['favorites'], 'darkmode': user['darkmode']}, 200

@app.route('/set_darkmode', methods=['POST'])
def set_darkmode():
    data = request.get_json()
    user_id = data['user']['userid']
    query = {'userid': user_id}
    update = { "$set": {"darkmode": data['update']} }

    collection.update_one(query, update)
    
    user = collection.find_one({'userid': user_id})
    print(user)
    return {'userid': user_id, 'favorites': user['favorites'], 'darkmode': user['darkmode']}, 200

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

@app.route('/get_regular_game')
def get_regular_game():
    game = request.get_json()
    data = {}
    data = statsapi.get('game_playByPlay', {'gamePk': game['gamePk']})
    return(data)

@app.route('/get_top_players')
def get_top_players():

    data = {
        
    }

    player_info = {

    }

    for item in league_leader_stat_cats:
        try:
            data[item] = (statsapi.league_leader_data(item, limit=3))
        except Exception as e:
            print(f"Error fetching league leader data for {item}: {e}")

    

    for stat in data:
        for line in data[stat]:
            p_info = statsapi.lookup_player(line[1])
            player_info[line[1]] = p_info
    

    
    print(player_info)

    

    return({'data': data, 'player_info': player_info})




# to be moved to a different module at somepoint

@socketio.on('connect')
def initial_connection():
    emit('response', {'data': 'Connected'})

@socketio.on('get game data')
def get_game_data(game):
    print(game)
    emit('game data response', {'data': statsapi.get('game_playByPlay', game)})

@socketio.on('get main data')
def get_data():
    data = {}
    data['teams'] = teams
    data['standings'] = statsapi.get('standings', {'leagueId': '103,104'})
    data['schedule'] = statsapi.get('schedule', {'sportId': 1, 'startDate': past_week,'endDate': today})
    data['divisions'] = statsapi.get('divisions', {'sportId': 1})
    emit('response', data)

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, debug=True, port=4444)