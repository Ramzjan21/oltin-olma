import psycopg2

# Database connection
DATABASE_URL = "postgresql://oltin_olma_user:kjg4XncwTRMn1L2e1ccQzB0hrRBjxEts@dpg-d7coh3m7r5hc739oiq2g-a.oregon-postgres.render.com/oltin_olma"

# Read schema file
with open('backend/database/schema.sql', 'r', encoding='utf-8') as f:
    schema_sql = f.read()

try:
    # Connect to database
    print("Database'ga ulanmoqda...")
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    
    # Execute schema
    print("Schema yuklanmoqda...")
    cursor.execute(schema_sql)
    conn.commit()
    
    print("Schema muvaffaqiyatli yuklandi!")
    
    # Check tables
    cursor.execute("SELECT tablename FROM pg_tables WHERE schemaname = 'public';")
    tables = cursor.fetchall()
    print("\nYaratilgan table'lar:")
    for table in tables:
        print(f"  - {table[0]}")
    
    cursor.close()
    conn.close()
    print("\nTayyor! Frontend'ni test qilishingiz mumkin.")
    
except Exception as e:
    print(f"Xato: {e}")
