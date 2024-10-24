import sys
import os
import requests
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from typing import Sequence
from langchain_community.document_loaders import BSHTMLLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from helper_functions.llm import count_tokens,embeddings_model,llm
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_openai import OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.messages import AIMessage, HumanMessage,BaseMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, StateGraph
from langgraph.graph.message import add_messages
from typing_extensions import Annotated, TypedDict

# Document Loading

file_paths = [
    "assets/grant_eligibility/family/HDB _ CPF Housing Grants for Resale Flats (Families).html",
    "assets/grant_eligibility/family/HDB _ Enhanced CPF Housing Grant (Families).html",
    "assets/grant_eligibility/family/HDB _ Proximity Housing Grant (Families).html",
    "assets/grant_eligibility/family/HDB _ Step-Up CPF Housing Grant (Families).html",
    "assets/grant_eligibility/single/HDB _ CPF Housing Grant for Resale Flats (Singles).html",
    "assets/grant_eligibility/single/HDB _ Enhanced CPF Housing Grant (Singles).html",
    "assets/grant_eligibility/single/HDB _ Proximity Housing Grant (Singles).html"
]

list_of_documents_loaded = []
for file in file_paths:
    try:
        loader = BSHTMLLoader(file_path=file)
        docs = loader.load()
        list_of_documents_loaded.extend(docs)
        print(f"Loaded {docs[0].metadata.get("source")}")
    except Exception as e:
        print(f"Error loading {file}: {e}")
        continue


i = 0
for doc in list_of_documents_loaded:
    i += 1
    print(f'Document {i} - "{doc.metadata.get("source")}" has {count_tokens(doc.page_content)} tokens')

# In this case, we intentionally set the chunk_size to 1100 tokens, to have the smallest document (document 2) intact
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1100, chunk_overlap=10, length_function=count_tokens)

# Split the documents into smaller chunks
splitted_documents = text_splitter.split_documents(list_of_documents_loaded)

# Print the number of documents after splitting
print(f"Number of documents after splitting: {len(splitted_documents)}")

vectorstore = InMemoryVectorStore.from_documents(
    documents=splitted_documents, embedding=OpenAIEmbeddings()
)

retriever = vectorstore.as_retriever()

system_prompt = (
    "You are a hdb officer assistant dealing with grant eligibility questions for resale flat"
    "You try to provide a clear and concise answer in a friendly tone"
    "If you don't know the answer, highlight that you don't know but can try help them if they can provide some information on their citizenship,age, monthly household income, ownership interest in property, any previous housing subsidies"
    "Keep your answer concise"
    "\n\n"
    "{context}"
)

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        ("human", "{input}"),
    ]
)

contextualize_q_system_prompt = (
    "Given a chat history and the latest user question "
    "which might reference context in the chat history, "
    "formulate a standalone question which can be understood "
    "without the chat history. Do NOT answer the question, "
    "just reformulate it if needed and otherwise return it as is."
)

contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)
history_aware_retriever = create_history_aware_retriever(
    llm, retriever, contextualize_q_prompt
)

qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

class State(TypedDict):
    input: str
    chat_history: Annotated[Sequence[BaseMessage], add_messages]
    context: str
    answer: str

def call_model(state: State):
    response = rag_chain.invoke(state)
    return {
        "chat_history": [
            HumanMessage(state["input"]),
            AIMessage(response["answer"]),
        ],
        "context": response["context"],
        "answer": response["answer"],
    }

workflow = StateGraph(state_schema=State)
workflow.add_edge(START, "model")
workflow.add_node("model", call_model)

memory = MemorySaver()
app = workflow.compile(checkpointer=memory)
