const getTranslations = async () => {
  const {
    REFERRED_AND_REFERRING_MEMBERS_INCOMPATIBLE,
    REFERRING_MEMBER_UNEXISTING,
    COMPANY_MEMBER_ALREADY_EXISTING,
    TOO_HIGH_REFERRING_VOUCHER_CONSUMED,
    REFERRAL_GRANT_LOCK_ACQUISITION_ERROR,
    REFERRAL_GRANT_ASSIGNMENT_LOCK_ACQUISITION_ERROR,
    REFERRAL_PROGRAM_DEACTIVATED,
    WRONG_APPLICATION_TIME_LIMIT_UNIT,
  } = await import(
    '@bsport/common/lib/master-data/referral-exception-error-code'
  );

  return {
    form: {
      title: 'Referral',
      activateReferral: {
        label: 'Activate referral link',
        description:
          'Each member can share this referral link to non-members. Upon use, it provides an automatic discount to the new member as well as a reward for the member who shared the link.',
      },
      minimumBasketAmount: {
        label: 'Minimum value of customer basket',
        description: 'This value refers to the total price of the basket',
      },
      maximumUses: {
        label: 'Maximum number of uses',
      },
      amountOffReferred: {
        title: 'Discount for the referred member',
        percent: {
          title: 'Percentage',
          fieldLabel: 'Percentage',
        },
        amount: {
          title: 'Amount',
          fieldLabel: 'Amount',
        },
      },
      applicationTimeLimit: {
        title: 'Time limit for applying the discount after registration',
        units: {
          day: 'Day',
          day_plural: 'Days',
          week: 'Week',
          week_plural: 'Weeks',
          month: 'Month',
          month_plural: 'Months',
        },
      },
      rewardReferring: {
        title: 'Reward for the referring member',
        label: 'Reward amount',
      },
      tag: {
        title: 'Tag',
        description: 'A new member using the referral link will be tagged',
      },
      redirectLink: {
        title: 'Redirect link',
        description:
          'After registering, the new member will be redirected to the page indicated by your URL. If you leave the box empty, they will be taken to the pass purchase page',
        placeholder: 'Redirection URL',
      },
      warnings: {
        referredAmount:
          'By choosing this value, no discount will be applied to the purchase of the referred member',
        rewardReferring:
          'By choosing this value, no reward will be awarded to the referring member',
      },
      errors: {
        minimumAmount: 'The minimum amount must be above 0',
        maximumUses: 'The maximum number of uses must be above 1',
        referredAmount: 'The discount must be above 0',
        timeLimit: 'The delay must be above 1',
        rewardReferring: 'The reward must be above 0',
        url: 'Please enter a valid URL',
        required: 'This field is mandatory',
      },
      submit: 'Save',
    },
    memberInfo: {
      referralLink: 'Referral link',
      nbRemainingUses: 'Number of uses remaining',
      inviteFriend: 'Invite a friend to sign up',
      forYou: 'for you',
      forYourFriend: 'for your friend',
      copyLink: 'Copy my referral link',
      seeConditions: 'See conditions',
      warningMaxUsesReached:
        'You have reached the maximum number of uses of your referral link',
    },
    conditions: {
      title: 'Conditions of use of the referral link',
      description: {
        maxUses:
          'Each member has a personal referral link that can be shared in order to obtain a reward. It can be obtained a <1>maximum number of {{ maxReferralUses }} times</1>.',
        signUp: {
          reduction:
            'Using the shared link will take the new member to the registration form for them to create an account. Once this has been done, the referred member will be able to <1>benefit from a discount of {{ referredReduction }}</1> on their first basket if it meets the following conditions:<3><0>The amount of the basket is greater than {{ minBasketAmount }}</0><0>It is carried out within {{ applicationTimeLimitIntervals }} {{ applicationTimeLimitUnit }} after the referred member has registered</0></3>',
          noReduction:
            'Using the shared link will take the new member to the registration form for them to create an account. Once this has been done, the referred member must complete their first basket in accordance with the following conditions:<1><0>The amount of the basket is greater than {{ minBasketAmount }}</0><0>It is carried out within {{ applicationTimeLimitIntervals }} {{ applicationTimeLimitUnit }} after the referred member has registered</0></1>',
        },
        applicationTimeLimit: {
          units: {
            days: 'day',
            days_plural: 'days',
            weeks: 'week',
            weeks_plural: 'weeks',
            months: 'month',
            months_plural: 'months',
          },
        },
        reward1:
          'If the first purchase (excluding subscriptions) is made in accordance with the terms and conditions described, the referring member will be <1>rewarded with a sum of {{ referringReward }}</1>. This may be obtained for each referred member up to a limit of {{ maxReferralUses }} times.',
        reward2:
          "The reward will be automatically applied to the referring member's next baskets: there are no time or amount conditions regarding the application. It can also be applied in several instalments if the amount of the basket is less than the reward.",
        warning:
          'Please note: the referral program only applies to new members of the studio or franchise.',
      },
    },
    checkoutValidation: {
      title: 'Sponsor a friend',
      explain: 'Get rewards by sharing your referral link with your friends.',
    },
    referralErrors: {
      [REFERRED_AND_REFERRING_MEMBERS_INCOMPATIBLE]: {
        title: 'Referral link unusable',
        description: 'This referral link is not available for this studio.',
      },
      [REFERRING_MEMBER_UNEXISTING]: {
        title: 'Referral link unusable',
        description:
          'The member associated to this referral link is not registered to the studio anymore.',
      },
      [COMPANY_MEMBER_ALREADY_EXISTING]: {
        title: 'Referral link unusable',
        description: 'You are already a member of this studio',
      },
      [TOO_HIGH_REFERRING_VOUCHER_CONSUMED]: {
        title: 'Referral link expired',
        description: 'This referral link is not usable anymore.',
      },
      [REFERRAL_GRANT_LOCK_ACQUISITION_ERROR]: {
        title: 'Referral error',
        description: 'An error cas encountered while registering the referral.',
      },
      [REFERRAL_GRANT_ASSIGNMENT_LOCK_ACQUISITION_ERROR]: {
        title: 'Referral error',
        description: 'An error cas encountered while registering the referral.',
      },
      [REFERRAL_PROGRAM_DEACTIVATED]: {
        title: 'Referral expired',
        description: 'The referral program is not available anymore.',
      },
      [WRONG_APPLICATION_TIME_LIMIT_UNIT]: {
        title: 'Referral expired',
        description: 'The referral program is not available anymore.',
      },
      maxUsesReached: {
        title: 'Referral link unusable',
        description:
          'The maximum number of usage has been reached for this link from {{ referringMemberFirstName }}.',
      },
    },
  };
};

exports.default = getTranslations();
