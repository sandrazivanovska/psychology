from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from chat_bot import ask_groq
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]

@app.post("/api/mental-health-chat")
def chat(req: ChatRequest):
    last_user_message = ""
    history = []

    for msg in req.messages:
        if msg.role == "user":
            last_user_message = msg.content
        history.append({"role": msg.role, "content": msg.content})

    context = history[:-1] if history else []

    reply = ask_groq(last_user_message, context)
    return {"reply": reply}
app.mount("/", StaticFiles(directory="dist", html=True), name="static")

