import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew

os.chdir(os.path.dirname(os.path.abspath(__file__)))
print(f"The current working directory is: {os.getcwd()}")

load_dotenv('.env')

agent_consultant = Agent(
    role="Resale HDB flat consultant",
    goal="Provide factually accurate information on {topic}. Advise what HDB grants would be suitable for audience",

    backstory="""You're an officer working in the housing development board with great knowledge on the topic: {topic}"
    You provide accurate information that helps the audience plan what grants to take and make informed decisions."
    Your work is come up with the most relevant grants the audience can take""",

    allow_delegation=False,
	verbose=True,
)

agent_writer = writer = Agent(
    role="Content Writer",
    goal="Provide factual information the topic: {topic}. Explain what the grant is and the conditions attached to it",

    backstory="""You're working on a writing suitable HDB grants about the topic: {topic}.
    You base your writing on the work of the Resale HDB flat consultant, who provides an outline and relevant context about the topic.
    You follow the main objectives and direction of the outline as provide by the Resale HDB flat consultant.""",

    allow_delegation=False,
    verbose=True,
)

task_plan = Task(
    description="""\
    1. Ask audience questions related to {topic}.
    2. Identify matching HDB grant options for audience.
    3. Advise audience on most suitable grant they can take giving brief introduction and highlight conditions to bear in mind.""",

    expected_output="""\
    constructive reponse to what types of grants the user can take.""",
    agent=agent_consultant,
)

task_write = Task(
    description="""\
    1. Use vector_db to craft answer on {topic} based on the target audience's interests.
    2. Sections/Subtitles are properly named in an engaging manner.
    3. Ensure the post is structured with an engaging introduction, insightful body, and a summarizing conclusion.
   """,

    expected_output="""
    A well-structed answer"in markdown format.""",
    agent=agent_writer,
)


crew = Crew(
    agents=[agent_consultant, agent_writer],
    tasks=[task_plan, task_write],
    verbose=True
)

result = crew.kickoff(inputs={"topic": "Resale HDB flat"})

print(f"Raw Output: {result.raw}")
print("-----------------------------------------\n\n")
print(f"Token Usage: {result.token_usage}")
print("-----------------------------------------\n\n")
print(f"Tasks Output of Task 1: {result.tasks_output[0]}")
print("-----------------------------------------\n\n")
print(f"Tasks Output of Task 2: {result.tasks_output[1]}")
