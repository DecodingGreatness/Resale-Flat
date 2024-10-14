import requests
import sys
import os
from io import BytesIO
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
import pandas as pd
from helper_functions.llm import llm
import pandas as pd
from langchain_community.utilities import SQLDatabase
from sqlalchemy import create_engine
from langchain_community.agent_toolkits import create_sql_agent
import pickle

resale_transactions_csv_path = "transaction_records_db/ResaleflatpricesbasedonregistrationdatefromJan2017onwards.csv"
datasetId = "d_8b84c4ee58e3cfc0ece0d773c8ca6abc"
url = "https://data.gov.sg/api/action/datastore_search?resource_id=" + datasetId

with open('transaction_records_db/data.pkl', 'rb') as file:
    loaded_data = pickle.load(file)

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

        loaded_data['last_record_count'] = latest_record_count

        with open('transaction_records_db/data.pkl', 'wb') as file:
            pickle.dump(loaded_data, file)

        print("last_record_count updated successfully!")
    else:
        print(f"Failed to download CSV. Status code: {nest_url_response.status_code}")

engine = create_engine("sqlite:///resale_transaction.db")

db = SQLDatabase(engine=engine)

agent_executor = create_sql_agent(llm, db=db, agent_type="openai-tools", verbose=True)

def get_resale_transactions_response(user_prompt):
    resale_transactions_response = agent_executor.invoke({"input": user_prompt})
    return resale_transactions_response
