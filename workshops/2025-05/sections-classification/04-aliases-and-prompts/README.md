# Chapter 4 - Aliases and Prompts

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

