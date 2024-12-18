import * as Yup from 'yup';

const MemberProfileSettingsSchema = Yup.object().shape({
  show_member_account_balance: Yup.boolean(),
  show_barcode_button: Yup.boolean(),
  show_membership_number: Yup.boolean(),
});

export default MemberProfileSettingsSchema;
