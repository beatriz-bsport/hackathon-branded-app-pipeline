// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import GenericTemplateCardCompanyList from './GenericTemplateCardCompanyList.component';
import FranchiseDialogSelectCompanies from '../dialogs/FranchiseDialogSelectCompanies.component';
import { FranchiseCompany } from '#libs/franchise/types';
import { parseQueryString } from '../../../../../http';
import GenericDeleteDialog from '#components/genericDialog/GenericDeleteDialog.component';
import { sortCompanyListByIsAllowedAndName } from '#libs/franchise/utils';
import { ProductCardCategoryListSchema } from '#components/card/ProductCardCategoryList.component';
import ProductCard from '#components/card/ProductCard.component';

type ProductCardProps = {
  // header
  headerLeftPrimary?: string | React.ReactNode;
  headerLeftSecondary?: string | React.ReactNode;
  headerRightPrimary?: string | React.ReactNode;
  headerRightSecondary?: string | React.ReactNode;
  // center
  buttons?: Array<{
    onClick: () => void;
    label: string;
    redButton?: boolean;
    className?: string;
  }>;
  categories?: ProductCardCategoryListSchema;
  description?: string | React.ReactNode;
};

type TemplateCardProps = {
  allCompanies: Array<FranchiseCompany>;
  companiesInTemplate: Array<FranchiseCompany>;
  nbCompanyChips?: number;
  // to custom content of the Delete Template Dialog
  deleteTemplateContent: string;
  deleteTemplateTitle?: string;
  // to custom content of the Delete Template Instance Dialog
  deleteTemplateInstanceTitle?: string;
  deleteTemplateInstanceChildren?: any;
  deleteTemplateInstanceContents?: string[];
  // actions
  onUpdateTemplate: () => void;
  onDeleteTemplate: () => void;
  onCreateTemplateInstances: (companyIds: number[]) => void;
  onDeleteTemplateInstance: (companyId: number) => void;
};

export type Props = ProductCardProps & TemplateCardProps;

const FranchiseGenericProductTemplateCard = (props: Props) => {
  const { t } = useTranslation('franchise');
  const classes = useStyles();
  const {
    allCompanies,
    companiesInTemplate,
    deleteTemplateContent,
    deleteTemplateTitle,
    deleteTemplateInstanceTitle,
    deleteTemplateInstanceChildren,
    deleteTemplateInstanceContents,
    headerLeftPrimary,
    headerLeftSecondary,
    headerRightPrimary,
    headerRightSecondary,
    buttons,
    description,
    categories,
    nbCompanyChips,
    onUpdateTemplate,
    onDeleteTemplate,
    onCreateTemplateInstances,
    onDeleteTemplateInstance,
  } = props;
  const [deleteTemplateInstanceId, setDeleteTemplateInstanceId] =
    React.useState(null);
  const [openDeleteTemplateDialog, setOpenDeleteTemplateDialog] =
    React.useState(false);
  const [openSelectCompaniesDialog, setOpenSelectCompaniesDialog] =
    React.useState(
      // @ts-ignore
      // eslint-disable-next-line
      !!parseQueryString(location.search || '')?.openSelectCompaniesForm,
    );
  const companiesInTemplateIdList = (companiesInTemplate || []).map(
    (c) => c.id,
  );
  const companiesWithoutInstance = (allCompanies || []).filter(
    (c) => !companiesInTemplateIdList.includes(c.id),
  );
  const sortedCompaniesInTemplate =
    sortCompanyListByIsAllowedAndName(companiesInTemplate);
  const handleDeleteTemplateInstance = React.useCallback(() => {
    onDeleteTemplateInstance(deleteTemplateInstanceId);
    setDeleteTemplateInstanceId(null);
  }, [deleteTemplateInstanceId, onDeleteTemplateInstance]);
  const handleDeleteTemplate = React.useCallback(() => {
    onDeleteTemplate();
    setOpenDeleteTemplateDialog(false);
  }, [onDeleteTemplate]);
  const handleCreateTemplateInstances = React.useCallback(
    (ids: number[]) => {
      onCreateTemplateInstances(ids);
      setOpenSelectCompaniesDialog(false);
    },
    [onCreateTemplateInstances],
  );
  return (
    <>
      <ProductCard
        headerLeftPrimary={headerLeftPrimary}
        headerRightPrimary={headerRightPrimary}
        headerLeftSecondary={headerLeftSecondary}
        headerRightSecondary={headerRightSecondary}
        buttons={
          buttons ?? [
            {
              onClick: onUpdateTemplate,
              className: classes.button,
              label: t('genericProduct.templateCard.buttons.update'),
            },
            {
              onClick: () => setOpenDeleteTemplateDialog(true),
              className: classes.button,
              label: t('genericProduct.templateCard.buttons.delete'),
              redButton: true,
            },
          ]
        }
        categories={categories}
        description={description}
      >
        <GenericTemplateCardCompanyList
          companies={sortedCompaniesInTemplate}
          onDeleteTemplateInstance={(companyId: number) =>
            setDeleteTemplateInstanceId(companyId)
          }
          onCreateTemplateInstance={() => setOpenSelectCompaniesDialog(true)}
          nbCompanyChips={nbCompanyChips}
        />
      </ProductCard>
      <GenericDeleteDialog
        // To delete Template
        content={deleteTemplateContent}
        open={openDeleteTemplateDialog}
        onCancel={() => setOpenDeleteTemplateDialog(false)}
        onValidate={handleDeleteTemplate}
        title={
          deleteTemplateTitle ??
          t('genericProduct.dialogs.deleteTemplate.title')
        }
      />
      <GenericDeleteDialog
        // To delete TemplateInstance
        open={!!deleteTemplateInstanceId}
        title={
          deleteTemplateInstanceTitle ||
          t('genericProduct.dialogs.deleteTemplateInstance.title')
        }
        validateLabel={t(
          'genericProduct.dialogs.deleteTemplateInstance.buttonValidate',
        )}
        onValidate={handleDeleteTemplateInstance}
        onCancel={() => setDeleteTemplateInstanceId(null)}
      >
        {deleteTemplateInstanceChildren}
        {(deleteTemplateInstanceContents || []).map(
          (content: string, index: number) => (
            <Typography
              color="textSecondary"
              variant="body1"
              className={classNames({
                [classes.description]:
                  index < (deleteTemplateInstanceContents || []).length - 1,
              })}
              key={`${index}-${content.slice(0, 10)}`}
            >
              {content}
            </Typography>
          ),
        )}
      </GenericDeleteDialog>
      <FranchiseDialogSelectCompanies
        companyWithoutInstanceList={companiesWithoutInstance}
        open={openSelectCompaniesDialog}
        onCancel={() => setOpenSelectCompaniesDialog(false)}
        onCreateTemplateInstances={handleCreateTemplateInstances}
      />
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    fontWeight: 'bold',
  },
  description: {
    marginBottom: theme.spacing(2),
  },
}));

export default FranchiseGenericProductTemplateCard;
