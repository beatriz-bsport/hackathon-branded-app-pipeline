# Using GitHub Copilot Instructions and `.airules`

This `README.md` explains how to use the GitHub Copilot instruction system. It is intended for users working with VS Code, and describes how to leverage the global and task-specific rules defined in this workspace.

---

## 📁 Folder Structure

### `.github/copilot-instructions.md`

This file contains **general Copilot instructions** that are automatically applied to all Copilot conversations in VS Code.

---

### `.airules/`

This folder contains **task-specific rule files** organized in subfolders. These `.md` files define focused instructions and can be manually added to the Copilot chat when needed for specific tasks.

# 🛠 How to Add a Rule File to a Copilot Chat

These files are **not loaded by default** — they must be explicitly added to a Copilot conversation as context.

---

## 🧩 Manually Apply a Rule File in VS Code

To manually apply a rule file to a Copilot conversation in **VS Code**:

1. Open the **GitHub Copilot Chat** panel.
2. Click **“Add context”** (or use the associated keyboard shortcut).
3. Navigate to the `.airules/` folder.
4. Select the relevant `.md` file (e.g., `fabrique/codegen.md`) based on the task you're performing.

Once selected, Copilot will incorporate the rules from that file into its responses for the current chat session.

---

## ✏️ Contributing New Rules

This is just an initial draft of the instruction system. You are encouraged to:

- Add new `.md` files in `.airules/` for tasks, domains, or team practices.
- Update or refine existing rule files for better clarity or effectiveness.
- Suggest improvements to the global rules in `.github/copilot-instruction.md`.

> The better we define our rules, the more useful and accurate Copilot becomes. Feel free to adapt this system to your workflow.
