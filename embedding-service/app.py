from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer
import logging


# ============================================================
# LOGGING
# ============================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

logger = logging.getLogger(__name__)


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Product Embedding Service",
    description="Embedding service for the E-Commerce Platform using BGE-small.",
    version="1.0.0"
)


# ============================================================
# LOAD EMBEDDING MODEL
# ============================================================

MODEL_NAME = "BAAI/bge-small-en-v1.5"

logger.info("Loading embedding model: %s", MODEL_NAME)

model = SentenceTransformer(
    MODEL_NAME
)

logger.info("Embedding model loaded successfully.")


# ============================================================
# REQUEST / RESPONSE MODELS
# ============================================================

class EmbeddingRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=1,
        description="Text that should be converted into an embedding."
    )


class EmbeddingResponse(BaseModel):
    dimension: int
    embedding: list[float]


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def root():
    return {
        "service": "Product Embedding Service",
        "status": "running",
        "model": MODEL_NAME
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": MODEL_NAME
    }


# ============================================================
# GENERATE EMBEDDING
# ============================================================

@app.post(
    "/embed",
    response_model=EmbeddingResponse
)
def generate_embedding(request: EmbeddingRequest):

    try:

        logger.info(
            "Generating embedding for text length: %d",
            len(request.text)
        )

        embedding = model.encode(
            request.text,
            normalize_embeddings=True
        )

        embedding_list = embedding.tolist()

        return EmbeddingResponse(
            dimension=len(embedding_list),
            embedding=embedding_list
        )

    except Exception as ex:

        logger.exception(
            "Failed to generate embedding"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate embedding."
        ) from ex