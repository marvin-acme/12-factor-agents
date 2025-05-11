# Chapter 1 - BAML and Categories

Now let's set up BAML and define our category structure.

Initialize BAML

    uv run baml-cli init

Remove default resume.baml

    rm baml_src/resume.baml

Update hello.py with Category model and loader

```diff
hello.py
+import dotenv
+from pydantic import BaseModel
+
+dotenv.load_dotenv()
+
+class Category(BaseModel):
+    name: str
+    embedding_text: str
+    llm_description: str
+
+def load_categories() -> list[Category]:
+    return [
+        Category(
+            name="Search Products",
+            embedding_text="Find products",
+            llm_description="User is looking to search for products"
+        ),
+        Category(
+            name="Buy Product",
+            embedding_text="do something with money",
+            llm_description="User is looking to buy a product"
+        ),
+        Category(
+            name="View Product Details",
+            embedding_text="Product details",
+            llm_description="User wants to view detailed information about a product"
+        ),
+    ]
+
 def main():
-    print("hello, world!")
+    categories = load_categories()
+    for category in categories:
+        print(f"{category.name}: {category.llm_description}")
 
 if __name__ == "__main__":
```

<details>
<summary>skip this step</summary>

    cp ./walkthrough-classification/01-hello.py hello.py

</details>

Generate BAML client code

    uv run baml-cli generate

Run it to verify

    uv run python hello.py

You should see a list of categories printed

