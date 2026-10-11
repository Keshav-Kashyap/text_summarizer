from fastapi import FastAPI
import requests
from pydantic import BaseModel
from transformers import T5Tokenizer,T5ForConditionalGeneration
import torch
import re
from fastapi.middleware.cors import CORSMiddleware

#initialize 
app = FastAPI(title="Text Summarizer App",description="Text Summarization using T5",version="1.0") 

# add cors middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# model & tokenizer

model= T5ForConditionalGeneration.from_pretrained("./saved_summary_model")
tokenizer= T5Tokenizer.from_pretrained("./saved_summary_model")

#device
if torch.backends.mps.is_available():
    device = torch.device("mps")
elif torch.cuda.is_available():
    device = torch.device("cuda")
else:
    device = torch.device("cpu")

model.to(device)

#input Schema 
class  DialogueInput(BaseModel):
    dialogue:str


def clean_data(text):
    text= re.sub(r"\r\n"," ",text) # Remove lines
    text= re.sub(r"\s+"," ",text) # Remove spaces
    text= re.sub(r"<.*?>"," ",text) # Remove html tags
    text = text.strip().lower()
    return text


def summarize_dialogue(dialogue:str) -> str:
    dialogue = clean_data(dialogue) # clean

    #tokenize
    inputs = tokenizer(
        dialogue,
        padding="max_length",
        max_length=512,
        truncation=True,
        return_tensors="pt"
    ).to(device)

    #generate the summary => token ids
    model.to(device)
    targets = model.generate(
        input_ids=inputs["input_ids"],
        attention_mask=inputs["attention_mask"],
        max_length=150,
        num_beams=4,
        early_stopping=True
    )

    #token ids to text(decoding)
    summary=tokenizer.decode(targets[0],skip_special_tokens=True)
    return summary

#API Endpoints

@app.post("/summarize/")
async def summarize( dialogue_input :DialogueInput):
    summary= summarize_dialogue(dialogue_input.dialogue)
    return {"summary":summary}

@app.get("/health")
async def helath():
    return{"status":"ok"}