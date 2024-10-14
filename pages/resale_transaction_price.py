import streamlit as st
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from business_logic.transaction_price.rag import get_resale_transactions_response

st.title("Resale Transaction Price Advisor")

form = st.form(key="form",clear_on_submit=True, enter_to_submit=True, border=True)
form.subheader("Prompt")

user_prompt = form.text_area("Enter your prompt here", height=200)
messages = st.container(height=300)


if form.form_submit_button("Submit"):
    st.toast(f"User Input Submitted - {user_prompt}")
    result = get_resale_transactions_response(user_prompt)

    print(result)

    messages.chat_message("user").write(user_prompt)
    messages.chat_message("assistant").write(f"HDB Expert: {result['output']}")
    st.session_state.form_enabled = True
