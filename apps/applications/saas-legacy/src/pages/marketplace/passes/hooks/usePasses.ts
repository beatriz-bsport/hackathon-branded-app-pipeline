import { getPrivatePassAsConsumer } from '#src/libs/private-service/selectors/private-pass';
import { getPrivatePassByCategoryWithPasses } from '#src/libs/private-service/selectors/private-pass-category';
import { RootState } from '#src/reducers';
import { useSelector } from 'react-redux';
import { getPaymentPackCategoriesWithPacks } from '#src/libs/payment-packs/selectors';
import {
  createAppointmentPassCardContent,
  createPassCardContent,
} from '#src/pages/marketplace/passes/utils';
import { usePassesActions } from '#src/pages/marketplace/passes/hooks/usePassesActions';
import { getMemberTagsIdsList } from '#src/libs/tag/selectors';

/**
 * Custom React hook that handles the data preparation for the passes page.
 *
 * - Retrieves relevant data from the Redux store.
 * - Returns the processed pass and appointment pass card data grouped by category, along with the loading state.
 *
 */
export const usePasses = () => {
  const { handleDetailsClick, handleAddToCart, handleAppointmentDetailsClick } =
    usePassesActions();
  const memberTaglist = useSelector(getMemberTagsIdsList);

  const authenticated = useSelector(
    (state: RootState) => state.auth.authenticated,
  );
  const isPaymentPackLoading = useSelector(
    (state: RootState) => state.paymentPack.loading,
  );
  const isPrivatePassCategoryLoading = useSelector(
    (state: RootState) => state.privateService.privatePassCategory.loading,
  );
  const isPrivateServiceLoading = useSelector(
    (state: RootState) => state.privateService.privateService.loading,
  );

  const isPrivatePassLoading =
    isPrivatePassCategoryLoading || isPrivateServiceLoading;

  const categoriesWithPacks =
    useSelector((state: RootState) =>
      getPaymentPackCategoriesWithPacks(
        state,
        authenticated,
        memberTaglist,
      )?.asMutable({ deep: true }),
    ) ?? [];
  const categoriesWithAppointmentPacks =
    useSelector((state: RootState) =>
      getPrivatePassByCategoryWithPasses(getPrivatePassAsConsumer)(
        state,
      )?.asMutable({ deep: true }),
    ) ?? [];

  const passCardsByCategories = categoriesWithPacks.map((category) => {
    return {
      id: category.id,
      order: category.category_ordering,
      name: category.name,
      cardsContent: createPassCardContent({
        packs: category.packs,
        handleDetailsClick,
        handleAddToCart,
      }),
    };
  });

  const appointmentPassCardsByCategories = categoriesWithAppointmentPacks.map(
    (category) => {
      return {
        id: category.id,
        order: category.category_ordering,
        name: category.name,
        cardsContent: createAppointmentPassCardContent({
          passes: category.passes,
          handleAppointmentDetailsClick,
          handleAddToCart,
        }),
      };
    },
  );

  return {
    passCardsByCategories,
    appointmentPassCardsByCategories,
    isPaymentPackLoading,
    isPrivatePassLoading,
  };
};
