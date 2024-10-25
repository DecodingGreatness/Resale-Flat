# __import__('pysqlite3')
# import sys
# sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')
from crewai import Agent,Task, Crew
from helper_functions.llm import llm
from business_logic.transaction_price.rag import get_resale_transactions_response
from langchain_community.utilities import SQLDatabase
from sqlalchemy import create_engine
from crewai_tools import tool

street_name_generator = Agent(
    role='street name generator',
    goal='List all street names around the area based on {input}',
    backstory="""The existing hdb resale transactions database may not
        be able to map some areas.Therefore, your role is to list all the
        street names around the area in {input}
    """,
    llm=llm,
    memory=True,
    verbose=True
)

street_name_task = Task(
    expected_output="a list of street names around the area mentioned in {input}",
    description="search for street names around the area in {input}",
    agent=street_name_generator,
)

convert_street_name_format_agent = Agent(
    role='street name format convertor',
    goal="""using the output from street_name_task,
        iterate over each street name to convert format
        based on background story""",
    backstory="""The existing hdb resale transactions database uses certain abbreviations
        for each street name please replace the following words with their corresponding abbreviations in the text provided.
        Use the abbreviations as specified:
            'Road' → 'Rd'
            'Drive' → 'Dr'
            'Crescent' → 'Crew'
            'Street' → 'St'
            'Avenue' → 'Ave'
    """,
    llm=llm,
    memory=True,
    verbose=True
)

convert_street_name_task = Task(
    expected_output="a list of street names with new abbreviation if applicable",
    description="format street name inside a list to new abbreviation",
    agent=convert_street_name_format_agent,
)

@tool("Query_Records")
def get_transactions_query(street_names: list) -> str:
    """Fetch resale records based on street names."""

    tool_output = get_resale_transactions_response(street_names)
    return tool_output

sql_query_agent = Agent(
    role='SQL expert with strong attention to detail',
    goal="""
        the output from convert_street_name_task is a list of street names
        generate an SQL query to fetch resale records that matches street name in output from convert_street_name_task
        if no match is found, generate an SQL query to fetch resale records that matches {input} location
        check the SQL query is correct
        perform the SQL query on Database

        """,
    backstory="""You are interested to find out the latest transactions
        in the past three months.
        Things to take note:
            1) if input mentions 4room as flat_type, convert the sql enquiry for
            flat_type to 4 room (if not ignore this point)
            2) If {input} mentions transactions take it as a resale record
            3) transaction_date does not exist in db column use month instead
            4) month column in database shows this format: 2024-08-01, for the output just show the month 08 which is August
    """,
    llm=llm,
    tools=[get_transactions_query],
    memory=True,
    verbose=True
)

sql_query_task = Task(
    expected_output="compile all resale records based on sql query from sql_query_agent",
    description="""use sql query from sql_query_agent to complie resale records
    """,
    agent=sql_query_agent,
    tools=[get_transactions_query],
)


consultant_agent = Agent(
    role='HDB resale flat consultant',
    goal="""using the output from sql_query_task address the question
        presented in {input}
    """,
    backstory="""You are an expert in resale flat transaction
        You provide an objective insight about {input} based on data
        from sql query task output. Provide insights about
        the output from sql_query_task as well
    """,
    llm=llm,
    memory=True,
    verbose=True
)

consultant_task = Task(
    expected_output="""objective insights based on output from sql query task
        that address {input}
    """,
    description="""Based on output from sql query task attempt to address
        question in {input}. If you do not know, mention you do not know and if user can
        provide relevant information
    """,
    agent=consultant_agent,
)

display_content_agent = Agent(
    role='content writer',
    goal="""using the output from sql_query_task display the data in table format
        and using the output from consultant_task, present the insights in any engaging
        manner. Please remain objective. Do not create imaginery data
    """,
    backstory="""You are an expert at data visualisation and love to share data
    """,
    llm=llm,
    memory=True,
    verbose=True
)

display_content_task = Task(
    expected_output="""display a table based on output from sql query task and
        give some insights on the content [show up to 15 records]. Do not make any insights about the transaction date.
        Using the insights from consultant_task, supplement your content.
        Please provide JSON with table and content as the key of the JSON
        For table provide the following columns: Town, Street Name, Price, Flat Type, Remaining Lease
        Do not fabricate data. If not data is found do not show data in table

        """,
    description="""show content in a user friendly manner and write the insights
        in an objective and information manner. Keep it concise
    """,
    agent=display_content_agent,
)



transactions_crew = Crew(
    agents=[
        street_name_generator,
        convert_street_name_format_agent,
        sql_query_agent,
        consultant_agent,
        display_content_agent
        ],
    tasks=[
        street_name_task,
        convert_street_name_task,
        sql_query_task,
        consultant_task,
        display_content_task
        ],
    share_crew=True
)
