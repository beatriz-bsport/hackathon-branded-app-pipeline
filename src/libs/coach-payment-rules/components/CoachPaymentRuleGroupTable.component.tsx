import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import type { CoachPaymentRuleGroup } from '../types';

import withConfirm from '../../../hocs/with-confirm.hoc';

type OwnProps = {
  coachPaymentRuleGroups: Array<CoachPaymentRuleGroup>;
  onEditPaymentRuleGroup: (group: CoachPaymentRuleGroup) => void;
  onDeletePaymentRuleGroup: (group: CoachPaymentRuleGroup) => void;
};

type Props = OwnProps & WithTranslation;

const ButtonWithConfirm = withConfirm(Button, 'onClick', {
  title: 'paymentRules:coach_payment_rule_groups.modal.delete.title',
  cancel: 'paymentRules:coach_payment_rule_groups.modal.delete.cancel',
  confirm: 'paymentRules:coach_payment_rule_groups.modal.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('paymentRules:coach_payment_rule_groups.modal.delete.content')}</p>
  ),
});
export function CoachPaymentRuleGroupTable(props: Props) {
  const { t } = props;
  const {
    coachPaymentRuleGroups,
    onEditPaymentRuleGroup,
    onDeletePaymentRuleGroup,
  } = props;
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t('coach_payment_rules.name')}</TableCell>
          <TableCell>{t('coach_payment_rule_groups.session')}</TableCell>
          <TableCell>{t('coach_payment_rule_groups.workshop')}</TableCell>
          <TableCell>
            {t('coach_payment_rule_groups.private_service')}
          </TableCell>

          <TableCell>{t('coach_payment_rules.coaches')}</TableCell>
          <TableCell>{t('coach_payment_rules.actions')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {coachPaymentRuleGroups &&
          coachPaymentRuleGroups.map((group: CoachPaymentRuleGroup) => (
            <TableRow key={group.id}>
              <TableCell> {group.name}</TableCell>
              <TableCell>
                {group.session_coach_payment_rule &&
                  group.session_coach_payment_rule.name}
              </TableCell>
              <TableCell>
                {group.workshop_coach_payment_rule &&
                  group.workshop_coach_payment_rule.name}
              </TableCell>
              <TableCell>
                {group.private_service_coach_payment_rule &&
                  group.private_service_coach_payment_rule.name}
              </TableCell>
              <TableCell>
                {group.associated_coach.map((c) => c.name).join(', ')}
              </TableCell>
              <TableCell>
                <Button onClick={() => onEditPaymentRuleGroup(group)}>
                  <EditIcon />
                </Button>
                <ButtonWithConfirm
                  onClick={() => onDeletePaymentRuleGroup(group)}
                >
                  <DeleteIcon />
                </ButtonWithConfirm>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

export default compose<any, OwnProps>(withTranslation(['paymentRules']))(
  CoachPaymentRuleGroupTable,
);
