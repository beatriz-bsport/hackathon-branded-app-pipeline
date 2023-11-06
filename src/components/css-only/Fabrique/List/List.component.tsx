import React, { PropsWithChildren, memo } from 'react';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Typography from '#Fabrique/Typography';
import './styles.css';

type OwnProps = {
  classes?: { listTitle?: string };
  listTitle?: string;
  className?: string;
};

type Props = PropsWithChildren<OwnProps>;

export const List: React.FC<Props> = ({
  children,
  listTitle,
  classes,
  className,
}) => {
  return (
    <ul className={classNames('bs-fabrique-list__root', className)}>
      <Typography
        className={classNames(
          'bs-fabrique-list__title',
          { 'bs-fabrique-list__field--empty': !listTitle },
          classes?.listTitle,
        )}
        variant="body-md"
      >
        {listTitle}
      </Typography>
      {children}
    </ul>
  );
};

export const ListStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof List>>()(List);

export default memo(List);
