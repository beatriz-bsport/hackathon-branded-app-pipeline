import React, { Component } from 'react';

import { compose } from 'recompose';

import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import { WithTranslation, withTranslation } from 'react-i18next';

type OwnProps = {
  emailList: Array<string>;
  addEmailToList: (email: string) => void;
  handleDelete: (e: any) => void;
};

type State = {
  currentTextInput: string;
  wrongChips: Array<string>;
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;
const emailRegexp = new RegExp('[A-z0-9-_]+@[A-z0-9-_]+.[A-z]+$');

export class EmailInputWithChipsGenerator extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentTextInput: '',
      wrongChips: [],
    };
  }

  handleKeyDown(e: any) {
    const text = this.state.currentTextInput;
    if (
      (e.key === 'Enter' || e.key === ' ' || e.key === ',') &&
      text.length > 0
    ) {
      if (emailRegexp.test(text) && !this.props.emailList.includes(text)) {
        this.props.addEmailToList(text);
        this.setState({ currentTextInput: '' });
      } else {
        this.setState((prevState) => ({
          wrongChips: [...prevState.wrongChips, text],
          currentTextInput: '',
        }));
      }
    }
  }

  handleChange(e: any) {
    if (e.target.value !== ' ' && e.target.value !== ',') {
      this.setState({ currentTextInput: e.target.value });
    }
  }

  removeChip(text: string) {
    const chipList = [...this.state.wrongChips];
    const wrongChips = chipList.filter((t) => t !== text);
    this.setState({ wrongChips });
  }

  render() {
    const { classes, t, handleDelete, emailList } = this.props;
    const { wrongChips, currentTextInput } = this.state;

    return (
      <div className={classes.container}>
        <TextField
          value={currentTextInput}
          label={t('creation_form.email_input')}
          variant="standard"
          onChange={(e) => this.handleChange(e)}
          onKeyDown={(e) => this.handleKeyDown(e)}
        />
        <div className={classes.chipContainer}>
          {wrongChips &&
            wrongChips.length > 0 &&
            wrongChips.map((text, index) => (
              <div className={classes.chip}>
                <Chip
                  label={text}
                  key={`${index} - ${text}`}
                  onDelete={() => this.removeChip(text)}
                  color="primary"
                  style={{ backgroundColor: 'red' }}
                />
              </div>
            ))}
          {emailList &&
            emailList.length > 0 &&
            emailList.map((email, index) => (
              <div className={classes.chip}>
                <Chip
                  label={email}
                  key={`${index} - ${email}`}
                  onDelete={(e) => handleDelete(e)}
                />
              </div>
            ))}
        </div>
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      padding: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
    },
    chip: {
      padding: theme.spacing(0.2),
    },
    chipContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing(0.5),
    },
  });

export default compose(
  withStyles(styles),
  withTranslation(['giftCard']),
)(EmailInputWithChipsGenerator);
