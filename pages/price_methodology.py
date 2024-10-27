import streamlit as st

def price_methodology():

    st.subheader("Resale Pricing Use Case Methodology:", divider=True)
    st.image("assets/transaction_price/transactions flow chart.png", caption="Resale Transaction Price Flow Chart Diagram")
    st.subheader("Overview")
    st.markdown("""
    This system processes HDB resale transaction data to provide insights and facilitate user queries about resale flat prices. The implementation involves loading CSV data, filtering it, storing it in a SQLite database, and querying the database using an AI-powered chatbot system.
    """)
    st.subheader("1. Data Loading:")
    st.markdown("""
    The system begins by specifying the path to a CSV file containing resale transaction records, specifically focusing on resale flat prices based on registration dates from January 2017 onwards. This data is crucial for understanding pricing trends and market conditions.
    """)
    st.subheader("2. Filtering Recent Transactions:")
    st.markdown("""
    The method for filtering recent transactions reads the CSV file and processes the 'month' column to filter records from the last three months. It converts the date column to a datetime format to allow for accurate comparisons. The logic calculates the date range and retrieves only those records that fall within this period.
    """)
    st.subheader("3. Database Creation and Updates:")
    st.markdown("""
    The filtered records are stored in a SQLite database.
    - **Database Creation: The system connects to the SQLite database and creates a table named resale_recordspopulated with the filtered data.**
    - **Database Replacement: When new data is available, an update method replaces the existing records in the database with the latest data.**
    """)
    st.subheader("4. Fetching Latest Transaction Count:")
    st.markdown("""
    To ensure the local database is up to date, the system retrieves the latest transaction count from an external data source. This involves making an API request and extracting the total number of transactions reported.
    """)
    st.subheader("5. Data Update Process:")
    st.markdown("""
    If there’s a discrepancy between the local record count and the latest count, the system initiates a process to download new transaction data. This involves replacing the existing CSV file with updated data and refreshing the database to reflect the latest transactions.
    """)
    st.subheader("6. Querying the Database:")
    st.markdown("""
    The system allows users to query the database for resale transactions through a dedicated SQL agent. Users can input specific criteria, and the system processes these queries to return relevant transaction records.
    """)
    st.subheader("7. Data Enhancement and Formatting:")
    st.markdown("""
    The implementation includes methods to enhance user input for better accuracy in queries. This involves extracting road names from user queries and replacing common street terms with standardized abbreviations, ensuring consistent and precise results.
    """)
    st.subheader("8. Agents and Shared Data in CrewAI:")
    st.markdown("""
    The architecture employs five AI agents that work collaboratively within the CrewAI framework:
    - **Street Name Generator: This agent lists street names around the area based on user input.**
    - **Street Name Format Converter: This agent formats the street names using standardized abbreviations, ensuring consistency in the database.**
    - **SQL Query Agent: Executes SQL queries to fetch resale records based on the refined street names and user inputs.**
    - **Consultant Agent: Provides objective insights based on the output from the SQL Query Agent, addressing user questions related to resale transactions.**
    - **Display Content Agent: Presents the queried data in a user-friendly table format and incorporates insights from the Consultant Agent to enhance user understanding.**

    Each agent shares data and processes the output collectively, ensuring a seamless flow of information and enabling the Display Content Agent to effectively present data alongside valuable insights.

    """)
    st.subheader("Conclusion")
    st.markdown("""
    This implementation effectively integrates data loading, processing, and querying functionalities to provide users with timely insights into HDB resale transactions. The modular structure with AI agents and shared data allows for easy maintenance and expansion of functionalities in the future.
    """)
