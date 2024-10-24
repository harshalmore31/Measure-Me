import sqlite3
import requests
import json
import time
from datetime import datetime

# Django backend URL
BACKEND_URL = "http://localhost:8000/api/"  # Update this with your actual backend URL

# Connect to local SQLite database
conn = sqlite3.connect('local_measurements.db')
cursor = conn.cursor()

# Create table if not exists
cursor.execute('''
    CREATE TABLE IF NOT EXISTS measurements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        height REAL,
        weight REAL,
        timestamp TEXT,
        synced INTEGER DEFAULT 0
    )
''')
conn.commit()

def add_measurement(student_id, height, weight):
    timestamp = datetime.now().isoformat()
    cursor.execute('''
        INSERT INTO measurements (student_id, height, weight, timestamp)
        VALUES (?, ?, ?, ?)
    ''', (student_id, height, weight, timestamp))
    conn.commit()

def get_unsynced_measurements():
    cursor.execute('SELECT * FROM measurements WHERE synced = 0')
    return cursor.fetchall()

def sync_with_backend():
    unsynced = get_unsynced_measurements()
    for measurement in unsynced:
        data = {
            'student_id': measurement[1],
            'height': measurement[2],
            'weight': measurement[3],
            'timestamp': measurement[4]
        }
        try:
            response = requests.post(BACKEND_URL + 'measurements/', json=data)
            if response.status_code == 201:
                cursor.execute('UPDATE measurements SET synced = 1 WHERE id = ?', (measurement[0],))
                conn.commit()
                print(f"Synced measurement ID {measurement[0]}")
            else:
                print(f"Failed to sync measurement ID {measurement[0]}")
        except requests.RequestException as e:
            print(f"Error syncing measurement ID {measurement[0]}: {str(e)}")

# Main loop
while True:
    # Simulate taking a measurement (replace with actual sensor code)
    student_id = 123  # This would come from facial recognition
    height = 170.5  # This would come from ultrasonic sensor
    weight = 65.3  # This would come from load cell

    add_measurement(student_id, height, weight)
    sync_with_backend()
    
    time.sleep(60)  # Wait for 1 minute before next sync attempt
