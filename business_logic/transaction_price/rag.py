import requests
import sys
import os
from io import BytesIO
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
import pandas as pd
from helper_functions.llm import llm,get_completion
from langchain_community.utilities import SQLDatabase
from sqlalchemy import create_engine,text
from langchain_community.agent_toolkits import create_sql_agent
import pickle
import sqlite3
import re


resale_transactions_csv_path = "transaction_records_db/ResaleflatpricesbasedonregistrationdatefromJan2017onwards.csv"
datasetId = "d_8b84c4ee58e3cfc0ece0d773c8ca6abc"
url = "https://data.gov.sg/api/action/datastore_search?resource_id=" + datasetId

with open('transaction_records_db/data.pkl', 'rb') as file:
    loaded_data = pickle.load(file)


def retrieve_past_three_months_record(file_path):
    records = pd.read_csv(file_path)
    records['month'] = pd.to_datetime(records['month'])

    current_date = pd.Timestamp.today()
    three_months_ago = current_date - pd.DateOffset(months=3)

    past_three_month_records = records[
            (records['month'] >= three_months_ago) & (records['month'] <= current_date)
        ]

    print(past_three_month_records)
    return past_three_month_records

filtered_records = retrieve_past_three_months_record(resale_transactions_csv_path)
print(filtered_records.columns.tolist())

def create_db_from_csv(filtered_records):
    # Load the CSV file into a DataFrame
    data = filtered_records

    # Connect to SQLite database (create it if it doesn't exist)
    connection = sqlite3.connect('latest_resale_records.db')
    data.to_sql('resale_records', connection, if_exists='replace', index=False)
    connection.close()
    print("Database created from CSV!")

def replace_db_from_csv(filtered_records):
    # Load the new data from the CSV file into a DataFrame
    new_data = filtered_records
    # Connect to the SQLite database
    connection = sqlite3.connect('latest_resale_records.db')

    # Replace the existing table with new data
    new_data.to_sql('resale_records', connection, if_exists='replace', index=False)

    # Commit changes and close the connection
    connection.commit()
    connection.close()

    print("Database records replaced with new data from CSV!")

def get_latest_transaction_count():
    try:
        lastest_response = requests.get(url)
        lastest_response_json = lastest_response.json()
        latest_count = lastest_response_json['result']['total']
        return latest_count
    except Exception as e:
        print(f"error message: {e}")

latest_record_count = get_latest_transaction_count()

if loaded_data['last_record_count'] != latest_record_count:
    download_latest_transaction_url =  "https://api-open.data.gov.sg/v1/public/api/datasets/" + datasetId + "/poll-download"

    try:
        download_csv_response = requests.get(
            download_latest_transaction_url,
            headers={"Content-Type":"application/json"},
            json={}
        )

        nested_url = download_csv_response.json()['data']['url']

    except Exception as e:
        print(f"error message: {e}")

    nest_url_response = requests.get(nested_url)

    if nest_url_response.status_code == 200:
        existing_transactions_csv_directory = "transaction_records_db/ResaleflatpricesbasedonregistrationdatefromJan2017onwards.csv"
        csv_data = BytesIO(nest_url_response.content)
        new_data = pd.read_csv(csv_data)
        new_data.to_csv(existing_transactions_csv_directory, index=False)

        print(f"Content of {existing_transactions_csv_directory} has been replaced successfully!")
        new_latest_records = retrieve_past_three_months_record(existing_transactions_csv_directory)
        replace_db_from_csv(new_latest_records)
        print("latest_resale_records.db updated successfully!")

        loaded_data['last_record_count'] = latest_record_count

        with open('transaction_records_db/data.pkl', 'wb') as file:
            pickle.dump(loaded_data, file)

        print("last_record_count updated successfully!")
    else:
        print(f"Failed to download CSV. Status code: {nest_url_response.status_code}")

engine = create_engine("sqlite:///latest_resale_records.db")

db = SQLDatabase(engine=engine)

agent_executor = create_sql_agent(llm, db=db, agent_type="openai-tools", verbose=True,top_k=100)

def get_resale_transactions_response(user_prompt):
    resale_transactions_response = agent_executor.invoke({"input": f'%{user_prompt}%'})
    return resale_transactions_response

def extract_road_names(text):
    # Split the text by double newlines
    parts = text.split('\n\n')

    # Check if there are at least two parts
    if len(parts) > 1:
        road_names_string = parts[1].strip()
        road_names_list = road_names_string.split('\n')
        road_names_list = [name.split('. ', 1)[1] for name in road_names_list]
        return road_names_list
    else:
        return ""

def replace_road_terms(text: str) -> str:
    replacements = {
        r'\broad\b': 'rd',
        r'\bdrive\b': 'dr',
        r'\bcrescent\b': 'crew',
        r'\bstreet\b': 'st',
        r'\bavenue\b': 'ave'
    }

    for old, new in replacements.items():
        text = re.sub(old, new, text, flags=re.IGNORECASE)

    return text

def enhanced_records(user_prompt):
    extracted_road_names = extract_road_names(user_prompt)
    updated_road_names= [replace_road_terms(name) for name in extracted_road_names]
    resale_transactions_response = agent_executor.invoke({"input": f'search for records like %{updated_road_names}%'})
    return resale_transactions_response
