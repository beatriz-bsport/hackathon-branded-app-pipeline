# Project templates

This folder contains all the templates used by the command `pnpm run -w project:create` allowing Software Engineers to create efficiently new projects on the monorepository.

## Templates list

Currently, 3 templates are available :

- `sm-application` : An application dedicated to the Studio Manager backoffice, relying on our Kaizen Design System.
- `store-package` : A package to connect frontend and backend (API), and manage state with Zustand.
- `typescript-package` : Any other kind of package to be used in applications or even other packages (hooks, utilities, helpers, common logic, ...).

## How to create a new template

Basically, a template is a folder containing at least a `package.json`.

To name your template, please follow the pattern : `@bsport/template-{YOUR-NAME}`.

Remember that your template must be minimalistic : do not add any unecessary dependency, script or file.
