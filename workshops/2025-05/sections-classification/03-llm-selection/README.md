# Chapter 3 - LLM Category Selection

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

