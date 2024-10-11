import streamlit as st
import helper_functions.llm as llm
from business_logic.grant_eligibility.rag import rag_chain

st.title("Resale Grant Eligibility Checker")

form = st.form(key="form",clear_on_submit=True, enter_to_submit=True, border=True)
form.subheader("Prompt")

user_prompt = form.text_area("Enter your prompt here", height=200)
messages = st.container(height=300)


if form.form_submit_button("Submit"):
    st.toast(f"User Input Submitted - {user_prompt}")
    response = llm.get_completion(user_prompt) # <--- This calls the helper function that we have created 🆕
    prompt_result = rag_chain.invoke(user_prompt)
    result = prompt_result["result"]

    messages.chat_message("user").write(user_prompt)
    messages.chat_message("assistant").write(f"HDB Expert: {result}")
    st.session_state.form_enabled = True
