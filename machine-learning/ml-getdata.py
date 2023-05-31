import statsapi
import datetime
import json
from tqdm import tqdm

league_leader_stat_cats_hitter = [ 
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

league_leader_stat_cats_pitcher = [
'earnedRunAverage',
'walksAndHitsPerInningPitched',
'strikeoutsPer9Inn',
'strikeoutWalkRatio',
'pitchesPerInning',
'wins',
]

season_data = statsapi.latest_season()
cur_season = season_data['seasonId']

hitter_data = []
pitcher_data = []
player_ids = []
global_game_pks = []
players_with_stats = []
today = datetime.date.today()
# past_week = today - timedelta(days=7)
year = today.year
for item in league_leader_stat_cats_hitter:
    # print(item)
    stat = {item: statsapi.league_leader_data(item, limit=5)}
    # print(stat)
    hitter_data.append(stat)

# print(hitter_data)

for item in league_leader_stat_cats_pitcher:
    # print(item)
    stat = {item: statsapi.league_leader_data(item, limit=5)}
    # print(stat)
    pitcher_data.append(stat)

# print(pitcher_data)

hitter_names = []
for item in hitter_data:
    for stat_cat in item:
        for player in item[stat_cat]:
            if player[1] not in hitter_names:
                hitter_names.append(player[1])


pitcher_names = []
for item in pitcher_data:
    for stat_cat in item:
        for player in item[stat_cat]:
            if player[1] not in pitcher_names:
                pitcher_names.append(player[1])




pitcher_ids = []
for player in pitcher_names:
    pitcher_ids.append(statsapi.lookup_player(player)[0]['id'])



schedule = statsapi.get('schedule', {'sportId': 1, 'startDate': '2023-03-30','endDate': today})

for date in schedule['dates']:
    for game in date['games']:
        global_game_pks.append({'date': game['officialDate'], 'pk': game['gamePk']})

# print(global_game_pks)

pitcher_training_data = []
for playerid in tqdm(pitcher_ids, desc='Processing players'):
    for game in tqdm(global_game_pks, desc='Processing games', leave=False):
        stat_data = statsapi.get('person_stats', {'personId': playerid, 'gamePk': game['pk'], 'group': 'hitting'})
        totalSplits = stat_data['stats'][0].get('totalSplits')
        did_not_play = totalSplits is None or totalSplits == 0
        if (did_not_play):
            print('DNP')
        else:
            pitcher_training_data.append({playerid: stat_data})
        
print(pitcher_training_data)

# Assuming data is your Python dictionary
with open('pitcher_training_data.json', 'w') as f:
    json.dump(pitcher_training_data, f)


# pitcher_training_data = []

