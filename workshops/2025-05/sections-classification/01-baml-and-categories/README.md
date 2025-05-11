# Chapter 1 - BAML and Categories

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

