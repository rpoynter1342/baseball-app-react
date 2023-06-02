from flask import Flask, session, abort, redirect, request, jsonify
from jose import jwt
from jose.exceptions import JWTError
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from unidecode import unidecode
import requests
import os
import datetime
import pandas as pd
from datetime import timedelta
from private import link, GOOGLE_CLIENT_ID, GOOGLE_SECRET
from tensorflow.keras.models import load_model
from sklearn.preprocessing import StandardScaler
import numpy as np
import statsapi

import pymongo

from pymongo import MongoClient





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

]


# params = {
#         "statType": "byDateRange",
#         "startDate": "05/08/2022",
#         "endDate": "05/22/2022",
#         "personId": 592450
#     }
# print(statsapi.get("meta", {'items': 'stats'}))

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

@app.route('/pastSevenStats')
def pastSevenStats():
    today = datetime.date.today()
    numDays = 7
    data = []
    pid = request.args.get('id')
    model = load_model('hitter_model_avg.h5')
    for i in range(0, 7):
        date_range = today - timedelta(days=i)
        url = "https://statsapi.mlb.com/api/v1/people/"+pid+"?hydrate=stats(group=[hitting],type=[byDateRange],startDate="+str(date_range)+",endDate="+str(date_range)+",force=True)"
        response = requests.get(url)
        data.append({'date': str(date_range), 'data': response.json()})

    processed_data = []
    for item in data:
        for key in item['data']:
            if key == 'people':
                for s in item['data'][key]:
                    atBats = 0
                    try:
                        atBats = int(s['stats'][0]['splits'][0]['stat']['atBats'])
                    except Exception as e:
                        print(e)
                    obp = 0
                    try: 
                        obp = float(s['stats'][0]['splits'][0]['stat']['obp'])
                    except Exception as e:
                        print(e)
                    slg = 0
                    try:
                        slg = float(s['stats'][0]['splits'][0]['stat']['slg'])
                    except Exception as e:
                        print(e)
                    ops = 0
                    try:
                        ops = float(s['stats'][0]['splits'][0]['stat']['ops'])
                    except Exception as e:
                        print(e)
                    processed_data.append([ atBats, obp, slg, ops])

    # Convert the processed data to a pandas DataFrame
    df = pd.DataFrame(processed_data, columns=['atBats', 'obp', 'slg', 'ops'])
    seven_day_avg = df.mean(axis=0)
    prediction = model.predict(np.array([seven_day_avg]))
    print(f'Predicted AVG for next day: {prediction[0][0]}')
    print(type(prediction[0][0]))
    # data.append({'date': str(today + timedelta(1)), 'avg': float(round(prediction[0][0], 3))})


    return(data)

    

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
    today = datetime.date.today()
    past_week = today - timedelta(days=7)
    year = today.year
    # needs teams, standings, scores/upcoming games
    # maybe news
    
    data = {}
    data['teams'] = statsapi.get('teams', {'sportId': 1, 'season': year})
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
    data = statsapi.get('game_playByPlay', {'gamePk': game})
    emit('game data response', {game: data})
    print("Emitted 'game data response' event with data:", data)

@socketio.on('get main data')
def get_data():
    today = datetime.date.today()
    past_week = today - timedelta(days=7)
    year = today.year
    data = {}
    data['teams'] = statsapi.get('teams', {'sportId': 1, 'season': year})
    data['standings'] = statsapi.get('standings', {'leagueId': '103,104'})
    data['schedule'] = statsapi.get('schedule', {'sportId': 1, 'startDate': past_week,'endDate': today})
    data['divisions'] = statsapi.get('divisions', {'sportId': 1})
    print('getting data')
    emit('main data response', data)
    print('emitting')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, debug=True, port=4444)