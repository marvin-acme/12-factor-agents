# How to Create New Walkthroughs using `walkthroughgen`

Audio transcript or video recording of you live coding + final source folder --> beautiful step-by-step walkthrough for workshops and documentation.

This guide explains how to create step-by-step tutorials using `walkthroughgen`, a tool that generates consistent, runnable walkthroughs from a YAML definition and incremental code files.

## Prerequisites

- `walkthroughgen` CLI installed (or use `npx walkthroughgen`)
- A "final" version of the project/code you want to create a walkthrough for
- A general idea of the steps to build the final project - you can request this from the user, generally you can use "ask gemini" on a youtube video of the live coding to get the core steps as bullet points

## Core Concepts

### `walkthrough.yaml`

The main definition file that describes your walkthrough. It contains:

- `title`, `text`: Overall walkthrough description
- `targets`: Defines outputs
  - `markdown`: Generates the main `walkthrough.md` file
    ```yaml
    targets:
      - markdown: "./build/walkthrough.md"
        onChange:
          diff: true  # Show diffs for changed files
          cp: true    # Show copy commands
        newFiles:
          cat: false  # Don't show file contents inline
          cp: true    # Show copy commands for new files
    ```
  - `folders`: Creates a directory for each section
    ```yaml
    targets:
      - folders:
          path: "./build/sections"
          skip:
            - "cleanup"  # Skip creating folders for these sections
          final:
            dirName: "final"  # Create a folder with final state
    ```
- `sections`: Divides the walkthrough into logical chapters
  ```yaml
  sections:
    - name: hello-world     # Used for folder names
      title: "Hello World"  # Display title
      text: "Let's start with a basic setup."
      steps:
        - text: "Create package.json"
          file: {src: ./walkthrough/00-package.json, dest: package.json}
        - text: "Install dependencies"
          command: "npm install"
          incremental: true  # Actually run this when generating folders
        - text: "Run it"
          command: "npm start"
          results:
            - text: "You should see:"
              code: |
                Hello, world!
  ```

### Incremental Code Files

Your walkthrough needs a folder (e.g., `walkthrough/` or `walkthrough-classification/`) containing all versions of files as they evolve through the tutorial:

```
walkthrough/
  00-package.json      # Initial package.json
  00-index.ts         # Initial index.ts
  01-index.ts         # index.ts after first change
  02-index.ts         # index.ts after second change
  ...
```

These files are referenced by `file.src` in your `walkthrough.yaml`.

## Process for Creating a New Walkthrough

### Step 1: Define the Scope and "Final State"

1. Have the complete, working code for the final step of your tutorial
2. This is your reference point for breaking down the steps
3. Example: A complete Python/BAML classification project in `classification-final/`

### Step 2: Outline the Chapters/Sections

Break down the process into logical, incremental chapters. For example:

```yaml
sections:
  - name: python-setup
    title: "Chapter 0 - Python Setup"
    text: "Let's start with a basic Python setup and dependencies."

  - name: baml-and-categories
    title: "Chapter 1 - BAML and Categories"
    text: "Now let's set up BAML and define our category structure."

  - name: embeddings-and-search
    title: "Chapter 2 - Embeddings and Semantic Search"
    text: "Let's implement category embedding and semantic search."
```

### Step 3: Create Incremental Code Snippets

1. For each chapter/step, create the specific version of files needed
2. Place in a dedicated folder (e.g., `walkthrough-myfeature/`)
3. Name files sequentially:
   ```
   walkthrough-classification/
     00-pyproject.toml     # Initial Python setup
     00-hello.py          # Initial hello world
     01-hello.py          # After adding Category model
     01-clients.baml      # Initial BAML setup
     02-hello.py          # After adding embeddings
     ...
   ```

### Step 4: Write the `walkthrough.yaml`

1. Start with basic metadata:
   ```yaml
   title: "Building a Large-Scale Text Classifier"
   text: |
     Learn how to build a text classifier that can handle
     hundreds or thousands of categories.
   ```

2. Define targets:
   ```yaml
   targets:
     - markdown: "./build/walkthrough.md"
       onChange:
         diff: true
         cp: true
     - folders:
         path: "./build/sections"
         skip: ["cleanup"]
         final:
           dirName: "final"
   ```

