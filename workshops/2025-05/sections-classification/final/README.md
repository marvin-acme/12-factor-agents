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

Create a simple hello.py

    cp ./walkthrough-classification/00-hello.py hello.py

Install dependencies

    uv sync

Run it to verify

    uv run python hello.py

You should see:

    hello, world!


# Chapter 1 - BAML and Categories

Now let's set up BAML and define our category structure.

Initialize BAML

    uv run baml-cli init

Remove default resume.baml

    rm baml_src/resume.baml

Add our BAML client configuration

    cp ./walkthrough-classification/01-clients.baml baml_src/clients.baml

Configure BAML code generation for Python

    cp ./walkthrough-classification/01-generators.baml baml_src/generators.baml

Update hello.py with Category model and loader

    cp ./walkthrough-classification/01-hello.py hello.py

Generate BAML client code

    uv run baml-cli generate

Run it to verify

    uv run python hello.py

You should see a list of categories printed


# Chapter 2 - Embeddings and Semantic Search

Let's implement category embedding and semantic search to narrow down categories.

First, we'll need to set up OpenAI for embeddings.
Create a `.env` file with your OpenAI API key:

```
OPENAI_API_KEY=sk-...
```


Update hello.py with embedding and search functions

    cp ./walkthrough-classification/02-hello.py hello.py

Run it to verify

    uv run python hello.py

You should see the top 5 categories for 'I want to buy a new phone'


# Chapter 3 - LLM Category Selection

Now let's use BAML and an LLM to pick the best category from our narrowed-down list.

Add BAML function for category selection

    cp ./walkthrough-classification/03-pick_best_category.baml baml_src/pick_best_category.baml

Update hello.py to use the BAML function

    cp ./walkthrough-classification/03-hello.py hello.py

Generate updated BAML client

    uv run baml-cli generate

Run it to verify

    uv run python hello.py

You should see the final selected category


# Chapter 4 - Aliases and Prompts

Let's improve our BAML prompts with aliases and better descriptions.

Update pick_best_category.baml with better prompts

    cp ./walkthrough-classification/04-pick_best_category.baml baml_src/pick_best_category.baml

Update hello.py to use aliases

    cp ./walkthrough-classification/04-hello.py hello.py

Generate updated BAML client

    uv run baml-cli generate

Run it to verify

    uv run python hello.py


# Chapter 5 - LLM for Narrowing

Let's add an alternative way to narrow down categories using an LLM.

Update pick_best_category.baml with PickBestCategories

    cp ./walkthrough-classification/05-pick_best_category.baml baml_src/pick_best_category.baml

Update hello.py with LLM narrowing

    cp ./walkthrough-classification/05-hello.py hello.py

Generate updated BAML client

    uv run baml-cli generate

Run it to verify

    uv run python hello.py


# Chapter 6 - BAML Tests

Finally, let's add some tests to our BAML functions.

Update pick_best_category.baml with tests

    cp ./walkthrough-classification/06-pick_best_category.baml baml_src/pick_best_category.baml

Run the tests

    uv run baml-cli test

You should see passing tests

