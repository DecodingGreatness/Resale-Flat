import streamlit as st

def grant_methodology():

    st.title("Methodology")
    st.subheader("Grant Eligibility Use Case Methodology:", divider=True)
    st.image("assets/grant_eligibility/Flow Diagram.png", caption="Grant Eligibility Flow Chart Diagram")
    st.subheader("1. File Loading:")
    st.markdown("""
    - **A list of file paths (file_paths) is defined, pointing to HTML documents containing information on HDB grants for families and singles.**
    - **An empty list, list_of_documents_loaded, is initialized to store the loaded documents.**
    - **A loop iterates over each file path. For each file:**
        - A BSHTMLLoader instance is created to load the content.
        - The loaded documents are added to list_of_documents_loaded.
    """)
    st.subheader("2. Document Splitting:")
    st.markdown("""
    - **A RecursiveCharacterTextSplitter is initialized with a chunk_size of 1100 tokens and an overlap of 10 tokens. This is designed to ensure that smaller documents are kept intact.**
    - **The split_documents method is called to break down the loaded documents into smaller chunks for easier processing.**
    """)
    st.subheader("3. Vector Store Creation:")
    st.markdown("""
    - **An InMemoryVectorStore is created from the split documents using OpenAIEmbeddings, allowing for efficient retrieval of document embeddings.**
    - **A retriever is generated from the vector store, enabling quick access to relevant document chunks during user queries.**
    """)
    st.subheader("4. System and User Prompts:")
    st.markdown("""
    - **HDB Officer Assistant Persona: The chatbot is designed to embody the persona of a friendly and knowledgeable HDB officer. This persona helps users feel at ease while navigating complex grant eligibility questions, ensuring they receive clear and concise answers.**
    - **Guiding the Chatbot's Behavior: The system prompt is crafted to steer the chatbot’s responses in a warm and approachable manner. It emphasizes a friendly tone, making interactions feel personal and supportive. This helps users feel comfortable asking questions and seeking clarification.**
    - **Structured User Interactions: We’ve created a user prompt template (ChatPromptTemplate) to organize conversations effectively. This structure ensures that the chatbot can respond appropriately while maintaining the friendly, helpful vibe of an HDB officer assistant.**
    """)
    st.subheader("5. Contextualization of Questions:")
    st.markdown("""
    - **A separate prompt system is established for reformulating user questions based on chat history. This ensures that questions can be understood in isolation, improving the system's responsiveness and relevance.**
    """)
    st.subheader("6. History-Aware Retrieval:")
    st.markdown("""
    - **A history-aware retriever is created using the create_history_aware_retriever function. This component combines the retriever and the contextualization prompt to enhance the system's ability to reference previous interactions.**
    """)
    st.subheader("7. Question-Answer Chain:")
    st.markdown("""
    - **AA prompt for the question-answering (QA) process is constructed to manage interactions with the user while incorporating chat history.**
    - **The QA chain is formed using create_stuff_documents_chain, which combines the retrieval capabilities with the question-answering functionality.**
    """)
    st.subheader("8. Retrieval-Augmented Generation (RAG) Chain:")
    st.markdown("""
    - **A RAG chain is established, combining the history-aware retriever and the QA prompt. This allows for more nuanced responses based on both the user's current question and previous conversations.**
    """)
    st.subheader("9. State Management:")
    st.markdown("""
    - **A State class is defined using TypedDict, which includes fields for the user input, chat history, context, and the answer.**
    - **The call_model function invokes the RAG chain using the current state, generating a response and updating the chat history.**
    """)
    st.subheader("10. Workflow Compilation:")
    st.markdown("""
    - **A StateGraph is created to manage the workflow of the chatbot. The model node executes the call_modelfunction.**
    - **The workflow is compiled with a memory component (MemorySaver) to preserve state across interactions.**
    """)
    st.subheader("Conclusion")
    st.markdown("""
    This implementation outlines a sophisticated chatbot system designed to assist users with HDB grant eligibility queries. The approach includes efficient document loading and processing, token management, contextual understanding, and a responsive user experience. By integrating these components, the chatbot can provide accurate, relevant, and timely information to users navigating the complexities of HDB grants and resale flat pricing.
    """)

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
