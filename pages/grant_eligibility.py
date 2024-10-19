import streamlit as st
import sys
import os
import time
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from business_logic.grant_eligibility.rag import app
from helper_functions.llm import security_prompt

st.title("Resale Grant Eligibility Checker")

form = st.form(key="form",clear_on_submit=True, enter_to_submit=True, border=True)
form.subheader("Prompt")

user_prompt = form.text_area("Enter your prompt here", height=200)
messages = st.container(height=300)

if 'messages' not in st.session_state:
    st.session_state.messages = []

with messages:
    if form.form_submit_button("Submit"):
        with st.status("Processing Input...", expanded=True) as status:
            st.toast(f"User Input Submitted - {user_prompt}")


            config = {"configurable": {"thread_id": "abc123"}}
            result = app.invoke(
                {"input": f"{user_prompt}"},
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
