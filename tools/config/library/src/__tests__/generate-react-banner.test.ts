import { describe, expect, it } from "vitest";

import { generateReactBanner } from "../config";

// Adjust the import path

describe("generateReactBanner", () => {
  it("should return null if React is already imported", () => {
    const codeWithReactImport = `
      import * as React from 'react';
      const App = () => <div>Hello</div>;
    `;
    const result = generateReactBanner(codeWithReactImport);
    expect(result).toBeNull();
  });

  it("should return null if React is imported with named imports", () => {
    const codeWithReactNamedImport = `
      import React, { useState } from 'react';
      const App = () => <div>Hello</div>;
    `;
    const result = generateReactBanner(codeWithReactNamedImport);
    expect(result).toBeNull();
  });

  it("should return null if React is imported as a named import", () => {
    const codeWithReactAsNamedImport = `
      import { createElement as React } from 'react';
      const App = () => <React.Fragment>Hello</React.Fragment>;
    `;
    const result = generateReactBanner(codeWithReactAsNamedImport);
    expect(result).toBeNull();
  });

  it("should inject React import if React is used as a global", () => {
    const codeWithReactGlobal = `
      const App = () => <React.Fragment>Hello</React.Fragment>;
    `;
    const result = generateReactBanner(codeWithReactGlobal);
    expect(result).toEqual({
      code: 'import * as React from "react";\n' + codeWithReactGlobal,
      map: null,
    });
  });

  it("should ignore comments when checking for React imports", () => {
    const codeWithReactImportInComments = `
      // import * as React from 'react';
      /* const App = () => <div>Hello</div>; */
      const App = () => <React.Fragment>Hello</React.Fragment>;
    `;
    const result = generateReactBanner(codeWithReactImportInComments);
    expect(result).toEqual({
      code: 'import * as React from "react";\n' + codeWithReactImportInComments,
      map: null,
    });
  });

  it("should ignore comments when checking for React usage", () => {
    const codeWithReactUsageInComments = `
      // const App = () => <React.Fragment>Hello</React.Fragment>;
      const App = () => <div>Hello</div>;
    `;
    const result = generateReactBanner(codeWithReactUsageInComments);
    expect(result).toEqual(null);
  });

  it("should return null if React is not used", () => {
    const codeWithoutReact = `
      const App = () => <div>Hello</div>;
    `;
    const result = generateReactBanner(codeWithoutReact);
    expect(result).toBeNull();
  });
});
