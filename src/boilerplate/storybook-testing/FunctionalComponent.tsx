import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';

const PHONE_LENGTH = 10

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    submitButton: {
        borderRadius: 8,
        height: 48,
        background: '#32a89d',
        marginTop: 8,
        '&:hover': {
            background: '#2c7a73'
        }
    },
    circular: {
        marginRight: 8
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        width: 408,
        [theme.breakpoints.down('xs')]: {
            width: '100%',
        },
    },
    message: {
        marginLeft: theme.spacing(2.5),
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    }
}));

export type Props = {
    loading: boolean;
}

const FunctionalComponent: React.FC<Props> = ({ loading }) => {
    const classes = useStyles();
    const { t } = useTranslation('booking');
    const [firstName, setFirstName] = React.useState('')
    const [lastName, setLastName] = React.useState('')
    const [phone, setPhone] = React.useState('')
    const [error, setError] = React.useState(false)
    const [success, setSuccess] = React.useState(false)

    const handleClick = () => {
        setError(phone.length !== PHONE_LENGTH)
        if (phone.length === PHONE_LENGTH) {
            setSuccess(true)
        }
    }

    return (
        <div className={classes.container}>
            <form className={classes.column} data-testid="functional-component-form">
                <TextField
                    id="firstname-field"
                    label="Firstname"
                    name="boilerplate"
                    value={firstName}
                    disabled={loading}
                    onChange={(ev) => {
                        setFirstName(ev.target.value)
                        setSuccess(false)
                    }
                    }
                    fullWidth
                />
                <TextField
                    id="lastname-field"
                    label="Lastname"
                    name="boilerplate"
                    value={lastName}
                    disabled={loading}
                    onChange={(ev) => {
                        setLastName(ev.target.value)
                        setSuccess(false)
                    }
                    }
                    fullWidth
                />
                <TextField
                    id="phone-field"
                    label="Phone"
                    name="boilerplate"
                    disabled={loading}
                    fullWidth
                    value={phone}
                    onChange={(ev) => {
                        setPhone(ev.target.value)
                        setError(false)
                        setSuccess(false)
                    }
                    }
                    error={error}
                />
                {error && (
                    <div
                        className={classes.message}
                        id='error-msg'
                    >
                        <Typography id='text-error-msg' color="error" variant="body2">
                            Invalid phone number
                        </Typography>
                    </div>
                )}
                <Button
                    onClick={handleClick}
                    className={classes.submitButton}
                    disabled={loading || error}
                    variant="contained"
                    id="btn-submit"
                >
                    {!!loading && (
                        <CircularProgress
                            size={24}
                            color="inherit"
                        />
                    )}
                    {t('notification.form.submit')}
                </Button>
                {success && (
                    <div
                        className={classes.message}
                        id='success-msg'
                    >
                        <Typography color="primary" variant="body2">
                            Successfully submited
                        </Typography>
                    </div>
                )}
            </form>
        </div>
    )
}

export default FunctionalComponent