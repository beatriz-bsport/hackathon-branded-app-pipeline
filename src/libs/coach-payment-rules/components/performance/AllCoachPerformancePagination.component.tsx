import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

type OwnProps = {
  pagination: {
    page: number;
    count: number;
    next: number;
    previous: number;
  };
  loading: boolean;
  changePage: (page: number) => void;
};
type Props = OwnProps;

const PAGE_SIZE = 50;
export class AllPerformancePagination extends React.PureComponent<Props> {
  handleGeneratePreviousPage = () => {
    if (this.props.pagination.previous) {
      this.props.changePage(this.props.pagination.previous);
    }
  };

  handleGenerateNextPage = () => {
    if (this.props.pagination.next) {
      this.props.changePage(this.props.pagination.next);
    }
  };

  render() {
    return (
      <>
        <IconButton
          onClick={this.handleGeneratePreviousPage}
          disabled={!this.props.pagination.previous || this.props.loading}
          aria-label="previous page"
        >
          <KeyboardArrowLeft />
        </IconButton>
        <Typography variant="caption">
          {`${(this.props.pagination.page - 1) * PAGE_SIZE + 1} - ${
            this.props.pagination.page * PAGE_SIZE > this.props.pagination.count
              ? this.props.pagination.count
              : this.props.pagination.page * PAGE_SIZE
          } / ${this.props.pagination.count} `}
        </Typography>
        <IconButton
          onClick={this.handleGenerateNextPage}
          disabled={!this.props.pagination.next || this.props.loading}
          aria-label="next page"
        >
          <KeyboardArrowRight />
        </IconButton>
      </>
    );
  }
}

export default AllPerformancePagination;
