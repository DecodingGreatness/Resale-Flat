import streamlit as st
from helper_functions.utility import check_password
from pages.grant_eligibility import show_grant_eligibility
from pages.resale_transaction_price import resale_price
from pages.about_us import about_us
from pages.price_methodology import price_methodology
from pages.grant_methodology import grant_methodology


if not check_password():
    st.stop()

else:

    st.title("Resale Flat Home Buyers")

    home, about, methodology = st.tabs(["Home","About Us", "Methodology"])
    with home:
        st.subheader("Eligibility for HDB Grants:")
        st.markdown("""
           This conversational chatbot helps buyers identify which HDB grants they are eligible for and
           outlines the specific conditions attached to each grant.
        """)
        st.subheader("Determining Resale Flat Prices:")
        st.markdown("""
            This insights generator assists buyers in evaluating whether the resale
            flat prices are fair, helping them assess if a price is too
            high or too low for their purchase.
        """)
        grant_eligibility, resale_transaction_price = st.tabs(["Grant Eligibility","Resale Transaction Price"])
        with grant_eligibility:
            st.header("🫰 Grant Eligibility Checker for Resale Flat")
            show_grant_eligibility()
        with resale_transaction_price:
            st.header("📈 Resale Transaction Price Advisor")
            resale_price()

    with about:
        st.header("🏠 About Us")
        about_us()

    with methodology:
        st.header("📜 Methodology")
        grant_approach,price_approach = st.tabs(["📙 Grant Eligibility Methodology","📘 Resale Price Methodology"])
        with grant_approach:
            grant_methodology()
        with price_approach:
            price_methodology()

    with st.expander("IMPORTANT NOTICE"):
        st.write(

        """

        IMPORTANT NOTICE: This web application is a prototype developed for educational purposes only. The information provided here is NOT intended for real-world usage and should not be relied upon for making any decisions, especially those related to financial, legal, or healthcare matters.

        Furthermore, please be aware that the LLM may generate inaccurate or incorrect information. You assume full responsibility for how you use any generated output.

        Always consult with qualified professionals for accurate and personalized advice.

        """
    )
