import requests
import sys
import csv
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
import pandas as pd
from helper_functions.utility import modifyCount,getCurrentDate,retrieve_three_months_date
from langchain_community.document_loaders import CSVLoader

resale_transactions_csv_path = "transaction_records_db/ResaleflatpricesbasedonregistrationdatefromJan2017onwards.csv"

datasetId = "d_8b84c4ee58e3cfc0ece0d773c8ca6abc"
url = "https://data.gov.sg/api/action/datastore_search?resource_id=" + datasetId
latest_record_url = "https://data.gov.sg/api/action/datastore_search?resource_id=" + datasetId + "&offset="

response = requests.get(url)

resale_transactions = response.json()
resale_transactions_result = response.json()['result']
resale_transactions_fields = resale_transactions_result['fields']
resale_transactions_records = resale_transactions_result['records']
total_records_count = resale_transactions_result['total']

field_value = [pair['id'] for pair in resale_transactions_fields]
filtered_records = [transaction for transaction in resale_transactions_records if transaction[field_value[1]] == 'BEDOK']
df = pd.DataFrame(filtered_records)

url_latest_count = modifyCount(total_records_count)
current_date = getCurrentDate()

download_transactions_csv_url = "https://api-open.data.gov.sg/v1/public/api/datasets/{datasetId}/initiate-download"

loader = CSVLoader(file_path='transaction_records_db/ResaleflatpricesbasedonregistrationdatefromJan2017onwards.csv',
    csv_args={
    'delimiter': ',',
    'quotechar': '"',
    'fieldnames': field_value
})

docs = loader.load()

three_months_date = retrieve_three_months_date()

with open(resale_transactions_csv_path, newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    filtered_month_records = [transaction for transaction in reader if transaction['month'] in three_months_date]
    table_form = pd.DataFrame(filtered_month_records)
    print(table_form)
