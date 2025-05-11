# Building a Large-Scale Text Classifier with Python and BAML

Learn how to build a text classifier that can handle hundreds or thousands of categories by combining embeddings for semantic search with LLMs for final selection.

This walkthrough will guide you through creating a Python application that:
- Uses embeddings to efficiently narrow down categories
- Uses BAML and LLMs to make final category selections
- Handles dynamic category lists
- Provides clear, type-safe interfaces


## Cleanup

Make sure you're starting from a clean slate

Clean up existing files

    rm -rf baml_src/ && rm -rf hello.py

## Chapter 0 - Python Setup

Let's start with a basic Python setup and dependencies.

This guide uses Python and BAML to create a text classifier.

You'll need Python 3.10 or later installed.

We'll use `uv` as our package manager. If you don't have it installed:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```


Create pyproject.toml

    cp ./walkthrough-classification/00-pyproject.toml pyproject.toml

<details>
<summary>show file</summary>

```toml
// ./walkthrough-classification/00-pyproject.toml
[project]
name = "large-scale-classification"
version = "0.1.0"
description = "A walkthrough for building a large-scale text classifier"
readme = "README.md"
requires-python = ">=3.10"
dependencies = [
    "python-dotenv>=1.1.0",
]
```

</details>

Create a simple hello.py

    cp ./walkthrough-classification/00-hello.py hello.py

<details>
<summary>show file</summary>

```py
// ./walkthrough-classification/00-hello.py
def main():
    print("hello, world!")

if __name__ == "__main__":
    main()
```

</details>

Install dependencies

    uv sync

Run it to verify

    uv run python hello.py

You should see:

    hello, world!

## Chapter 1 - BAML and Categories

Now let's set up BAML and define our category structure.

Initialize BAML

    uv run baml-cli init

Remove default resume.baml

    rm baml_src/resume.baml

Add our BAML client configuration

    cp ./walkthrough-classification/01-clients.baml baml_src/clients.baml

<details>
<summary>show file</summary>

```rust
// ./walkthrough-classification/01-clients.baml
// Learn more about clients at https://docs.boundaryml.com/docs/snippets/clients/overview

client<llm> CustomGPT4o {
  provider openai
  options {
    model "gpt-4o"
    api_key env.OPENAI_API_KEY
  }
}

client<llm> CustomGPT4oMini {
  provider openai
  retry_policy Exponential
  options {
    model "gpt-4o-mini"
    api_key env.OPENAI_API_KEY
  }
}

// https://docs.boundaryml.com/docs/snippets/clients/retry
retry_policy Exponential {
  max_retries 2
  strategy {
    type exponential_backoff
    delay_ms 300
    multiplier 1.5
    max_delay_ms 10000
  }
}
```

</details>

Configure BAML code generation for Python

    cp ./walkthrough-classification/01-generators.baml baml_src/generators.baml

<details>
<summary>show file</summary>

```rust
// ./walkthrough-classification/01-generators.baml
// This helps use auto generate libraries you can use in the language of
// your choice. You can have multiple generators if you use multiple languages.
// Just ensure that the output_dir is different for each generator.
generator target {
    // Valid values: "python/pydantic", "typescript", "ruby/sorbet", "rest/openapi"
    output_type "python/pydantic"

    // Where the generated code will be saved (relative to baml_src/)
    output_dir "../"

    // The version of the BAML package you have installed
    version "0.82.0"

    // Valid values: "sync", "async"
    // This controls what `b.FunctionName()` will be (sync or async).
    default_client_mode sync
}
```

</details>

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

## Chapter 2 - Embeddings and Semantic Search

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

## Chapter 3 - LLM Category Selection

Now let's use BAML and an LLM to pick the best category from our narrowed-down list.

Add BAML function for category selection

    cp ./walkthrough-classification/03-pick_best_category.baml baml_src/pick_best_category.baml

<details>
<summary>show file</summary>

```rust
// ./walkthrough-classification/03-pick_best_category.baml
enum Category {
    @@dynamic
}

function PickBestCategory(text: string) -> Category {
    client "openai/gpt-4o-mini"
    prompt #"
        Which category best describes the following text?

        {{ ctx.output_format }}

        {{ _.role('user') }}
        {{ text }}
    "#
}

