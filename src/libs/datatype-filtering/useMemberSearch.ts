import { useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';

import { search as searchMembersAction } from '#src/libs/member/actions';

import {
  getMembersBasedOnListData,
  getSearchedMembers,
  getSearchMemberLoading,
} from '#src/libs/member/selectors';
import { setDynamicDataHasBeenLoaded } from '#src/libs/datatype-filtering/actions';
import type { MemberSearchBarOptions } from '#src/libs/member/types';

const DEBOUNCE_TIME = 500;

/**
 * @description Hook used to add additional items in options for search purposes in reports filtering
 *
 * @param {number[]} consumerIdsSelected List of consumer ids selected
 * @param {number[]} defaultConsumerIds List of ids to be fetched on mount
 */
const useMemberSearch = (
  consumerIdsSelected: number[],
  defaultConsumerIds: number[],
) => {
  const dispatch = useDispatch();

  const memberResults = useSelector(getSearchedMembers);

  const isSearchLoading = useSelector(getSearchMemberLoading);

  const compareTextRef = useRef('');

  /**
   * Selected members relies on the `listData` Redux state,
   * as the `search.allIds` array is reset on every search.
   */
  const allMembers = useSelector(getMembersBasedOnListData);
  const membersSelected = useMemo(
    () =>
      allMembers.filter((member) =>
        consumerIdsSelected.includes(member.consumer),
      ),
    [allMembers, consumerIdsSelected],
  );

  useEffect(() => {
    if (defaultConsumerIds?.length) {
      dispatch(
        searchMembersAction('', { consumer_id__in: defaultConsumerIds }),
      );
    }

    dispatch(setDynamicDataHasBeenLoaded('user'));
  }, [dispatch, defaultConsumerIds]);

  const handleInputChange = useMemo(
    () =>
      debounce((text: string) => {
        if (compareTextRef.current === text) {
          return;
        }

        if (text) {
          compareTextRef.current = text;
          dispatch(
            searchMembersAction(text, {
              id__not_in: membersSelected.map((member) => member.id),
            }),
          );
        }
      }, DEBOUNCE_TIME),
    [dispatch, membersSelected],
  );

  // @ts-expect-error listData key in redux is typed as Member because being used by several actions
  // with different serializers but for this usecase, we only need name and consumer attributes
  const options: MemberSearchBarOptions = useMemo(
    () =>
      ([...memberResults] ?? []).map((member) => ({
        label: member?.name || '',
        value: member.consumer,
        member,
      })),
    [memberResults],
  );

  return {
    handleInputChange,
    isSearchLoading,
    membersSelected,
    options,
  };
};

export default useMemberSearch;
