import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew
from helper_functions.llm import llm
from crewai_tools import CSVSearchTool

os.chdir(os.path.dirname(os.path.abspath(__file__)))
print(f"The current working directory is: {os.getcwd()}")

load_dotenv('.env')

file_path = os.path.abspath('../../transaction_records_db/ResaleflatpricesbasedonregistrationdatefromJan2017onwards.csv')
CSV_reader = CSVSearchTool(csv= file_path)

analyst_agent = Agent(
    role='Data Analyst',
    goal='Extract actionable insights',
    backstory="""You're a data analyst at HDB dealing with resale flats.
    You're responsible for analyzing data and providing insights to resale flat home buyers.
    You're currently studying the resale flat transaction prices across different areas of Singapore.""",
    tools=[CSV_reader], # Optional, defaults to an empty list
    llm=llm, # Optional
    verbose=True # Optional
)



analyst_task = Task(
    description='Use data provided by research assistant to respond to question: {input}',
    agent=analyst_agent,
    expected_output='display table content for {input} and provide analysis insights',
)



research_assistant_agent = Agent(
    role='Research Assistant',
    goal='Retrieve Data from csv file base on {input}',
    backstory="""You're a Research Assistant working for the data analyst at HDB dealing with resale flats.
    You're responsible filtering dataset based on {input}""",
    tools=[CSV_reader], # Optional, defaults to an empty list
    llm=llm, # Optional
    verbose=True # Optional
)

research_assistant_task = Task(
    description='Study csv file for resale flat transactions that were completed in the last three months and respond to question: {input}',
    agent=analyst_agent,
    expected_output='return csv data to data analyst agent',
)

crew = Crew(
    agents=[research_assistant_agent,analyst_agent],
    tasks=[research_assistant_task,analyst_task],
    verbose=True,
    planning=True, # Enable planning feature
)

inputs = {'input':'what is latest transactions in bedok'}

results = crew.kickoff(inputs)

print(results)
