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

This repository includes a CI job that runs Gitleaks on every pull request. This ensures secrets cannot slip through even if the pre-commit hook was bypassed.

If the CI job fails due to Gitleaks findings:

- Review the flagged content.
- Apply the same remediation steps as [below](#dealing-with-gitleaks-detections).
- Update your MR accordingly.

---

## Dealing with Gitleaks Detections

When Gitleaks flags a potential secret:

1. **Stop and Review** the flagged string.

   - Is it truly a secret (API key, password, etc.)?
   - Or is it a false positive (e.g., test data, dummy string)?

2. **If it is a real secret:**

   - **Do not commit it.**
   - Remove it from your code.
   - If it has already been pushed, rotate the secret.
   - Consider using environment variables or a secrets manager (Vault).

3. **If it is a false positive:**

   - Add a `gitleaks:allow` comment to the line containig the secre to tell gitleaks to ignore that secret.
