enum Category {
    @@dynamic
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

test TestName {
  functions [PickBestCategory]
  type_builder {
    dynamic enum Category {
        Category1 @alias("k0") @description(#"
            for placeholder text
        "#)
        Category2 @alias("k1") @description(#"
            for debug logs
        "#)
        Category3 @alias("k2") @description(#"
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