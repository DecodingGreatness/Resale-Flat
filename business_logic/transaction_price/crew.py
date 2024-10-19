from crewai import Agent,Task, Crew
from helper_functions.llm import llm
from business_logic.transaction_price.rag import get_resale_transactions_response
from langchain_community.utilities import SQLDatabase
from sqlalchemy import create_engine
from crewai_tools import tool
from langchain_community.tools.sql_database.tool import QuerySQLDataBaseTool


engine = create_engine("sqlite:///latest_resale_records.db")

db = SQLDatabase(engine=engine)

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

@tool("Query Records")
def get_transactions_query(input: str) -> str:
    """Tool description for clarity."""
    print(input)
    # Tool logic here
    tool_output = get_resale_transactions_response(input)
    return tool_output

sql_query_agent = Agent(
    role='resale transactions record sql query',
    goal="""use output from convert_street_name_task to perform sql query
        for transactions with street name like street name inside output.
        if there is street name in the output, create a sql query based on {input} location""",
    backstory="""You are interested to find out the latest transactions
        in the past three months
    """,
    llm=llm,
    tools=[get_transactions_query],
    memory=True,
    verbose=True
)

sql_query_task = Task(
    expected_output="compile all resale transactions based on sql query in latest_resale_records.db",
    description="""using get_transactions_query tool generate an sql query to retrieve
        all transactions that fits the query
    """,
    agent=sql_query_agent,
)



transactions_crew = Crew(
    agents=[street_name_generator,convert_street_name_format_agent,sql_query_agent],
    tasks=[street_name_task,convert_street_name_task,sql_query_task],
    share_crew=True
)

crew = transactions_crew.kickoff(inputs={"input": "What are the latest transactions in Tampines"})
