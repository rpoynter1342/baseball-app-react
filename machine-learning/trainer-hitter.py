import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from tensorflow import keras

pitcher_training_data = {}

# Load the data
with open('pitcher_training_data.json') as f:
    pitcher_training_data = json.load(f)

# Initialize an empty list to store the processed data
processed_data = []

# Iterate over each player
for player in pitcher_training_data:
    
    # Extract the player ID
    player_id = list(player.keys())[0]
    
    # Iterate over each game
    for stat in player[player_id]['stats']:
        
        totalSplits = stat.get('totalSplits', 0)  # Use 0 as the default value if 'totalSplits' does not exist
        if totalSplits != 0 and 'splits' in stat and len(stat['splits']) > 0:
            
            # Extract the desired features
            game_data = stat['splits'][0]['stat']
            avg = float(game_data['avg'])
            atBats = int(game_data['atBats'])
            obp = float(game_data['obp'])
            slg = float(game_data['slg'])
            ops = float(game_data['ops'])
            
            # Append the features and the target to the processed data
            processed_data.append([player_id, avg, atBats, obp, slg, ops])

# Convert the processed data to a pandas DataFrame
df = pd.DataFrame(processed_data, columns=['player_id', 'avg', 'atBats', 'obp', 'slg', 'ops'])
player_ids = df['player_id']

training_columns = ['ops', 'avg', 'atBats', 'obp', 'slg']
for stat in training_columns:
    features = df.drop([stat, 'player_id'], axis=1)
    target = df[stat]

    X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42)

    model = keras.Sequential([
        keras.layers.Dense(32, activation='relu'),
        keras.layers.Dense(32, activation='relu'),
        keras.layers.Dense(1)
    ])

    model.compile(optimizer='adam',
                loss='mean_squared_error')

    model.fit(X_train, y_train, epochs=10)

    # Save the entire model to a HDF5 file
    model.save('hitter_model_'+stat+'.h5')

print(X_test)
y_pred = model.predict(X_test)
print(y_pred)
print('Mean Absolute Error:', mean_absolute_error(y_test, y_pred))
print('Mean Squared Error:', mean_squared_error(y_test, y_pred))
print('R^2 Score:', r2_score(y_test, y_pred))