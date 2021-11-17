/* eslint-disable */
// @flow
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import Radio from '@material-ui/core/Radio';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import i18n from '../../i18n';
import { snackbarSuccess } from '../../libs/snackbar/actions';
import Config from '../../config';

type Props = {
  setOpenWidgetDialog: () => void,
  openWidgetDialog: boolean,
  snackbarSuccess: (string) => void,
  activities: number,
  companyId: number,
  widgetType: string,
  coaches: number,
  establishments: number,
  levels: number,
  companyName: string,
};

export const WidgetButton = (props: Props) => {
  const { t } = useTranslation(['widget']);
  const [openCode, setOpenCode] = useState(false);
  const [openUrl, setOpenUrl] = useState(false);
  const [compactMode, setCompactMode] = useState('false');
  const [widgetChoice, setWidgetChoice] = useState('false');
  const [openIframe, setOpenIframe] = useState(false);
  const [checked, setChecked] = React.useState(false);

  const { language } = i18n;
  const classes = useStyles();
  const handleChangeCompactMode = (event) => {
    setCompactMode(event.target.value);
  };
  const handleChangeChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  const handleChangeWidgetChoice = (event) => {
    setWidgetChoice(event.target.value);
    if (event.target.value === 'code') {
      setOpenCode(true);
    }
    if (event.target.value === 'url') {
      setOpenUrl(true);
    }
  };

  return (
    <div>
      <Dialog
        aria-labelledby="simple-dialog-title"
        open={props.openWidgetDialog}
      >
        <DialogTitle id="simple-dialog-title">{t('widget.widget')}</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <FormLabel component="legend">{t('widget.choice')}</FormLabel>
            <RadioGroup
              aria-label="displayType"
              name="displayType"
              value={widgetChoice}
              onChange={handleChangeWidgetChoice}
            >
              <div className={classes.displayType}>
                <FormControlLabel
                  value="code"
                  control={<Radio />}
                  label={
                    <div>
                      <Typography variant="subtitle1">
                        {t('widget.code')}
                      </Typography>
                      <Typography variant="caption">
                        {t('widget.codeSource')}
                      </Typography>
                    </div>
                  }
                />
                <FormControlLabel
                  value="url"
                  control={<Radio />}
                  label={
                    <div>
                      <Typography variant="subtitle1">
                        {t('widget.url')}
                      </Typography>
                      <Typography variant="caption">
                        {t('widget.copyUrl')}
                      </Typography>
                    </div>
                  }
                />
              </div>
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => props.setOpenWidgetDialog(false)}
            color="secondary"
            autoFocus
          >
            {t('widget.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog aria-labelledby="simple-dialog-title" open={openCode}>
        <DialogTitle id="simple-dialog-title">{t('widget.code')}</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <FormLabel component="legend">{t('widget.displayType')}</FormLabel>
            <RadioGroup
              aria-label="displayType"
              name="displayType"
              value={compactMode}
              onChange={handleChangeCompactMode}
            >
              <div className={classes.displayType}>
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label={t('widget.listDisplay')}
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label={t('widget.calendarDisplay')}
                />
                <FormControlLabel
                  value="null"
                  control={<Radio />}
                  label={t('widget.responsiveDisplay')}
                />
              </div>
            </RadioGroup>
          </FormControl>
          <hr className={classes.solid} />
          <DialogContentText id="alert-dialog-description">
            {!checked ? (
              <div className={classes.code}>
                <Typography>
                  {
                    `<script src="https://${Config.REACT_APP_CDN_DOMAIN}/scripts/widget"></script>`
                  }
                </Typography>
                <Typography>{'<script>'}</Typography>
                <Typography className={classes.alinea}>
                  {'BsportWidget.mount({'}
                </Typography>
                <Typography className={classes.alinea2}>
                  parentElement: "bsport-widget"
                </Typography>
                <Typography className={classes.alinea2}>
                  {`compactMode: ${compactMode},`}
                </Typography>
                <Typography className={classes.alinea2}>
                  {`companyId:  ${props.companyId},`}
                </Typography>
                <Typography className={classes.alinea2}>
                  {`widgetType:  "${props.widgetType}",`}
                </Typography>
                <Typography className={classes.alinea2}>
                  {`lang: "${language}",`}
                </Typography>
                <Typography className={classes.alinea2}>
                  {'defaultFilters:{'}
                </Typography>
                <Typography className={classes.alinea3}>
                  {`coaches:[${props.coaches ? props.coaches : ''}],`}
                </Typography>
                <Typography className={classes.alinea3}>
                  {`establishments:[${
                    props.establishments ? props.establishments : ''
                  }],`}
                </Typography>
                <Typography className={classes.alinea3}>
                  {`levels:[${props.levels ? props.levels : ''}],`}
                </Typography>
                <Typography className={classes.alinea3}>
                  {`metaActivities:[${
                    props.activities ? props.activities : ''
                  }],`}
                </Typography>
                <Typography className={classes.alinea2}>{'}'}</Typography>
                <Typography className={classes.alinea}>{'});'}</Typography>
                <Typography>{'</script>'}</Typography>
                <Typography>{'<div id="bsport-widget"/>'}</Typography>
              </div>
            ) : (
              <div className={classes.code}>
                <Typography>
                  {
                    // eslint-disable-next-line
                    "<iframe srcdoc='<div> "
                  }
                </Typography>
                <Typography className={classes.alinea}>
                  {
										`<script src="https://${Config.REACT_APP_CDN_DOMAIN}/scripts/widget"></script>`
                  }
                </Typography>
                <Typography className={classes.alinea}>{'<script>'}</Typography>
                <Typography className={classes.alinea2}>
                  {'BsportWidget.mount({'}
                </Typography>
                <Typography className={classes.alinea3}>
                  parentElement: "bsport-widget",
                </Typography>
                <Typography className={classes.alinea3}>
                  {`compactMode: ${compactMode},`}
                </Typography>
                <Typography className={classes.alinea3}>
                  {`companyId:  ${props.companyId},`}
                </Typography>
                <Typography className={classes.alinea3}>
                  {`widgetType:  "${props.widgetType}",`}
                </Typography>
                <Typography className={classes.alinea3}>
                  {`lang: "${language}",`}
                </Typography>
                <Typography className={classes.alinea3}>
                  {'defaultFilters:{'}
                </Typography>
                <Typography className={classes.alinea4}>
                  {`coaches:[${props.coaches ? props.coaches : ''}],`}
                </Typography>
                <Typography className={classes.alinea4}>
                  {`establishments:[${
                    props.establishments ? props.establishments : ''
                  }],`}
                </Typography>
                <Typography className={classes.alinea4}>
                  {`levels:[${props.levels ? props.levels : ''}],`}
                </Typography>
                <Typography className={classes.alinea4}>
                  {`metaActivities:[${
                    props.activities ? props.activities : ''
                  }],`}
                </Typography>
                <Typography className={classes.alinea3}>{'}'}</Typography>
                <Typography className={classes.alinea2}>{'});'}</Typography>
                <Typography className={classes.alinea}>
                  {'</script>'}
                </Typography>
                <Typography className={classes.alinea}>
                  {'<div id="bsport-widget"/>'}
                </Typography>
                <Typography>
                  {
                    // eslint-disable-next-line
                    "</div>' />"
                  }
                </Typography>
              </div>
            )}
          </DialogContentText>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleChangeChecked}
                  name="checkedA"
                />
              }
              label={t('widget.ownStyle')}
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenCode(false);
              setWidgetChoice('');
            }}
            autoFocus
          >
            {t('widget.return')}
          </Button>
          <Button color="primary" onClick={() => setOpenIframe(true)} autoFocus>
            {t('widget.show')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog aria-labelledby="simple-dialog-title" open={openUrl}>
        <DialogTitle id="simple-dialog-title">{t('widget.url')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <a
              target="blank"
              href={`https://backoffice.bsport.io/m/${props.companyName}/${
                props.companyId
              }/${
                props.activities
                  ? `?f_metaActivities=[${props.activities}]`
                  : ''
              }${props.coaches ? `&f_coaches=[${props.coaches}]` : ''}${
                props.establishments
                  ? `&f_establishments=[${props.establishments}]`
                  : ''
              }${props.levels ? `&f_levels=[${props.levels}]` : ''}`}
            >
              <Typography>
                {`https://backoffice.bsport.io/m/${props.companyName}/${
                  props.companyId
                }/${
                  props.activities
                    ? `?f_metaActivities=[${props.activities}]`
                    : ''
                }${props.coaches ? `&f_coaches=[${props.coaches}]` : ''}${
                  props.establishments
                    ? `&f_establishments=[${props.establishments}]`
                    : ''
                }${props.levels ? `&f_levels=[${props.levels}]` : ''}`}
              </Typography>
            </a>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenUrl(false);
              setWidgetChoice('');
            }}
          >
            {t('widget.return')}
          </Button>
          <CopyToClipboard
            text={`https://backoffice.bsport.io/m/${props.companyName}/${
              props.companyId
            }/?f_metaActivities=[${
              props.activities ? props.activities : ''
            }]&f_coaches=[${
              props.coaches ? props.coaches : ''
            }]&f_establishments=[${
              props.establishments ? props.establishments : ''
            }]&f_levels=[${props.levels ? props.levels : ''}]`}
          >
            <Button
              color="primary"
              onClick={() => props.snackbarSuccess('link.copied')}
            >
              {t('widget.copy')}
            </Button>
          </CopyToClipboard>
        </DialogActions>
      </Dialog>
      <Dialog aria-labelledby="simple-dialog-title" open={openIframe}>
        <DialogTitle id="simple-dialog-title">
          {t('widget.visualisation')}
        </DialogTitle>
        <DialogContent>
          <iframe
            title="iframe"
            id="myFrame"
            width="530"
            height="600"
            srcDoc={`<div>
            <div id='bsport-widget'/>

            <script src='https://${Config.REACT_APP_CDN_DOMAIN}/scripts/widget'></script>
            <script>
            BsportWidget.mount({
              parentElement: "bsport-widget",
              compactMode: ${compactMode},
              companyId: ${props.companyId},
              widgetType: "${props.widgetType}",
              lang: "${language}",
              defaultFilters:{
                coaches:[${props.coaches ? props.coaches : ''}],
                establishments:[${
                  props.establishments ? props.establishments : ''
                }],
                levels:[${props.levels ? props.levels : ''}],
                metaActivities:[${props.activities ? props.activities : ''}],
              }
                });
                </script>
                </div>`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenIframe(false)}>
            {t('widget.return')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  displayType: {
    display: 'flex',
    flexDirection: 'column',
  },
  code: {
    paddingLeft: theme.spacing(5),
  },
  solid: {
    borderTop: '1px solid #bbb',
  },
  root: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  alinea: {
    paddingLeft: '20px',
  },
  alinea2: {
    paddingLeft: '40px',
  },
  alinea3: {
    paddingLeft: '60px',
  },
  alinea4: {
    paddingLeft: '80px',
  },
}));

export default compose(
  connect(
    (state) => ({
      companyId: state.theme.theme.company,
      companyName: state.theme.theme.company_name
        .replace(/\//g, '-')
        .replace(/'/g, ''),
    }),
    { snackbarSuccess },
  ),
)(WidgetButton);
