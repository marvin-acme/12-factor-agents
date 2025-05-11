# Chapter 2 - Embeddings and Semantic Search

Let's implement category embedding and semantic search to narrow down categories.

First, we'll need to set up OpenAI for embeddings.
Create a `.env` file with your OpenAI API key:

```
OPENAI_API_KEY=sk-...
```


Update hello.py with embedding and search functions

```diff
hello.py
 import dotenv
+import openai
+import numpy as np
 from pydantic import BaseModel
 
 dotenv.load_dotenv()
+client = openai.OpenAI()
 
 class Category(BaseModel):
     ]
 
+def embed(text: str) -> list[float]:
+    response = client.embeddings.create(
+        model="text-embedding-3-small",
+        input=text,
+    )
+    return response.data[0].embedding
+
+def _narrow_down_categories(text: str, categories: list[Category]) -> list[Category]:
+    embeddings: list[tuple[Category, list[float]]] = []
+    for category in categories:
+        embeddings.append((category, embed(category.embedding_text)))
+    text_embedding = embed(text)
+    best_matches: list[tuple[Category, float]] = []
+    for category, embedding in embeddings:
+        cosine_similarity = np.dot(text_embedding, embedding) / (np.linalg.norm(text_embedding) * np.linalg.norm(embedding))
+        best_matches.append((category, cosine_similarity))
+    max_matches = 5
+    matches = sorted(best_matches, key=lambda x: x[1], reverse=True)[:max_matches]
+    return [match[0] for match in matches]
+
 def main():
     categories = load_categories()
-    for category in categories:
-        print(f"{category.name}: {category.llm_description}")
+    narrowed = _narrow_down_categories("I want to buy a new phone", categories)
+    print("Top categories for 'I want to buy a new phone':")
+    for category in narrowed:
+        print(f"- {category.name}")
 
 if __name__ == "__main__":
```

<details>
<summary>skip this step</summary>

    cp ./walkthrough-classification/02-hello.py hello.py

</details>

Run it to verify

    uv run python hello.py

You should see the top 5 categories for 'I want to buy a new phone'

