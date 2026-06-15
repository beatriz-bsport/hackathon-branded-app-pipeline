# File names should be kebab-case

Validity status: ✅ Valid
Adoption status: ⚠️ Partially respected
Importance: 3
Level: 🟠 Warning
Scope: Naming
Checks enforced: 🤖 AI rules
Approved: Sofian Medbouhi
Last edited time: 20 avril 2026 18:10
Last edited by: Sofian Medbouhi
Created time: 20 avril 2026 18:05
Author: Sofian Medbouhi
Repository: ichizen

> **Rule:** _The file containing code should all use kebab-case_

# How

We should use kebab-case for two types of files : tsx and css
Special case to ignore : App.tsx are still authorized. AI Guidelines MD files can use SCREAMING_SNAKE_CASE.

<aside>
❌

Bad

```typescript
src / MySuperComponent.tsx;
src / MySuperForm.component.tsx;
src / MySuperForm.component.css;
```

These are wrong naming

</aside>

<aside>
✅

Good

```typescript
src/my-super-component.tsx
src/my-super-form.tsx
src/my-super-form.css
```

</aside>

# Why

We need conventions and consistency, and this is quite common.
It is also great as everything is lowercase so same behavior between unix and windows.

# Links

One interesting article https://medium.com/@sadeqshahmoradi76/pascalcase-or-kebab-case-best-or-bad-practice-in-file-naming-7382635d517e
