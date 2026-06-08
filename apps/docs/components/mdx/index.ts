import { Accessibility } from "#src/components/mdx/accessibility";
import { Anatomy } from "#src/components/mdx/anatomy";
import { Callout } from "#src/components/mdx/callout";
import { Card, CardGrid, ContentCard } from "#src/components/mdx/card-grid";
import { ColorSwatch } from "#src/components/mdx/color-swatch";
import { DesignTokenList } from "#src/components/mdx/design-token-list";
import { Do, DoDont, Dont } from "#src/components/mdx/do-dont";
import { DocImage } from "#src/components/mdx/doc-image";
import { FileTree } from "#src/components/mdx/file-tree";
import { IconGrid } from "#src/components/mdx/icon-grid";
import { InstallTabs } from "#src/components/mdx/install-tabs";
import { PageTabs } from "#src/components/mdx/page-tabs";
import { PropsTable } from "#src/components/mdx/props-table";
import { ProseTable } from "#src/components/mdx/prose-table";
import { StatusBadge } from "#src/components/mdx/status-badge";
import { StorybookEmbed } from "#src/components/mdx/storybook-embed";
import { Tab, Tabs } from "#src/components/mdx/tabs";
import { TokenAlias } from "#src/components/mdx/token-alias";
import { TokenPalette } from "#src/components/mdx/token-palette";
import { TokenTable } from "#src/components/mdx/token-table";
import {
  BodyTypeScale,
  DisplayTypeScale,
  TitleTypeScale,
  TypeScale,
} from "#src/components/mdx/type-scale";

export const mdxComponents = {
  Accessibility,
  Anatomy,
  Callout,
  Card,
  CardGrid,
  ContentCard,
  ColorSwatch,
  DesignTokenList,
  DocImage,
  Do,
  DoDont,
  Dont,
  FileTree,
  IconGrid,
  InstallTabs,
  PageTabs,
  ProseTable,
  PropsTable,
  StatusBadge,
  StorybookEmbed,
  Tab,
  Tabs,
  table: ProseTable,
  TitleTypeScale,
  BodyTypeScale,
  DisplayTypeScale,
  TypeScale,
  TokenAlias,
  TokenPalette,
  TokenTable,
} as const;

export {
  Accessibility,
  Anatomy,
  Callout,
  Card,
  CardGrid,
  ContentCard,
  ColorSwatch,
  DesignTokenList,
  DocImage,
  Do,
  DoDont,
  Dont,
  FileTree,
  IconGrid,
  InstallTabs,
  PageTabs,
  ProseTable,
  PropsTable,
  StatusBadge,
  StorybookEmbed,
  Tab,
  Tabs,
  TitleTypeScale,
  BodyTypeScale,
  DisplayTypeScale,
  TypeScale,
  TokenAlias,
  TokenPalette,
  TokenTable,
};
