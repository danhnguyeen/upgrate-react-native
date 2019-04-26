/* eslint-disable no-extend-native,no-param-reassign,no-cond-assign,radix,max-len,no-confusing-arrow */
import { StyleSheet } from 'react-native';
import i18n from '../i18n';
import moment from 'moment';

export const updateObject = (oldObject, updatedProperties) => ({
    ...oldObject,
    ...updatedProperties
  });
export const gender = (gender) => {
  if (gender === 0) {
    return i18n.t('register.female');
  }
  if (gender === 1) {
    return i18n.t('register.male');
  }
};

export const loadingColors = ['green', 'red', 'yellow', 'gray'];

export const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const regex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
  return regex.test(phone);
};

export const checkValidity = (value, rules, formData = null) => {
  let isValid = true;
  if (!rules) {
      return true;
  }

  if (rules.required) {
      isValid = value !== null && value !== undefined && value.toString().trim() !== '' && isValid;
  }

  if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
  }

  if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
  }

  if (value && rules.isEmail) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      isValid = re.test(String(value).toLowerCase()) && isValid;
  }

  if (value && rules.isPhone) {
      const pattern = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
      isValid = pattern.test(value) && isValid;
  }

  if (value && rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
  }

  if (rules.isEqualTo) {
    isValid = value === formData[rules.isEqualTo].value && isValid;
  }

  return isValid;
};

export const validateForm = (form) => {
  let formIsValid = true;
  for (var key in form) {
    if (form.hasOwnProperty(key)) {
      form[key].inValid = !checkValidity(form[key].value, form[key].validation, form);
      if (form[key].inValid) {
        formIsValid = false;
      }
    }
  }
  return { formIsValid, form };
};

export const encodeURI = (params) => {
  return Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&');
}
// format date
export const formatDateTime = (time) => {
  return time ? moment(time).format('HH:mm:ss DD/MM/YYYY') : null;
}
/**
 * Calculator width, height, margin of item in grid view
 *
 * @returns {{width: number, height: number, margin: number}}
 */
export const calculatorItemSize = (deviceWidth, deviceHeight) => {
  // default value item
  const size = {
    width: 199,
    height: 350,
    margin: 0,
  };
  // get width item by on device width
  const checkWidth = deviceWidth * 0.48;
  if (checkWidth < size.width) {
    // case small screen set width height by % width screen
    size.width = checkWidth;
    size.height = deviceHeight * 0.59;
  }
  // calculator margin
  // get padding of scroll view
  const paddingScrollView = 2;
  // count max item on one row
  const maxItemOnRow = Math.floor((deviceWidth - paddingScrollView) / size.width);
  // calculator sum margin on screen
  const sumMargin = ((deviceWidth - paddingScrollView) - (size.width * maxItemOnRow));
  // calculator margin for one item (marginLeft, marginRight)
  const marginItem = (sumMargin / maxItemOnRow) / 2;
  if (marginItem > 1) {
    size.margin = Math.floor(marginItem);
  }
  return size;
};

/**
 * Format number to price of VN
 * @param price
 * @returns {string}
 */
export const formatPrice = price => {
  Number.prototype.formatMoney = function (c, d, t) {
    let n = this;
    c = isNaN(c = Math.abs(c)) ? 2 : c;
    d = d === undefined ? '.' : d;
    t = t === undefined ? ',' : t;
    const s = n < 0 ? '-' : '';
    const i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c)));
    let j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
  };
  return (`${price.formatMoney(0, '.', ',')} đ`);
};

/**
 * Update new object for popup (Handle show and hide action)
 *
 * @param name
 * @param oldObject
 * @param dataNew
 * @returns {*}
 */
export const updateObjectPopup = (name, oldObject, dataNew) => {
  const newObject = {};
  newObject[name] = dataNew;
  return updateObject(oldObject, newObject);
};

/**
 * Handle show popup
 *
 * @param name
 * @param oldObject
 * @param dataNew
 * @returns {{}}
 */
export const handleShowPopup = (name, oldObject, dataNew) => {
  const obj = {};
  // update show object
  obj.updateShowObjectNew = updateObjectPopup(name, oldObject.show, true);
  // update data popup
  obj.updateDataObjectNew = updateObjectPopup(name, oldObject.data, dataNew);
  return obj;
};

/**
 * Handel close popup
 *
 * @param name
 * @param oldObject
 * @returns {{}}
 */
export const handleClosePopup = (name, oldObject) => {
  const obj = {};
  // update show object
  obj.updateShowObjectNew = updateObjectPopup(name, oldObject.show, false);
  // update data popup
  obj.updateDataObjectNew = updateObjectPopup(name, oldObject.data, {});
  return obj;
};

export const getListMarginBottom = isConnected => isConnected ? styles.marginBottom50 : styles.marginBottom105;

const styles = StyleSheet.create({
  marginBottom105: {
    marginBottom: 105,
  },
  marginBottom50: {
    marginBottom: 50,
  },
});

export const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
