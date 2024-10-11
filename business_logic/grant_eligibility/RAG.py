import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from langchain_community.document_loaders import BSHTMLLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain.chains import RetrievalQA
from helper_functions.llm import count_tokens,embeddings_model,llm

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

# Create the vector database
vectordb = Chroma.from_documents(
    documents=splitted_documents,
    embedding=embeddings_model,
    collection_name="Resale Flat Grant", # one database can have multiple collections
    persist_directory="./vector_db"
)

rag_chain = RetrievalQA.from_llm(
    retriever=vectordb.as_retriever(), llm=llm
)
