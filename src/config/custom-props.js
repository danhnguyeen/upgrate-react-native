import { 
  setCustomText,
  setCustomTextInput
} from 'react-native-global-props';
import { fontSize, inputFontSize, textColor, fontFamily } from './variables';

const customTextProps = {
  style: {
    fontSize,
    // lineHeight: fontSize * 1.44,
    // letterSpacing: 0.4,
    color: textColor,
    fontFamily
  }
};

const customTextInputProps = {
  style: {
    fontFamily,
    fontSize: inputFontSize
  }
};

setCustomText(customTextProps);
setCustomTextInput(customTextInputProps);

