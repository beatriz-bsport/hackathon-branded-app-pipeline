import React from 'react';
import TitleIcon from '@material-ui/icons/Title';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ShortTextIcon from '@material-ui/icons/ShortText';
import NotesIcon from '@material-ui/icons/Notes';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import {
  CUSTOM_FORM_FIELD_TITLE_OPTION,
  CUSTOM_FORM_FIELD_PARAGRAPH_OPTION,
  CUSTOM_FORM_FIELD_SHORT_ANSWER_OPTION,
  CUSTOM_FORM_FIELD_LONG_ANSWER_OPTION,
  CUSTOM_FORM_FIELD_RADIO_OPTION,
  CUSTOM_FORM_FIELD_CHECHBOX_OPTION,
  CUSTOM_FORM_FIELD_SELECT_OPTION,
  CUSTOM_FORM_FIELD_SIGNATURE_OPTION,
  CUSTOM_FORM_FIELD_FILE_OPTION,
  CUSTOM_FORM_FIELD_SIGNUP_QUESTION_OPTION,
} from '@bsport/common/lib/master-data/custom-form';

import { CUSTOM_FORM_FIELD_LOCATION_OPTION } from '../utils';

type Props = {
  field_id: number;
  fontSize: string;
};
export function FieldIcon(props: Props) {
  switch (props.field_id) {
    case CUSTOM_FORM_FIELD_TITLE_OPTION:
      return <TitleIcon {...props} />;
    case CUSTOM_FORM_FIELD_PARAGRAPH_OPTION:
      return <TextFieldsIcon {...props} />;
    case CUSTOM_FORM_FIELD_SHORT_ANSWER_OPTION:
      return <ShortTextIcon {...props} />;
    case CUSTOM_FORM_FIELD_LONG_ANSWER_OPTION:
      return <NotesIcon {...props} />;
    case CUSTOM_FORM_FIELD_RADIO_OPTION:
      return <RadioButtonCheckedIcon {...props} />;
    case CUSTOM_FORM_FIELD_CHECHBOX_OPTION:
      return <CheckBoxIcon {...props} />;
    case CUSTOM_FORM_FIELD_SELECT_OPTION:
      return <ArrowDropDownCircleIcon {...props} />;
    case CUSTOM_FORM_FIELD_SIGNATURE_OPTION:
      return <BorderColorIcon {...props} />;
    case CUSTOM_FORM_FIELD_FILE_OPTION:
      return <CloudUploadIcon {...props} />;
    case CUSTOM_FORM_FIELD_SIGNUP_QUESTION_OPTION:
      return <HelpOutlineIcon {...props} />;
    case CUSTOM_FORM_FIELD_LOCATION_OPTION:
      return <LocationCityIcon {...props} />;
    default:
      return <div />;
  }
}

export default FieldIcon;
