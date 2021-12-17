INSTALLATION
============

Running with a local backend server
-----------------------------------
Follow instructions https://gitlab.com/bsport/bsport-django

```sh
cp ./envs/dev ./env.js
```

This will prepare the db and create test accounts

Running with the distant (staging) backend server
-------------------------------------------------

```sh
cp ./envs/local ./env.js
```

GENERATE TRANSLATIONS
=====================
```sh
yarn updateTranslation
```

LOGIN
=====

You can use the following user

```sh
username: contact@classdiggers.com
password: demo
```

RUN
===

Now you can run
```sh
yarn       // install all deps
yarn start // start the dev server
```

CREATE NEW ALLIAS
=================

To create a new allias you need to add them at multiple places

### .babelrc
```
  "alias": {
    ...
    "#newAlias": "PATH TO NEW ALIAS FROM THE BABELRC FILE",
  }
```

### .eslintrc
```
  "alias": {
    ...
    "#newAlias": "PATH TO NEW ALIAS FROM THE ESLINTRC FILE",
  }
```

### .tsconfig.json
```
  "paths": {
    ...
    "#newAlias/*": ["PATH TO NEW ALIAS FROM THE TSCONFIG FILE"/*],
  }
```

### config/webpack.config.dev.js and config/webpack.config.js
```
  "paths": {
    ...
    '#components': path.resolve(__dirname, ["PATH TO NEW ALIAS FROM THE WEBPACK FILE"/),
  }
```

the alias need to respect some convention use a # as a prefix to make it clear it's not a path and can't have a / inside to avoid resolving problems

> :warning: **Don t break the widget**: Until better bundling for the widget we also need to add the alias configuration in the widget's webpack otherwise it will break the build


### Tests

The tests are if not the most important tool for continous integration and continous developoment it give the security that the software is behaving properly at any time and new development doesn't create regression or unwanted behavior. That's why the test are run by the ci on each merge request and new one should be added in all merge request

> “More than the act of testing, the act of designing tests is one of the best bug preventers known. The thinking that must be done to create a useful test can discover and eliminate bugs before they are coded – indeed, test-design thinking can discover and eliminate bugs at every stage in the creation of software, from conception to specification, to design, coding and the rest.” – Boris Beizer


#### There is 4 existing type of test: 

#### - Unit testing:

**definition**:  type of software testing where individual units or components of a software are tested. To put it shortly we are testing if the functions are behaving consistently in sucess and fail cases for a suite of params

example: ```util.test.ts```
```ts 
import {
  myFirstFunction,
  mySecondFunction,
} from '../utils';

// "Describe" is the function to tell that it represent a suite of test
describe('Utils: MyFirstFunction', () => {
  // "it" describe a single test 
  it('Check if the function send true on empty', () => {
    const result = myFirstFunction()

    expect(result).toBe(true);
  })

  // another test in the suite
  it('Check if the function send false on string param', () => {
    const result = myFirstFunction("toto")

    expect(result).toBe(false);
  })
});

// A file
describe('Utils: MySecondFunction', () => {
  // "it" describe a single test
  it('Check if the function send array on empty', () => {
    const results = myFirstFunction()

    // We have multiple test available
    // to see the complete list: https://jestjs.io/fr/docs/expect
    expect(results).toBeGreaterThan(1);

    // We can have multiple check on one test
    // if one failed test will failed
    expect(results[0]).toBe(42);
});
```

#### - Rendering test:

**definition**: type of software testing where we compare the visual output of the software view

We are not currently using it but a draft to implement it with storybook is present in the file ```initStore.test.ts``` and need some tweaking to function properly
#### - Integration testing

**definition**: type of software testing where individual software modules are combined and tested as a group. Integration testing is conducted to evaluate the compliance of a system or component with specified functional requirements. To put it shortly when we are testing that the interaction from semi-complex component are interacting well between them

example: ```FuzzySearch.test.tsx```

```ts
// Here mandatory for jsx element we tell jest to require a dom
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { fireEvent, render, act } from '@testing-library/react';

import FuzzySearch from '../search/FuzzySearch.component';

// Fuze search is base on delay text field we mock it to use it in a syncrhonous way
jest.mock('../DelayedTextField.component.tsx');

const items = [
  { label: 'First', id: 1 },
  { label: 'Second', id: 2 },
  { label: 'Third', id: 3 },
];

describe('FuzeSearch: <FuzeSearch />', () => {
  let component: any;
  // We mock the function with jest.fn as it will be usefull later to have test on it
  const itemRenderer = jest.fn(
    ({ label, id }: { label: any; id: number }, search: string) => (
      <div data-testid="row-fuze" key={id}>{`${label} / ${search}`}</div>
    ),
  );

  // This function will be called before each test
  beforeEach(() => {
    // The act function let us ensure that the componet have been rerendercontinuing
    act(() => {
      component = render(
        <FuzzySearch
          placeholder="Search"
          items={items}
          searchFields={['label']}
          itemRenderer={itemRenderer}
        />,
      );
    });
  });

  it('on input change the value', () => {
    // We get the dom element by a testing id set by the property data-testid added in the jsx
    const input = component.getByTestId('input-fuze-search');
    // Create a Dom event here typing in the field
    fireEvent.change(input, { target: { value: 'First' } });

    expect(input.value).toBe('First');
  });

  it('check if the item renderer is not call to many time', () => {
    const input = component.getByTestId('input-fuze-search');

    act(() => {
      fireEvent.change(input, { target: { value: 's' } });
    });

    // Here we take the mocked jest function and verify we are not overcalling it
    expect(itemRenderer).toHaveBeenCalledTimes(2);
  });

  it('on input display a similar results', () => {
    const input = component.getByTestId('input-fuze-search');

    act(() => {
      fireEvent.change(input, { target: { value: 'First' } });
    });

    const results = component.getAllByTestId('row-fuze');

    expect(results.length).toBe(1);
  });
});

```

#### - End to end testing

**definition**: End-to-end testing is a technique that tests the entire software product from beginning to end to ensure the application flow behaves as expected. To put it shortly we test if the all website is behaving like expected for a flow

Currently we are not implementing end to end testing for the moment