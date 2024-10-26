import streamlit as st
import sys
import os
import time
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from business_logic.grant_eligibility.grant_eligibility_rag import app
from helper_functions.llm import security_prompt

def show_grant_eligibility():

    if 'messages' not in st.session_state:
        st.session_state.messages = []

    with st.form(key="form",clear_on_submit=True,enter_to_submit=True):
        user_prompt_1 = st.text_area("Enter your text here:",
                                                value="",
                                                height=200,
                                                placeholder="Type something...")
        submitted = st.form_submit_button("Submit Grant")
        messages = st.container(height=300)

    with messages:
        if submitted:
            with st.status("Processing Input...", expanded=True) as status:
                st.toast(f"User Input Submitted - {user_prompt_1}")


                config = {"configurable": {"thread_id": "abc123"}}
                result = app.invoke(
                    {"input": f"{user_prompt_1}"},
                    config=config,
                )

                chat_history = app.get_state(config).values["chat_history"]

                status.update(
                    label="Process completed!", state="complete", expanded=False
                )

                for index, message in enumerate(chat_history):
                    if index % 2 == 0:
                        messages.chat_message("user").write(message.content)
                    else:
                        messages.chat_message("assistant").write(f"HDB Expert: {message.content}")
            st.session_state.form_enabled = True

            if st.session_state.messages:
                st.write(st.session_state.messages[-1])
