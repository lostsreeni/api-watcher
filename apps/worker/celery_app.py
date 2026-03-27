from celery import Celery
import os

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")

app = Celery("worker", broker=redis_url, backend=redis_url)


@app.task
def dummy_task():
    return "Task completed"
