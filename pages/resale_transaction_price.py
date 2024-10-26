import streamlit as st
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from business_logic.transaction_price.crew import transactions_crew
import pandas as pd
from helper_functions.utility import retrieve_crew_content,retrieve_crew_table

def resale_price():

    with st.form(key="2",clear_on_submit=True,enter_to_submit=True):
        user_prompt = st.text_area("Enter your text here:",
                                                value="",
                                                height=200,
                                                placeholder="Type something...")
        submitted_price = st.form_submit_button("Submit price")
        messages = st.container(height=200)

    if submitted_price:
        with st.status("Processing Input...", expanded=True) as status:
            st.toast(f"User Input Submitted - {user_prompt}")
            crew_result = transactions_crew.kickoff(inputs={"input": f"{user_prompt}"})
            print(f"Raw Output: {crew_result}")
            # content = retrieve_crew_content(crew_result)
            # table = retrieve_crew_table(crew_result)
            # table_frame = pd.DataFrame(table)

            messages.chat_message("user").write(user_prompt)
            # st.dataframe(table_frame, use_container_width=True)
            messages.chat_message("assistant").write(f"HDB Expert: {crew_result}")
            st.session_state.form_enabled = True
