FROM python:3.10-slim

# Install system dependencies for OpenCV
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download and pre-cache model files at build time so runtime is instant
RUN python -c "from transformers import SegformerForSemanticSegmentation, SegformerImageProcessor; SegformerImageProcessor.from_pretrained('nvidia/segformer-b5-finetuned-ade-640-640'); SegformerForSemanticSegmentation.from_pretrained('nvidia/segformer-b5-finetuned-ade-640-640')"

COPY . .

# Run FastAPI on port 7860 (Hugging Face's default port)
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "7860"]
