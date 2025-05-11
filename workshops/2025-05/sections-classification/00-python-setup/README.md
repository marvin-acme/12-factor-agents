# Chapter 0 - Python Setup

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

