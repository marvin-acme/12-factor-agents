import dotenv
from pydantic import BaseModel

dotenv.load_dotenv()

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

def main():
    categories = load_categories()
    for category in categories:
        print(f"{category.name}: {category.llm_description}")

if __name__ == "__main__":
    main()