import { connect } from 'react-redux';

const HOC = (ownProps) => {
  return ownProps.children(ownProps._featureList, 1);
};

export default connect((state) => ({
  _featureList: state.company.feature.data,
}))(HOC);
