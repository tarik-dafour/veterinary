import sqlite3

conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()

cursor.execute("SELECT name, sql FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

for name, sql in tables:
    print(f"\n--- Table: {name} ---")
    print(sql)

conn.close()
