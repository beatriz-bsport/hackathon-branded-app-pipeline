import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Coach } from '#src/libs/associated-coach/types';
import {
  getAddressOptionsFromEstablishmentList,
  getEstablishmentOptionsFromSelectedSites,
  getOptionsFromIds,
} from '../utils';

import type { SelectFieldItem } from '../types';
import type { Props as AdvancedSettingsProps } from '../components/AdvancedRoleSettingsModal.component';
import type { EstablishmentBillingGroup } from '#src/libs/establishment/types';

/**
 * `useAdvancedRoleSettings` is a custom hook that manages the advanced role settings.
 *
 * **IMPORTANT**: In this hook, 'Site' terminology is used to refer to 'Establishment Group' when the multi-location upsell feature is enabled,
 * and 'Address' when the feature is not enabled.
 *
 * @function
 * @param {Object} params - The parameters for the hook.
 * @param {UserRole<number, FranchiseRole>} params.user - The user role to update.
 * @param {Array<Coach>} params.coachList - The list of available coaches.
 * @param {function} params.updateUserRole - The function to update the user role.
 * @param {function} params.onConfirm - The callback function to call when the settings are confirmed.
 * @returns {Object} The return values.
 * @returns {Array<SelectFieldItem>} return.coachOptions - The options for the coach select field.
 * @returns {function} return.handleSelectCoaches - The function to handle the selection of coaches.
 * @returns {Array<SelectFieldItem>} return.selectedCoaches - The selected coaches.
 * @returns {function} return.handleSubmit - The function to handle the submission of the form.
 *
 * This hook manages the state and handlers for the advanced role settings. It uses the `useMemo` and `useCallback` hooks to optimize performance.
 */
