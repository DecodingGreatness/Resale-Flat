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
        submitted_price = st.form_submit_button("Submit")

    if submitted_price:
        with st.status("Processing Input... Please expect longer processing time", expanded=True) as status:
            st.toast(f"User Input Submitted - {user_prompt}")
            crew_result = transactions_crew.kickoff(inputs={"input": user_prompt})

            content = retrieve_crew_content(crew_result,user_prompt)
            table = retrieve_crew_table(crew_result)
            table_frame = pd.DataFrame(table)

            st.dataframe(table_frame, use_container_width=True)
            st.write(content)
            st.session_state.form_enabled = True
