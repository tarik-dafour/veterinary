import sqlite3

# Replace this with the path to your SQLite database file
db_path = 'db.sqlite3'

# Connect to the SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get all objects: tables, indexes, views, and triggers
cursor.execute("""
    SELECT type, name, sql 
    FROM sqlite_master 
    WHERE sql IS NOT NULL 
    ORDER BY type, name;
""")

objects = cursor.fetchall()

print("=== DATABASE SCHEMA DUMP ===\n")

for obj_type, name, sql in objects:
    print(f"-- {obj_type.upper()}: {name}")
    print(sql)
    print()

conn.close()
