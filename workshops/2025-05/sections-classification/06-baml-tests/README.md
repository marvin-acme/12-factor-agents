# Chapter 6 - BAML Tests

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

