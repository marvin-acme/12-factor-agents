# Chapter 5 - LLM for Narrowing

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

