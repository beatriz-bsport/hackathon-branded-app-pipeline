import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { FranchiseCompany } from '#src/libs/franchise/types';
import GenericDeleteDialog from '#src/components/genericDialog/GenericDeleteDialog.component';
import { sortCompanyListByIsAllowedAndName } from '#src/libs/franchise/utils';
import { ProductCardCategoryListSchema } from '#src/components/card/ProductCardCategoryList.component';
import ProductCard from '#src/components/card/ProductCard.component';
import { parseQueryString } from '../../../../../http';
import FranchiseDialogSelectCompanies from '../dialogs/FranchiseDialogSelectCompanies.component';
import GenericTemplateCardCompanyList from './GenericTemplateCardCompanyList.component';

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
      !!parseQueryString(location.search || '')?.openSelectCompaniesForm,
    );
  const companiesInTemplateIdList = (companiesInTemplate ?? []).map(
    (c) => c.id,
  );
  const companiesWithoutInstance = (allCompanies ?? []).filter(
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
        headerLeftPrimary={headerLeftPrimary}
        headerLeftSecondary={headerLeftSecondary}
        headerRightPrimary={headerRightPrimary}
        headerRightSecondary={headerRightSecondary}
      >
        <GenericTemplateCardCompanyList
          // @ts-expect-error
          companies={sortedCompaniesInTemplate}
          nbCompanyChips={nbCompanyChips}
          onCreateTemplateInstance={() => setOpenSelectCompaniesDialog(true)}
          onDeleteTemplateInstance={(companyId: number) =>
            setDeleteTemplateInstanceId(companyId)
          }
        />
      </ProductCard>
      <GenericDeleteDialog
        // To delete Template
        content={deleteTemplateContent}
        onCancel={() => setOpenDeleteTemplateDialog(false)}
        onValidate={handleDeleteTemplate}
        open={openDeleteTemplateDialog}
        title={
          deleteTemplateTitle ??
          t('genericProduct.dialogs.deleteTemplate.title')
        }
      />
      <GenericDeleteDialog
        // To delete TemplateInstance
        onCancel={() => setDeleteTemplateInstanceId(null)}
        onValidate={handleDeleteTemplateInstance}
        open={!!deleteTemplateInstanceId}
        title={
          deleteTemplateInstanceTitle ||
          t('genericProduct.dialogs.deleteTemplateInstance.title')
        }
        validateLabel={t(
          'genericProduct.dialogs.deleteTemplateInstance.buttonValidate',
        )}
      >
        {deleteTemplateInstanceChildren}
        {(deleteTemplateInstanceContents ?? []).map(
          (content: string, index: number) => (
            <Typography
              key={`${index}-${content.slice(0, 10)}`}
              className={clsx({
                [classes.description]:
                  index < (deleteTemplateInstanceContents ?? []).length - 1,
              })}
              color="textSecondary"
              variant="body1"
            >
              {content}
            </Typography>
          ),
        )}
      </GenericDeleteDialog>
      <FranchiseDialogSelectCompanies
        companyWithoutInstanceList={companiesWithoutInstance}
        onCancel={() => setOpenSelectCompaniesDialog(false)}
        onCreateTemplateInstances={handleCreateTemplateInstances}
        open={openSelectCompaniesDialog}
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
