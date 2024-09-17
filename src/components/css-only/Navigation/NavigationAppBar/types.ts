import type { Props as ButtonProps } from '#Fabrique/ButtonV2';
import type { Props as TabProps } from '#Fabrique/Tab';

export type AppBarButton = Pick<
  ButtonProps,
  'color' | 'leftIcon' | 'rightIcon' | 'variant' | 'onClick' | 'badgeValue'
> & {
  isIconButton?: boolean;
  label: string;
};

export type AppBarTab = Pick<
  TabProps,
  'onClick' | 'isSelected' | 'color' | 'hasSelect'
> & {
  label: string;
};

export type NavigationAppBarProps = {
  /**
   * If true, the following will apply for the app bar:
   * - The list of links will be hidden
   * - A menu button will be shown for navigation
   * - Action buttons will be set to icon buttons
   */
  isMobile?: boolean;
  /** The logo picture of the company */
  logo?: string;
  /** The website URL of the company */
  websiteUrl?: string;
  /** The list of all marketplace links configured from the BO */
  links?: AppBarTab[];
  /** The list of extra actions shown on the right side */
  actions?: AppBarButton[];
  /** When logged in from a relationship, this is set to the member full name */
  relationshipAuthMemberName?: string;
  /** When logged in from a relationship, this action redirect to the origin account */
  navigateBackToMasterRelation?: () => void;
  /** Action fired once the menu button is pressed from the logo section */
  onSideDrawerOpenClick?: () => void;
  /**
   * If true, we should display the "go back" button on the logo section.
   */
  showGoBackButton?: boolean;
  /** Action fired once the go back button is pressed. */
  goBackNavigation?: () => void;
};