export const useAdvancedRoleSettings = ({
  coachList,
  establishmentGroupList,
  establishmentList,
  hasMultiLocationUpsell,
  onConfirm,
  updateUserRole,
  userRole,
  establishmentBillingGroups,
}: Pick<
  AdvancedSettingsProps,
  | 'coachList'
  | 'establishmentGroupList'
  | 'establishmentList'
  | 'hasMultiLocationUpsell'
  | 'onConfirm'
  | 'updateUserRole'
  | 'userRole'
  | 'establishmentBillingGroups'
>) => {
  /**
   * TEACHERS
   */

  const selectedCoachesInitial = useMemo(() => {
    return userRole?.coaches_selected_in_role && coachList
      ? getOptionsFromIds(
          userRole.coaches_selected_in_role || [],
          coachList || [],
        )
      : [];
  }, [userRole, coachList]);

  const coachOptions = useMemo(
    () =>
      coachList
        ? [...coachList]?.map((object: Coach) => ({
            value: object.id,
            label: object.name,
          }))
        : [],
    [coachList],
  );

  const [selectedCoaches, setSelectedCoaches] = useState<SelectFieldItem[]>([]);

  useEffect(() => {
    setSelectedCoaches(selectedCoachesInitial);
  }, [selectedCoachesInitial]);

  const handleSelectCoaches = useCallback(
    (values: SelectFieldItem[]) => {
      setSelectedCoaches(values);
    },
    [setSelectedCoaches],
  );

  /**
   * ACCESS MONITORING
   */

  const selectedEstablishmentsInitial = useMemo(() => {
    return userRole?.establishments_selected_in_role && establishmentList
      ? getOptionsFromIds(
          userRole.establishments_selected_in_role || [],
          establishmentList || [],
        )
      : [];
  }, [userRole, establishmentList]);

  const [selectedEstablishments, setSelectedEstablishment] = useState<
    SelectFieldItem[]
  >(selectedEstablishmentsInitial);

  useEffect(() => {
    setSelectedEstablishment(selectedEstablishmentsInitial);
  }, [selectedEstablishmentsInitial]);

  const handleSelectEstablishments = useCallback(
    (values: SelectFieldItem[]) => {
      setSelectedEstablishment(values);
    },
    [setSelectedEstablishment],
  );

  const siteOptions = useMemo(() => {
    if (hasMultiLocationUpsell) {
      return establishmentGroupList
        ? [...establishmentGroupList].map((group) => ({
            label: group.name,
            value: group.id,
          }))
        : null;
    }
    return getAddressOptionsFromEstablishmentList(establishmentList);
  }, [establishmentGroupList, establishmentList, hasMultiLocationUpsell]);

  const selectedSiteInitial = useMemo(() => {
    if (hasMultiLocationUpsell) {
      // Return the establihment group that have an establishment in the selectedEstablishmentsInitial
      const initialEstablishmentGroup = establishmentGroupList?.find(
        (establishmentGroup) =>
          establishmentGroup.establishment.some((establishmentId) =>
            selectedEstablishmentsInitial.some(
              (selectedEstablishment) =>
                establishmentId === selectedEstablishment.value,
            ),
          ),
      );
      return initialEstablishmentGroup
        ? {
            label: initialEstablishmentGroup.name,
            value: initialEstablishmentGroup.id,
          }
        : null;
    }
    // Return the common address of the establishments in selectedEstablishmentsInitial
    return siteOptions.find((address) =>
      selectedEstablishmentsInitial.some(
        (selectedEstablishment) =>
          address.label ===
          establishmentList?.find(
            (establishment) => establishment.id === selectedEstablishment.value,
          )?.location?.address,
      ),
    );
  }, [
    establishmentGroupList,
    establishmentList,
    hasMultiLocationUpsell,
    selectedEstablishmentsInitial,
    siteOptions,
  ]);

  const [selectedSite, setSelectedSite] =
    useState<SelectFieldItem>(selectedSiteInitial);

  useEffect(() => {
    setSelectedSite(selectedSiteInitial);
    // Volontary exhaustive deps to force the update of selectedSite when the user changes
  }, [selectedSiteInitial, userRole]);

  const [establishmentOptions, setEstablishmentOptions] = useState<
    SelectFieldItem[]
  >(
    //  Always restrict the establishment options based on the selected site
    getEstablishmentOptionsFromSelectedSites({
      establishmentGroupList,
      establishmentList,
      hasMultiLocationUpsell,
      selectedSite,
    }),
  );

  useEffect(
    () =>
      setEstablishmentOptions(
        getEstablishmentOptionsFromSelectedSites({
          establishmentGroupList,
          establishmentList,
          hasMultiLocationUpsell,
          selectedSite,
        }),
      ),
    [
      establishmentGroupList,
      establishmentList,
      hasMultiLocationUpsell,
      selectedSite,
    ],
  );

  const handleSelectSite = useCallback(
    (value: SelectFieldItem) => {
      if (!value?.value) {
        setSelectedEstablishment([]);
      } else if (hasMultiLocationUpsell) {
        const establishmentGroup = establishmentGroupList?.find(
          (group) => group.id === value.value,
        );
        setSelectedEstablishment(
          establishmentGroup.establishment.map((establishmentId) => ({
            value: establishmentId,
            label: establishmentList?.find(
              (establishment) => establishment.id === establishmentId,
            )?.title,
          })),
        );
      } else {
        setSelectedEstablishment(
          establishmentList
            .filter(
              (establishment) =>
                !!establishment.location.address &&
                establishment.location.address === value?.label,
            )
            .map((establishment) => ({
              value: establishment.id,
              label: establishment.title,
            })),
        );
      }
      setSelectedSite(value);
    },
    [
      establishmentGroupList,
      establishmentList,
      hasMultiLocationUpsell,
      setSelectedEstablishment,
      setSelectedSite,
    ],
  );

  // Special case: If the user has no selected establishments and there is only one site, select it by default
  // Indeed,  the site selector is hidden in this case
  useEffect(() => {
    if (
      !hasMultiLocationUpsell &&
      selectedEstablishmentsInitial.length === 0 &&
      siteOptions.length === 1
    ) {
      handleSelectSite(siteOptions[0]);
    }
  }, [
    hasMultiLocationUpsell,
    handleSelectSite,
    selectedEstablishmentsInitial,
    siteOptions,
  ]);

  const handleResetAdvancedSettings = useCallback(() => {
    setSelectedCoaches(selectedCoachesInitial);
    setSelectedEstablishment(selectedEstablishmentsInitial);
    setSelectedSite(selectedSiteInitial);
  }, [
    selectedCoachesInitial,
    selectedEstablishmentsInitial,
    selectedSiteInitial,
  ]);

  /**
   * Establishment Billing Groups
   */

  const selectedEstablishmentBillingGroupInitial = useMemo(() => {
    if (
      !userRole?.staff_establishment_billing_group ||
      !establishmentBillingGroups
    )
      return null;
    const establishmentBillingGroup = establishmentBillingGroups.find(
      (group) => group.id === userRole.staff_establishment_billing_group,
    );

    if (!establishmentBillingGroup) return null;

    return {
      label: establishmentBillingGroup.name,
      value: establishmentBillingGroup.id,
    };
  }, [establishmentBillingGroups, userRole]);

  const establishmentBillingGroupOptions = useMemo(
    () =>
      establishmentBillingGroups
        ? [...establishmentBillingGroups]?.map(
            (object: EstablishmentBillingGroup) => ({
              value: object.id,
              label: object.name,
            }),
          )
        : [],
    [establishmentBillingGroups],
  );

  const [
    selectedEstablishmentBillingGroup,
    setSelectedEstablishmentBillingGroup,
  ] = useState<SelectFieldItem | null>(null);

  const handleSelectEstablishmentBillingGroup = useCallback(
    (value: SelectFieldItem) => {
      setSelectedEstablishmentBillingGroup(value);
    },
    [setSelectedEstablishmentBillingGroup],
  );

  useEffect(() => {
    setSelectedEstablishmentBillingGroup(
      selectedEstablishmentBillingGroupInitial,
    );
  }, [selectedEstablishmentBillingGroupInitial]);

  /**
   * GENERAL
   */

  const handleSubmit = useCallback(() => {
    if (!userRole?.id) {
      return;
    }
    const coachIds = selectedCoaches.map((coach) => coach.value);
    const establishmentIds = selectedEstablishments.map(
      (establishment) => establishment.value,
    );
    const staff_establishment_billing_group =
      selectedEstablishmentBillingGroup?.value || null;
    updateUserRole(userRole.id, {
      coaches: coachIds,
      establishments: establishmentIds,
      staff_establishment_billing_group,
    });
    onConfirm?.();
  }, [
    onConfirm,
    selectedCoaches,
    updateUserRole,
    userRole,
    selectedEstablishments,
    selectedEstablishmentBillingGroup,
  ]);

  return {
    coachOptions,
    establishmentOptions,
    establishmentBillingGroupOptions,
    handleResetAdvancedSettings,
    handleSelectCoaches,
    handleSelectEstablishments,
    handleSelectEstablishmentBillingGroup,
    selectedEstablishmentBillingGroup,
    handleSelectSite,
    handleSubmit,
    selectedCoaches,
    selectedEstablishments,
    selectedSite,
    siteOptions,
  };
};
