from langchain_community.document_loaders import BSHTMLLoader

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
