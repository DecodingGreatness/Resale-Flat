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