test TestName {
  functions [PickBestCategory]
  type_builder {
    dynamic enum Category {
        Category1 @description(#"
            for placeholder text
        "#)
        Category2 @description(#"
            for debug logs
        "#)
        Category3 @description(#"
            for error logs
        "#)
    }
  }
  args {
    text #"
      hello world
    "#
  }
}
```

</details>

Update hello.py to use the BAML function

```diff
hello.py
 import numpy as np
 from pydantic import BaseModel
+from baml_client import b
+from baml_client.type_builder import TypeBuilder
 
 dotenv.load_dotenv()
     return [match[0] for match in matches]
 
-def main():
+def _pick_best_category(text: str, categories: list[Category]) -> Category:
+    tb = TypeBuilder()
+    for category in categories:
+        val = tb.Category.add_value(category.name)
+        val.description(category.llm_description)
+
+    selected_category = b.PickBestCategory(text, { "tb": tb })
+    for category in categories:
+        if category.name == selected_category:
+            return category
+    raise ValueError(f"Selected category {selected_category} not found in categories")
+
+def pick_category(text: str) -> str:
     categories = load_categories()
-    narrowed = _narrow_down_categories("I want to buy a new phone", categories)
-    print("Top categories for 'I want to buy a new phone':")
-    for category in narrowed:
-        print(f"- {category.name}")
+    narrowed_down_categories = _narrow_down_categories(text, categories)
+    category = _pick_best_category(text, narrowed_down_categories)
+    return category.name
 
+def main():
+    result = pick_category("I want to buy a new phone")
+    print(f"Best category: {result}")
+
 if __name__ == "__main__":
     main()
```

<details>
<summary>skip this step</summary>

    cp ./walkthrough-classification/03-hello.py hello.py

</details>

Generate updated BAML client

    uv run baml-cli generate

Run it to verify

    uv run python hello.py

You should see the final selected category

## Chapter 4 - Aliases and Prompts

Let's improve our BAML prompts with aliases and better descriptions.

Update pick_best_category.baml with better prompts

```diff
baml_src/pick_best_category.baml
     client "openai/gpt-4o-mini"
     prompt #"
-        Which category best describes the following text?
+        {{ _.role("system") }}
+        You are a helpful assistant that categorizes user requests.
+        You should pick the most appropriate category based on the user's intent.
 
+        {{ _.role("user") }}
+        Which category best describes this text?
+
         {{ ctx.output_format }}
 
-        {{ _.role('user') }}
+        Text to categorize:
         {{ text }}
     "#
   type_builder {
     dynamic enum Category {
-        Category1 @description(#"
+        Category1 @alias("k0") @description(#"
             for placeholder text
         "#)
-        Category2 @description(#"
+        Category2 @alias("k1") @description(#"
             for debug logs
         "#)
-        Category3 @description(#"
+        Category3 @alias("k2") @description(#"
             for error logs
         "#)
```

<details>
<summary>skip this step</summary>

    cp ./walkthrough-classification/04-pick_best_category.baml baml_src/pick_best_category.baml

</details>

Update hello.py to use aliases

```diff
hello.py
 def _pick_best_category(text: str, categories: list[Category]) -> Category:
     tb = TypeBuilder()
-    for category in categories:
+    for i, category in enumerate(categories):
         val = tb.Category.add_value(category.name)
+        val.alias(f"k{i}")  # Add aliases k0, k1, etc.
         val.description(category.llm_description)
 
```

<details>
<summary>skip this step</summary>

    cp ./walkthrough-classification/04-hello.py hello.py

</details>

Generate updated BAML client

    uv run baml-cli generate

Run it to verify

    uv run python hello.py

## Chapter 5 - LLM for Narrowing

Let's add an alternative way to narrow down categories using an LLM.

Update pick_best_category.baml with PickBestCategories

```diff
baml_src/pick_best_category.baml
 }
 
+function PickBestCategories(text: string, count: int) -> Category[] {
+    client "openai/gpt-4o-mini"
+    prompt #"
+        {{ _.role("system") }}
+        You are a helpful assistant that categorizes user requests.
+        You should pick the {{ count }} most appropriate categories based on the user's intent.
+
+        {{ _.role("user") }}
+        Which {{ count }} categories best describe this text?
+
+        {{ ctx.output_format }}
+
+        Text to categorize:
+        {{ text }}
+    "#
+}
+
 function PickBestCategory(text: string) -> Category {
     client "openai/gpt-4o-mini"
```

<details>
<summary>skip this step</summary>

    cp ./walkthrough-classification/05-pick_best_category.baml baml_src/pick_best_category.baml

</details>

Update hello.py with LLM narrowing

```diff
hello.py
     return [match[0] for match in matches]
 
+def _narrow_down_categories_llm(text: str, categories: list[Category]) -> list[Category]:
+    tb = TypeBuilder()
+    for i, category in enumerate(categories):
+        val = tb.Category.add_value(category.name)
+        val.alias(f"k{i}")
+        val.description(category.llm_description)
+    selected_categories = b.PickBestCategories(text, count=3, baml_options={ "tb": tb })
+    return [category for category in categories if category.name in selected_categories]
+
 def _pick_best_category(text: str, categories: list[Category]) -> Category:
     tb = TypeBuilder()
     for i, category in enumerate(categories):
         val = tb.Category.add_value(category.name)
-        val.alias(f"k{i}")  # Add aliases k0, k1, etc.
+        val.alias(f"k{i}")
         val.description(category.llm_description)
 
 
 def pick_category(text: str) -> str:
+    use_llm_to_narrow_down_categories = False
+
     categories = load_categories()
     narrowed_down_categories = _narrow_down_categories(text, categories)
+    if use_llm_to_narrow_down_categories:
+        narrowed_down_categories = _narrow_down_categories_llm(text, categories)
     category = _pick_best_category(text, narrowed_down_categories)
     return category.name
```

<details>
<summary>skip this step</summary>

    cp ./walkthrough-classification/05-hello.py hello.py

</details>

Generate updated BAML client

    uv run baml-cli generate

Run it to verify

    uv run python hello.py

## Chapter 6 - BAML Tests

Finally, let's add some tests to our BAML functions.

Update pick_best_category.baml with tests

```diff
baml_src/pick_best_category.baml
 }
 
-test TestName {
+test SingleCategoryTest {
   functions [PickBestCategory]
   type_builder {
     dynamic enum Category {
-        Category1 @alias("k0") @description(#"
-            for placeholder text
+        SearchProducts @alias("k0") @description(#"
+            User is looking to search for products
         "#)
-        Category2 @alias("k1") @description(#"
-            for debug logs
+        BuyProduct @alias("k1") @description(#"
+            User is looking to buy a product
         "#)
-        Category3 @alias("k2") @description(#"
-            for error logs
+        ViewProductDetails @alias("k2") @description(#"
+            User wants to view detailed information about a product
         "#)
     }
   args {
     text #"
-      hello world
+      I want to buy a new phone
     "#
   }
+  @@assert(intent, {{this == "BuyProduct"}})
+}
+
+test MultipleCategoriesTest {
+  functions [PickBestCategories]
+  type_builder {
+    dynamic enum Category {
+        SearchProducts @alias("k0") @description(#"
+            User is looking to search for products
+        "#)
+        BuyProduct @alias("k1") @description(#"
+            User is looking to buy a product
+        "#)
+        ViewProductDetails @alias("k2") @description(#"
+            User wants to view detailed information about a product
+        "#)
+    }
+  }
+  args {
+    text #"
+      I want to research and buy a new phone
+    "#
+    count 2
+  }
+  @@assert(count, {{this.length == 2}})
+  @@assert(has_search, {{"SearchProducts" in this}})
+  @@assert(has_buy, {{"BuyProduct" in this}})
+}
+
+test AmbiguousInputTest {
+  functions [PickBestCategory]
+  type_builder {
+    dynamic enum Category {
+        SearchProducts @alias("k0") @description(#"
+            User is looking to search for products
+        "#)
+        BuyProduct @alias("k1") @description(#"
+            User is looking to buy a product
+        "#)
+        ViewProductDetails @alias("k2") @description(#"
+            User wants to view detailed information about a product
+        "#)
+    }
+  }
+  args {
+    text #"
+      tell me about phones
+    "#
+  }
+  @@assert(intent, {{this == "ViewProductDetails"}})
 }
```

<details>
<summary>skip this step</summary>

    cp ./walkthrough-classification/06-pick_best_category.baml baml_src/pick_best_category.baml

</details>

Run the tests

    uv run baml-cli test

You should see passing tests

