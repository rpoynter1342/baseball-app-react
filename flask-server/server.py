from flask import Flask, jsonify, request
from flask_cors import CORS
from unidecode import unidecode
import requests
import os
import json 
import datetime
import statsapi
from private import link

import pymongo

from pymongo import MongoClient

cluster = MongoClient(link)
db = cluster["fantasy"]
collection = db["test"]

app = Flask(__name__)
CORS(app)

@app.route('/main_home')
def main_home():
    print('hi')
    data = {}
    today = datetime.date.today()
    print(str(today))
    res = requests.get('https://api.sportsdata.io/v3/mlb/scores/json/teams?key=b0608b16e8984da68d84bf40d21e26d0')
    response = json.loads(res.text)
    data["teams"] = response
    res = requests.get('https://api.sportsdata.io/v3/mlb/scores/json/Standings/2023?key=b0608b16e8984da68d84bf40d21e26d0')
    response = json.loads(res.text)
    data["standings"] = response
    res = requests.get('https://api.sportsdata.io/v3/mlb/scores/json/News?key=b0608b16e8984da68d84bf40d21e26d0')
    response = json.loads(res.text)
    data["news"] = response
    print(response)
    res = requests.get('https://api.sportsdata.io/v3/mlb/scores/json/ScoresBasic/'+str(today)+'?key=b0608b16e8984da68d84bf40d21e26d0')
    response = json.loads(res.text)
    data["currentGames"] = response
    return(data)

@app.route('/roster')
def roster():
    team_key = request.args.get('key')
    # print(team_key)
    data = {}
    active_roster = []
    stats_array = []
    res = requests.get('https://api.sportsdata.io/v3/mlb/scores/json/PlayersBasic/'+team_key+'?key=b0608b16e8984da68d84bf40d21e26d0')
    response = json.loads(res.text)
    def only_active(array):
        for player in array:
            if player["Status"] == "Active":
                active_roster.append(player)
    only_active(response)
    data["roster"] = active_roster
    for player in data['roster']:
        player_data = statsapi.lookup_player(player["LastName"] + ', ' + player["FirstName"])
        if player_data:  # Check if the list is not empty
            stats_array.append(statsapi.player_stat_data(player_data[0]['id'], group="[hitting,pitching,fielding]", type="season", sportId=1))
        else:
            stats_array.append({player["LastName"] + ', ' + player["FirstName"]: ' EMPTY?'}) 
    data["stats"] = stats_array
    print(len(data["roster"]))
    return(data)

@app.route('/player')
def player_data():
    player_id = request.args.get('id')
    stats_array = []
    res = requests.get('https://api.sportsdata.io/v3/mlb/scores/json/Player/'+player_id+'?key=b0608b16e8984da68d84bf40d21e26d0')
    response = json.loads(res.text)
    is_pitcher = response['PositionCategory'] != 'P'
    group_str = ""
    if is_pitcher:
        group_str = "[pithcing]"
    else:
        group_str = "[hitting, fielding]"
    player_data = statsapi.lookup_player(response["LastName"] + ', ' + response["FirstName"])
    print(player_data)
    if player_data:
        stats_array.append(statsapi.player_stat_data(player_data[0]['id'], group=group_str, type="season", sportId=1))
    return(stats_array)


if __name__ == '__main__':
    app.run(debug=True, host=os.getenv('IP', '0.0.0.0'), 
        port=int(os.getenv('PORT', 4444)))