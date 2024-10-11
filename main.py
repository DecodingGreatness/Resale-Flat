import streamlit as st
from helper_functions.utility import check_password
import helper_functions.llm as llm

if not check_password():
    st.stop()
else:
    # region <--------- Streamlit App Configuration --------->
    st.set_page_config(
        layout="centered",
        page_title="My Streamlit App"
    )
    # endregion <--------- Streamlit App Configuration --------->

    if st.button("Home", key="home_button"):
        st.switch_page("pages/about_us.py")
    if st.button("Grant Eligibility Checker", key="grant_button"):
        st.switch_page("pages/grant_eligibility.py")
    if st.button("Resale Transaction Price Advisor", key="price_button"):
        st.switch_page("pages/resale_transaction_price.py")
