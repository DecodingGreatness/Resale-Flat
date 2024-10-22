import streamlit as st
from helper_functions.utility import check_password


if not check_password():
    st.stop()

else:
    # region <--------- Streamlit App Configuration --------->
    # st.set_page_config(
    #     layout="centered",
    #     page_title="My Streamlit App"
    # )

    # endregion <--------- Streamlit App Configuration --------->

    # if st.button("Home", key="home_button"):
    #     st.switch_page("pages/about_us.py")
    # if st.button("Grant Eligibility Checker", key="grant_button"):
    #     st.switch_page("pages/grant_eligibility.py")
    # if st.button("Resale Transaction Price Advisor", key="price_button"):
    #     st.switch_page("pages/resale_transaction_price.py")

    st.title("Main App")

    # Sidebar menu for navigation
    st.sidebar.title("Menu")
    menu_options = ["Home", "About Us","Methodology","Grant Eligibility", "Resale Price Insights"]
    selected_page = st.sidebar.selectbox("Choose a page", menu_options)

    # Store the selected page in session state
    st.session_state.selected_page = selected_page

    # Routing logic to different pages
    if st.session_state.selected_page == "Home":
        st.write("Welcome to the Home Page.")
    elif st.session_state.selected_page == "About Us":
        # Load content from page1.py
        with open("pages/about_us.py") as f:
            exec(f.read())
    elif st.session_state.selected_page == "Methodology":
        # Load content from page1.py
        with open("pages/methodology.py") as f:
            exec(f.read())
    elif st.session_state.selected_page == "Grant Eligibility":
        import pages.grant_eligibility
    elif st.session_state.selected_page == "Resale Price Insights":
        # Load content from page2.py
        with open("pages/resale_transaction_price.py") as f:
            exec(f.read())

    with st.expander("IMPORTANT NOTICE"):
        st.write(

        """

        IMPORTANT NOTICE: This web application is a prototype developed for educational purposes only. The information provided here is NOT intended for real-world usage and should not be relied upon for making any decisions, especially those related to financial, legal, or healthcare matters.

        Furthermore, please be aware that the LLM may generate inaccurate or incorrect information. You assume full responsibility for how you use any generated output.

        Always consult with qualified professionals for accurate and personalized advice.

        """
    )
