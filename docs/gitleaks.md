# Gitleaks Pre-Commit Hook & CI Integration

This repository is configured with a **Gitleaks** pre-commit hook and a CI job to help prevent committing secrets or sensitive information.

---

## Pre-Commit Hook Setup

You need to install the `gitleaks` CLI. Instructions can be found on the [Gitleaks Github page](https://github.com/gitleaks/gitleaks?tab=readme-ov-file#getting-started).

- **For Mac users**

  You can install it using Homebrew:

  ```bash
  brew install gitleaks
  ```

- **For Linux users**

  You can either build it from source or download the binary from the [releases page](https://github.com/gitleaks/gitleaks/releases).

After installation, Gitleaks will automatically run on changed files whenever you try to commit.

---

## CI Integration

Please refer to the [CI/CD Catalog Gitleaks Documentation](https://gitlab.com/bsport/bsport-platform-ci-templates/-/blob/main/docs/gitleaks.md) for details on how the Gitleaks job is integrated into the CI pipeline & remediation steps in case of detections.
