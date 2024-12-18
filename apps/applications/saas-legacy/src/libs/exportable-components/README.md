# Basic concepts

ExportComponent defines a common interface to define components for both Widget and web Marketplace. This allows a few cool things :

* When generating a Widget config, you automatically have a Marketplace config
* The reverse holds true
* Avoid duplicating uninteresting code

However the exportable component libs is only for generating configuration, it does know how to render anything.

# Define a new ExportableComponent

First thing you need to describe an identifier and label, maybe a default configuration

```sh
libs/exportable-components/constants.ts
```

If your component allows a few settings configuration (e.g: ability to filter on category objects, that you can select in backoffice) you need to define the settings form

```sh
libs/exportable-component/settings/index.ts
```

# Export your component to Widget and/or Marketplace

Your component may or may not be available on marketplace and widget. This two libs works similarly but with a few differences.

## Widget

Add your identifier inside 

```sh
libs/widget/constants.ts
```

Now it will automatically appear in the widget generator form.

If the configuration of the component needs additional props (e.g: coachList to create filters) dont forget to pass it via 

```sh
libs/widget/components/WidgetComponentConfigBuilder.component.tsx
```

Now you only needs to explain how to render it, define that behaviour inside the widget repo
```sh
bsport-widget: src/App.tsx: WidgetByType
```

## Markeptlace

  
Add your identifier inside 

```sh
libs/marketplace/constants.ts
```

Explain how to access it via URL

```sh
libs/marketplace/routing-utils.ts: fromConfigToUrl # /!\ ugly function
```

If the configuration of the component needs additional props (e.g: coachList to create filters) dont forget to pass it via 

```sh
libs/marketplace/components/builder/MarketplaceTabBuilder.component.tsx
```

Now you only needs to explain how to render it, define that behaviour in

```sh
pages/marketplace/Marketplace.page.tsx
```

## Synergies between the two configs

If your constant is in both Widget and Marketplace you will automatically have generated widget-code/marketplace-url in both Widget and Marketplace settings pages.

# Adapt some settings of an exportable component

The settings form can be found in 

```sh
libs/exportable-components/components/settings/
```

If you add new mandatory props, dont forget pass them through the top page then to these two components (one or two depending on the availability on widget and/or marketplace):

```sh
libs/widget/components/WidgetComponentConfigBuilder.component.tsx
bsport-widget: src/widgets/YourWidget.widget.tsx

libs/marketplace/components/builder/MarketplaceTabBuilder.component.tsx
pages/marketplace/YourMarketplacePage.tsx
```
