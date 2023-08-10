exports.default = {
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
  },
};
