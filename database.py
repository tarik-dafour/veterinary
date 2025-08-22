import sqlite3

conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

for table in tables:
    print(f"\n--- Table: {table[0]} ---")
    cursor.execute(f"SELECT * FROM {table[0]}")
    rows = cursor.fetchall()
    for row in rows:
        print(row)

conn.close()
