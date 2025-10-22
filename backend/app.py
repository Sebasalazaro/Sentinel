from fastapi import FastAPI, Request
import boto3, os, json
from datetime import datetime

app = FastAPI()

AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
SQS_URL = os.getenv("SQS_URL") 
sqs = boto3.client("sqs", region_name=AWS_REGION)

@app.get("/health")
def health():
    return {"ok": True, "time": datetime.utcnow().isoformat()}

@app.post("/webhook")
async def webhook(req: Request):
    data = await req.json()
    repo_url = data.get("repo_url") or data.get("repository", {}).get("clone_url")
    ref = data.get("ref", "main")
    if not repo_url:
        return {"error": "no repo_url"}, 400

    body = json.dumps({"repo_url": repo_url, "ref": ref})
    sqs.send_message(QueueUrl=SQS_URL, MessageBody=body)
    return {"status": "queued", "repo": repo_url}, 202
