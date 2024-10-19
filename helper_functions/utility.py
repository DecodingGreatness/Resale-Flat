import streamlit as st
import requests
import hmac
from datetime import datetime
from dateutil.relativedelta import relativedelta

# """
# This file contains the common components used in the Streamlit App.
# This includes the sidebar, the title, the footer, and the password check.
# """


def check_password():
    """Returns `True` if the user had the correct password."""
    def password_entered():
        """Checks whether a password entered by the user is correct."""
        if hmac.compare_digest(st.session_state["password"], st.secrets["password"]):
            st.session_state["password_correct"] = True
            del st.session_state["password"]  # Don't store the password.
        else:
            st.session_state["password_correct"] = False
    # Return True if the passward is validated.
    if st.session_state.get("password_correct", False):
        return True
    # Show input for password.
    st.text_input(
        "Password", type="password", on_change=password_entered, key="password"
    )
    if "password_correct" in st.session_state:
        st.error("😕 Password incorrect")
    return False

def modifyCount(text):
    count = int(text)
    modified_count = (count // 100) * 100
    print(modified_count)
    return modified_count

def getCurrentDate():
    now = datetime.now()
    current_month = now.month
    current_year = now.year
    formatted_month = f"{current_month:02}"
    date_string = f"{current_year}-{formatted_month}"
    print(date_string)
    return date_string

def getMonthsAgoDate(number):
    now = datetime.now()
    past_month_date = now - relativedelta(months=number)
    past_month = past_month_date.month
    past_three_month_year = past_month_date.year
    formatted_month = f"{past_month:02}"
    old_date_string = f"{past_three_month_year}-{formatted_month}"
    print(old_date_string)
    return old_date_string

def retrieve_three_months_date():
    three_months = []
    today_month = getCurrentDate()
    previous_month = getMonthsAgoDate(1)
    three_months_ago = getMonthsAgoDate(2)
    print(today_month,previous_month,three_months_ago)
    three_months.extend([three_months_ago,previous_month,today_month])
    print(three_months)
    return three_months

def retrieve_outputs(response):
    outputs = response['output']
    return outputs
