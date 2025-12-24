import pandas as pd
import psycopg2
from psycopg2.extras import execute_values

# connect postgres
conn = psycopg2.connect(
    dbname="askyoursheet",
    user="postgres",
    password="1234",
    host="localhost",
    port="5432"
)
cursor = conn.cursor()

# read excel
df = pd.read_excel("financial_transactions.xlsx")

# clean columns
def clean_columns(columns):
    cleaned = []
    for col in columns:
        col = str(col).strip().lower().replace(" ", "_")
        col = "".join(c for c in col if c.isalnum() or c == "_")
        cleaned.append(col)
    return cleaned

columns = clean_columns(df.columns)
df.columns = columns

# create table
def generate_create_table(table_name, columns):
    sql = f'CREATE TABLE IF NOT EXISTS "{table_name}" (\n'
    sql += ",\n".join([f'  "{col}" TEXT' for col in columns])
    sql += "\n);"
    return sql

table_name = "financial_transaction"
cursor.execute(generate_create_table(table_name, columns))
conn.commit()

# INSERT DATA
insert_sql = f'''
INSERT INTO "{table_name}" ({",".join([f'"{col}"' for col in columns])})
VALUES %s
'''

execute_values(cursor, insert_sql, df.values.tolist())
conn.commit()

print("✅ Data inserted successfully")

cursor.close()
conn.close()
