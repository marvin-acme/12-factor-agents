import dotenv
import openai
import numpy as np
from pydantic import BaseModel
from baml_client import b
from baml_client.type_builder import TypeBuilder

dotenv.load_dotenv()
client = openai.OpenAI()

class Category(BaseModel):
    name: str
    embedding_text: str
    llm_description: str

def load_categories() -> list[Category]:
    return [
        Category(
            name="Search Products",
            embedding_text="Find products",
            llm_description="User is looking to search for products"
        ),
        Category(
            name="Buy Product",
            embedding_text="do something with money",
            llm_description="User is looking to buy a product"
        ),
        Category(
            name="View Product Details",
            embedding_text="Product details",
            llm_description="User wants to view detailed information about a product"
        ),
    ]

def embed(text: str) -> list[float]:
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text,
    )
    return response.data[0].embedding

def _narrow_down_categories(text: str, categories: list[Category]) -> list[Category]:
    embeddings: list[tuple[Category, list[float]]] = []
    for category in categories:
        embeddings.append((category, embed(category.embedding_text)))
    text_embedding = embed(text)
    best_matches: list[tuple[Category, float]] = []
    for category, embedding in embeddings:
        cosine_similarity = np.dot(text_embedding, embedding) / (np.linalg.norm(text_embedding) * np.linalg.norm(embedding))
        best_matches.append((category, cosine_similarity))
    max_matches = 5
    matches = sorted(best_matches, key=lambda x: x[1], reverse=True)[:max_matches]
    return [match[0] for match in matches]

def _pick_best_category(text: str, categories: list[Category]) -> Category:
    tb = TypeBuilder()
    for i, category in enumerate(categories):
        val = tb.Category.add_value(category.name)
        val.alias(f"k{i}")  # Add aliases k0, k1, etc.
        val.description(category.llm_description)

    selected_category = b.PickBestCategory(text, { "tb": tb })
    for category in categories:
        if category.name == selected_category:
            return category
    raise ValueError(f"Selected category {selected_category} not found in categories")

def pick_category(text: str) -> str:
    categories = load_categories()
    narrowed_down_categories = _narrow_down_categories(text, categories)
    category = _pick_best_category(text, narrowed_down_categories)
    return category.name

def main():
    result = pick_category("I want to buy a new phone")
    print(f"Best category: {result}")

if __name__ == "__main__":
    main()