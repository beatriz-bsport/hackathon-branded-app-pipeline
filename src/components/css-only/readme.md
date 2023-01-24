# CSS only component

## Rules

This library must contain components respecting the following rules:

### 1 - Styles

#### 1.a - CSS

- :x: No material-ui or any other css frameworks.
- :heavy_check_mark: Custom css (.css or .saas)

### 2 - Naming & Logic

#### 2.a - Files and folders naming

- Files or folders naming should ***NOT*** be inherent to "bsport business objects".
- Files or folders naming should ***NOT*** contain things such as "CssOnly", "Marketplace" since it would be unrelevant (components must be usable anywhere) and redundant (components already in ./src/components/css-only)

##### In Practice

:x: DO NOT

```ts
[FILE_NAME] : MarketPlaceCssOnlyPaymentPackListItem.component.tsx
```

:heavy_check_mark: DO

```ts
[FILE_NAME] : ListItem.component.tsx
```

#### 2.b - Components props

- At no point components naming or props should be inherent to "bsport business objects".

##### In Practice

:x: DO NOT

```ts

type PaymentPackListItemComponentProps = {
    paymentPackPrimary : string;
    paymentPackSecondary?: string;
}

```

:heavy_check_mark: DO

```ts
type Props = {
    primary: string;
    seoncdary?: string;
}
```

#### 3 - Usage

##### 3.a - Import

Importing must be done using the alias ```#csscomponents```

