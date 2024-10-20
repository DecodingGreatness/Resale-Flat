import streamlit as st
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from business_logic.transaction_price.rag import get_resale_transactions_response
from helper_functions.llm import security_prompt
from business_logic.transaction_price.crew import transactions_crew
import pandas as pd
from helper_functions.utility import retrieve_crew_content,retrieve_crew_table

st.title("Resale Transaction Price Advisor")

form = st.form(key="form",clear_on_submit=True, enter_to_submit=True, border=True)
form.subheader("Prompt")

user_prompt = form.text_area("Enter your prompt here", height=200)
messages = st.container(height=300)


if form.form_submit_button("Submit"):
    st.toast(f"User Input Submitted - {user_prompt}")
    # added_security_prompt = security_prompt(user_prompt)
    # result = get_resale_transactions_response(user_prompt)
    crew_result = transactions_crew.kickoff(inputs={"input": user_prompt})
    content = retrieve_crew_content(crew_result)
    table = retrieve_crew_table(crew_result)
    table_frame = pd.DataFrame(table)

    messages.chat_message("user").write(user_prompt)
    st.dataframe(table_frame, use_container_width=True)
    # for key, value in content.items():
    # # Display the key as the title
    #     st.header(key)

    # # Check if the value is a dictionary (like "Price Range")
    # if isinstance(value, dict):
    #     # Iterate through the dictionary to display its key-value pairs
    #     for sub_key, sub_value in value.items():
    #         st.write(f"**{sub_key}**: {sub_value}")
    # else:
    #     # Display the content for other keys
    #     st.write(value)
    messages.chat_message("assistant").write(f"HDB Expert: {content}")
    st.session_state.form_enabled = True
