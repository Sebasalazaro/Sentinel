import os, json, hmac, hashlib
from datetime import datetime
from fastapi import FastAPI, Request, HTTPException
import boto3

app = FastAPI()

AWS_REGION = os.getenv("AWS_REGION")
SQS_URL = os.getenv("SQS_URL")
WEBHOOK_SECRET = os.getenv("GITHUB_WEBHOOK_SECRET", "")

sqs = boto3.client("sqs", region_name=AWS_REGION)

def verify_signature(raw_body: bytes, signature_header: str) -> bool:
    # para validar el signature de github
    if not WEBHOOK_SECRET:
        return False 
    if not signature_header or not signature_header.startswith("sha256="):
        return False
    digest = hmac.new(WEBHOOK_SECRET.encode(), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(digest, signature_header.split("=", 1)[1])

@app.get("/health")
def health():
    return {"ok": True, "time": datetime.utcnow().isoformat()}

@app.post("/webhook")
async def webhook(req: Request):
    raw = await req.body()
    sig = req.headers.get("X-Hub-Signature-256")
    event = req.headers.get("X-GitHub-Event", "unknown")
    
    print("[WEBHOOK] event=", event)

    if not verify_signature(raw, sig):
        raise HTTPException(status_code=401, detail="invalid signature")

    if event == "ping":
        return {"pong": True}

    data = await req.json()
    repo_url = data.get("repo_url") or data.get("repository", {}).get("clone_url")
    ref = data.get("ref") or "main"
    if not repo_url:
        raise HTTPException(status_code=400, detail="repo_url requerido")

    body = json.dumps({"repo_url": repo_url, "ref": ref})
    resp = sqs.send_message(
        QueueUrl=SQS_URL,
        MessageBody=body,
        MessageAttributes={
            "source": {"DataType": "String", "StringValue": "github-webhook"},
            "event": {"DataType": "String", "StringValue": event}
        }
    )
    print("[SQS] sent", resp.get("MessageId"), "to", SQS_URL)
    return {"status": "queued", "messageId": resp.get("MessageId")}, 202
