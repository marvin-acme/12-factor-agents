enum Category {
    @@dynamic
}

function PickBestCategories(text: string, count: int) -> Category[] {
    client "openai/gpt-4o-mini"
    prompt #"
        {{ _.role("system") }}
        You are a helpful assistant that categorizes user requests.
        You should pick the {{ count }} most appropriate categories based on the user's intent.

        {{ _.role("user") }}
        Which {{ count }} categories best describe this text?

        {{ ctx.output_format }}

        Text to categorize:
        {{ text }}
    "#
}

function PickBestCategory(text: string) -> Category {
    client "openai/gpt-4o-mini"
    prompt #"
        {{ _.role("system") }}
        You are a helpful assistant that categorizes user requests.
        You should pick the most appropriate category based on the user's intent.

        {{ _.role("user") }}
        Which category best describes this text?

        {{ ctx.output_format }}

        Text to categorize:
        {{ text }}
    "#
}

test SingleCategoryTest {
  functions [PickBestCategory]
  type_builder {
    dynamic enum Category {
        SearchProducts @alias("k0") @description(#"
            User is looking to search for products
        "#)
        BuyProduct @alias("k1") @description(#"
            User is looking to buy a product
        "#)
        ViewProductDetails @alias("k2") @description(#"
            User wants to view detailed information about a product
        "#)
    }
  }
  args {
    text #"
      I want to buy a new phone
    "#
  }
  @@assert(intent, {{this == "BuyProduct"}})
}

test MultipleCategoriesTest {
  functions [PickBestCategories]
  type_builder {
    dynamic enum Category {
        SearchProducts @alias("k0") @description(#"
            User is looking to search for products
        "#)
        BuyProduct @alias("k1") @description(#"
            User is looking to buy a product
        "#)
        ViewProductDetails @alias("k2") @description(#"
            User wants to view detailed information about a product
        "#)
    }
  }
  args {
    text #"
      I want to research and buy a new phone
    "#
    count 2
  }
  @@assert(count, {{this.length == 2}})
  @@assert(has_search, {{"SearchProducts" in this}})
  @@assert(has_buy, {{"BuyProduct" in this}})
}

test AmbiguousInputTest {
  functions [PickBestCategory]
  type_builder {
    dynamic enum Category {
        SearchProducts @alias("k0") @description(#"
            User is looking to search for products
        "#)
        BuyProduct @alias("k1") @description(#"
            User is looking to buy a product
        "#)
        ViewProductDetails @alias("k2") @description(#"
            User wants to view detailed information about a product
        "#)
    }
  }
  args {
    text #"
      tell me about phones
    "#
  }
  @@assert(intent, {{this == "ViewProductDetails"}})
}