3. Add sections and steps:
   ```yaml
   sections:
     - name: python-setup
       title: "Chapter 0 - Python Setup"
       text: "Let's start with a basic Python setup."
       steps:
         - text: "Create pyproject.toml"
           file: {src: ./walkthrough-classification/00-pyproject.toml, dest: pyproject.toml}
         - text: "Install dependencies"
           command: "uv sync"
           incremental: true
         - text: "Run it to verify"
           command: "uv run python hello.py"
           results:
             - text: "You should see:"
               code: |
                 hello, world!
   ```

### Step 5: Iteration and Generation

1. Run `walkthroughgen generate your-walkthrough.yaml`
2. Review the generated `walkthrough.md`
3. Review the generated section folders
4. Adjust YAML and code snippets as needed

## Tips and Best Practices

### Start Simple
- Get a basic "hello world" or initial setup working first
- Build up complexity gradually

### Small, Incremental Steps
- Make each step focused on one change or concept
- Keep changes small and easy to understand

### Verify Commands
- Test all commands in the YAML
- Ensure they work in the context of the walkthrough
- Use `incremental: true` for commands that should affect section folders

### Consistent Naming
- Use clear, descriptive names for sections
- Use a consistent naming scheme for source files
- Consider using numbered prefixes (00-, 01-, etc.) for order

### Relative Paths
- `file.src` is relative to your snippets folder
- `file.dest` is relative to the target project root
- Be consistent with path separators

### Leverage Diffs
- Use `onChange: diff: true` to show file changes
- Helps users understand exactly what changed
- Reduces need for extensive explanations

### Test Section Folders
- Check that each section's state is correct
- Verify code is runnable at each step
- Test final state matches your reference implementation


### working with baml

- there should be plentiful examples on baml usage, but know that:
- npx baml-cli init (or uv run baml-cli init) create a default baml_src/ folder
- you probably want to `rm resume.baml` the default file, and leave generators.baml and clients.baml untouched.

## Example Structure

Here's a simplified example from a classification walkthrough:

```yaml
title: "Building a Large-Scale Text Classifier"
text: |
  Learn how to build a text classifier that can handle hundreds
  or thousands of categories using Python and BAML.

targets:
  - markdown: "./build/walkthrough.md"
    onChange:
      diff: true
      cp: true
  - folders:
      path: "./build/sections"
      skip: ["cleanup"]
      final:
        dirName: "final"

sections:
  - name: cleanup
    title: "Cleanup"
    text: "Make sure you're starting from a clean slate"
    steps:
      - text: "Clean up existing files"
        command: |
          rm -rf baml_src/ && rm -rf hello.py

  - name: python-setup
    title: "Chapter 0 - Python Setup"
    text: "Let's start with a basic Python setup."
    steps:
      - text: "Create pyproject.toml"
        file: {src: ./walkthrough-classification/00-pyproject.toml, dest: pyproject.toml}
      - text: "Create a simple hello.py"
        file: {src: ./walkthrough-classification/00-hello.py, dest: hello.py}
      - text: "Install dependencies"
        command: |
          uv sync
      - text: "Run it to verify"
        command: |
          uv run python hello.py
        results:
          - text: "You should see:"
            code: |
              hello, world!

  - name: baml-and-categories
    title: "Chapter 1 - BAML and Categories"
    text: "Now let's set up BAML and define our category structure."
    steps:
      - text: "Initialize BAML"
        command: |
          uv run baml-cli init
      - text: "Remove default resume.baml"
        command: |
          rm baml_src/resume.baml
      - text: "Add our BAML client configuration"
        file: {src: ./walkthrough-classification/01-clients.baml, dest: baml_src/clients.baml}
      # ... more steps ...
```

This example shows:
- Clear section organization
- Mix of file operations and commands
- Use of `incremental: true` for state-changing commands
- Verification steps with expected output
- Progressive introduction of concepts

Remember to test your walkthrough thoroughly, ensuring each step builds correctly on the previous ones and leads to your intended final state.


### prompt example


your goal is to build a great walkthrough for a classification hands-on coding workshop with python and baml

This involves writing:

walkthrough-classification.yaml - a yaml file describing the walkthrough

walkthrough-classification/{files} - a folder containing the incremental reference implementations for the walkthrough. These are referenced in walkthrough-classification.yaml


relevant files:

bullet-points.md contains some summary notes from a youtube video of a live coding session

classification-final/ contains the final implementation of the classification project

final/ contains sources for another example walkthrough

walkthrough-ts-12fa.yaml is an example walkthrough for the sources in final/

walkthrough.md and sections/ contains the output walkthrough created by running

    npx walkthroughgen walkthrough-ts-12fa.yaml