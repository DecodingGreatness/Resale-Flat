import streamlit as st

def about_us():

    st.subheader("Project Scope Statement:", divider=True)

    st.markdown("""
        This project aims to develop a website that assists HDB resale buyers in two key areas:
    """)

    st.markdown("""
        - **Grant Eligibility**: The website will provide essential information on available
        HDB grants for resale buyers, including basic eligibility criteria and key conditions
        for each grant. This will help users quickly assess their potential eligibility.
    """)

    st.markdown("""
    - **Resale Flat Pricing**: Users will indicate their desired resale flat price,
        and the website will display recent transaction data along with insights on
        whether the indicated price is considered high or low based on current market
        trends. This feature will enable buyers to make more informed decisions regarding
        their purchases.
    """)

    st.subheader("Objectives:", divider=True)

    st.markdown("""
        1. The objective of this project is to develop a website that streamlines the process
        of understanding HDB grants and resale flat pricing for potential buyers. Given that
        there are over 23,000 registered resale flats since 2018, it is estimated that users
        collectively spend approximately 7,666 hours trying to navigate grant eligibility
        information, often taking at least 20 minutes each to comprehend the details.

        2. This website aims to reduce the time spent by providing clear, concise information on
        grant options and the conditions attached, enabling users to plan their finances
        more effectively. Additionally, the website will allow users to assess recent
        transaction prices, helping them make informed financial decisions regarding their
        resale flat purchases.

        3. By minimizing the chances of miscalculating their financial
        plans—such as overlooking or mistakenly including grants—this tool will enhance
        decision-making for HDB resale buyers, ultimately facilitating a smoother purchasing
        experience.
    """)

    st.subheader("Features:", divider=True)

    st.subheader("Conversational Chatbot")
    st.markdown("""
    - **Description**: Our chatbot is designed to assist resale flat homebuyers by providing answers to questions about HDB grant eligibility.
    """)

    st.subheader("Consultational Chatbot")
    st.markdown("""
    - **Description**: This chatbot offers insights into recent resale transactions from the past three months. It can interpret user-provided prices and indicate whether they are above or below the market trend based on the latest transaction data.
    """)

    st.subheader("Data Sources:", divider=True)

    st.subheader("Resale flat prices")
    st.subheader("Original Source")
    st.markdown("""
        1. https://data.gov.sg/datasets/d_8b84c4ee58e3cfc0ece0d773c8ca6abc/view?dataExplorerPage=19085
    """)

    st.subheader("API url")
    st.markdown("""
        1. https://api-open.data.gov.sg/v1/public/api/datasets/d_8b84c4ee58e3cfc0ece0d773c8ca6abc/poll-download
        2. https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc
    """)

    st.subheader("Grant Eligibility")
    st.subheader("Families")
    st.markdown("""
        1. https://www.hdb.gov.sg/residential/buying-a-flat/understanding-your-eligibility-and-housing-loan-options/flat-and-grant-eligibility/couples-and-families/enhanced-cpf-housing-grant-families
        2. https://www.hdb.gov.sg/residential/buying-a-flat/understanding-your-eligibility-and-housing-loan-options/flat-and-grant-eligibility/couples-and-families/cpf-housing-grants-for-resale-flats-families
        3. https://www.hdb.gov.sg/residential/buying-a-flat/understanding-your-eligibility-and-housing-loan-options/flat-and-grant-eligibility/couples-and-families/step-up-cpf-housing-grant-families
        4. https://www.hdb.gov.sg/residential/buying-a-flat/understanding-your-eligibility-and-housing-loan-options/flat-and-grant-eligibility/couples-and-families/proximity-housing-grant-families
    """)

    st.subheader("Singles")
    st.markdown("""
        1. https://www.hdb.gov.sg/residential/buying-a-flat/understanding-your-eligibility-and-housing-loan-options/flat-and-grant-eligibility/singles/enhanced-cpf-housing-grant-singles
        2. https://www.hdb.gov.sg/residential/buying-a-flat/understanding-your-eligibility-and-housing-loan-options/flat-and-grant-eligibility/singles/cpf-housing-grant-for-resale-flats-singles
        3. https://www.hdb.gov.sg/residential/buying-a-flat/understanding-your-eligibility-and-housing-loan-options/flat-and-grant-eligibility/singles/proximity-housing-grant-singles
    """)
