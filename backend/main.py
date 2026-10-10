
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="King's College AI Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str

WEBSITE = "https://www.kingsengg.edu.in/"

COURSES = (
    "Undergraduate programmes:\n"
    "• B.Tech Information Technology\n"
    "• B.Tech Artificial Intelligence and Data Science\n"
    "• B.E. Civil Engineering\n"
    "• B.E. Computer Science and Engineering\n"
    "• B.E. Electronics and Communication Engineering\n"
    "• B.E. Electrical and Electronics Engineering\n"
    "• B.E. Mechanical Engineering\n\n"
    "Postgraduate programmes:\n"
    "• M.E. VLSI Design\n"
    "• M.E. Thermal Engineering\n"
    "• M.E. Power Electronics and Drives\n"
    "• M.E. Computer Science and Engineering\n"
    "• MBA\n\n"
    f"Verify current availability at {WEBSITE}courses-offered.html"
)

ANSWERS = [
    (["course", "department", "branch", "degree", "what can i study"],
     COURSES),

    (["placement", "recruiter", "job opportunity", "campus interview"],
     "King's College of Engineering has a Training and Placement Cell "
     "that supports students through soft-skills training, industry "
     "interactions and placement activities. For current placement "
     f"statistics and recruiters, visit {WEBSITE}"),

    (["contact", "phone", "mobile", "email", "call"],
     "Official college contact details:\n"
     "Phone: +91-6380989024\n"
     "Email: contact@kingsengg.edu.in\n"
     f"Website: {WEBSITE}"),

    (["where", "location", "address", "enga", "punalkulam", "reach"],
     "King's College of Engineering is located at Punalkulam, "
     "near Thanjavur, Gandarvakottai Taluk, Pudukkottai District "
     "– 613303, Tamil Nadu, India.\n"
     f"Website: {WEBSITE}"),

    (["admission", "apply", "eligibility", "application"],
     "For admission procedures, eligibility and online application "
     f"details, visit the official website: {WEBSITE}"),

    (["fee", "fees", "tuition", "scholarship"],
     "Fees depend on the programme and admission category. Please "
     f"confirm the current fee structure with the college: {WEBSITE}"),

    (["hostel", "transport", "bus", "library", "facility",
      "facilities", "laboratory", "lab", "campus"],
     "For current details about hostel, transport, library and other "
     f"campus facilities, visit {WEBSITE}"),

    (["about college", "history", "founded", "established"],
     "King's College of Engineering was founded in 2001 by Raj "
     "Educational Trust. The college states that it is AICTE-approved, "
     "affiliated to Anna University, and has autonomous status. "
     f"More details: {WEBSITE}about-college.html"),
]

@app.get("/")
def home():
    return {"message": "King's College AI Assistant API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/chat")
def chat(request: ChatRequest):
    question = request.question.lower().strip()

    for keywords, answer in ANSWERS:
        if any(word in question for word in keywords):
            return {"answer": answer}

    return {
        "answer": (
            "I am King's College AI Assistant. I can help with courses, "
            "admissions, placements, facilities and contact details. "
            "For information I cannot verify, please visit " + WEBSITE
        )
    }
