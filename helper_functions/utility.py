import streamlit as st
import json
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

    st.title("Please enter the password to access the app.")
    # Show input for password.
    st.text_input(
        "Password", type="password", on_change=password_entered, key="password"
    )

    with st.expander("IMPORTANT NOTICE"):
        st.write(
            """

            IMPORTANT NOTICE: This web application is a prototype developed for educational purposes only. The information provided here is NOT intended for real-world usage and should not be relied upon for making any decisions, especially those related to financial, legal, or healthcare matters.

            Furthermore, please be aware that the LLM may generate inaccurate or incorrect information. You assume full responsibility for how you use any generated output.

            Always consult with qualified professionals for accurate and personalized advice.
            """
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

def retrieve_crew_content(crew_result,user_prompt):
    content = crew_result.raw
    print("Raw content:", content)  # Debugging

    if isinstance(content, bytes):
        content = content.decode('utf-8')

    content = content.strip()
    if not content:
        print("Content is empty.")
        return None

    start_index = content.find('{')
    end_index = content.rfind('}') + 1

    if start_index == -1 or end_index == -1:
        print("Could not find valid JSON in content.")
        return None

    json_str = content[start_index:end_index]
    print("Extracted JSON string:", json_str)  # Debugging

    try:
        parsed_data = json.loads(json_str)
    except json.JSONDecodeError as e:
        print("JSON decode error:", e)
        print("JSON string attempted to parse:", json_str)  # Debugging
        return None

    if 'content' in parsed_data:
        parsed_content = parsed_data.get('content', [])
        print("parsed Content:", parsed_content, type(parsed_content))  # Debugging
         # Check if parsed_content is a dictionary
        st.header(user_prompt)
        if isinstance(parsed_content, dict):
            insights = parsed_content.get('insights', [])
            summary = parsed_content.get('summary', '')

            # Display the summary if available
            if summary:
                st.header("Summary")
                st.write(summary)

            # Process insights based on their structure
            if insights:
                st.header("Insights")
                if isinstance(insights, list):
                    for insight in insights:
                        if isinstance(insight, dict):
                            # If the insight is a dictionary with title and description
                            title = insight.get('title', 'No Title')  # Default title if not found
                            description = insight.get('description', 'No description available.')  # Default description

                            st.subheader(title)
                            st.write(description)
                        elif isinstance(insight, str):
                            # If the insight is a simple string
                            st.write(insight)  # Display the string directly
                else:
                    st.write("Insights are not structured as expected.")
            else:
                st.write("No insights available.")

        elif isinstance(parsed_content, str):
            # If parsed_content is a simple string
            st.header(user_prompt)
            st.write(parsed_content)  # Display the string directly
        else:
            print("Expected 'content' to be either a dictionary or a string.")
            st.write("Content is not structured as expected.")
    else:
        print("Expected 'content' key not found in parsed data.")

def retrieve_crew_table(crew_result):
    content = crew_result.raw
    start_index = content.find('{')
    end_index = content.rfind('}') + 1
    json_str = content[start_index:end_index]
    parsed_data = json.loads(json_str)
    table = parsed_data.get('table', [])
    return table
