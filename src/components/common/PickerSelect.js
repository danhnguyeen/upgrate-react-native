import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { Icon } from 'native-base';
import Picker from 'react-native-picker';

import i18n from '../../i18n';
import { brandPrimary, fontSize, textLightColor } from '../../config/variables';

class PickerSelect extends Component {
  state = {
    inputValue: '',
    keyName: this.props.keyName ? this.props.keyName : 'name',
    keyId: this.props.keyId ? this.props.keyId : 'id',
    selectedValue: ''
  }
  componentDidUpdate(prevProps) {
    if ((this.props.data && prevProps.data && prevProps.data.length !== this.props.data.length)
      || this.props.value !== prevProps.value) {
      this.initInputValue();
    }
  }
  initInputValue = () => {
    if (this.props.value && this.props.data) {
      const keyName = this.state.keyName;
      const data = this.props.data.find(item => item[this.state.keyId] === this.props.value);
      if (data) {
        this.setState({ inputValue: data[keyName], selectedValue: data[keyName] });
      }
    }
  }
  _createData() {
    console.log(this.props.data)
    let data = this.props.data.map(item => item[this.state.keyName]);
    console.log(data);
    return data;
  }
  _showDatePicker = () => {
    Picker.init({
      pickerData: this._createData(),
      pickerTitleText: '',
      pickerConfirmBtnText: i18n.t('global.confirm'),
      pickerCancelBtnText: i18n.t('global.cancel'),
      pickerTitleColor: [7, 47, 106, 1],
      selectedValue: [this.state.selectedValue],
      // pickerFontColor: [255, 0, 0, 1],
      // pickerBg: [246, 248, 250, 1],
      onPickerConfirm: (pickedValue, pickedIndex) => {
        const data = this.props.data[pickedIndex];
        console.log(data)
        this.props.onChange(data[this.state.keyId]);
        console.log('date', pickedValue, pickedIndex);
      },
      // onPickerCancel: (pickedValue, pickedIndex) => {
      //   console.log('date', pickedValue, pickedIndex);
      // },
      onPickerSelect: (pickedValue, pickedIndex) => {
        console.log('date', pickedValue, pickedIndex);
      }
    });
    Picker.show();
  }
  _toggle() {
    Picker.toggle();
  }

  _isPickerShow() {
    Picker.isPickerShow(status => {
      alert(status);
    });
  }
  render() {
    let value = '';
    if (this.props.value !== null && this.props.value !== undefined) {
      value = this.props.value;
    }
    return (
      <TouchableOpacity onPress={this._showDatePicker}>
        <View pointerEvents="none">
          <TextField
            label={this.props.label}
            tintColor={brandPrimary}
            fontSize={fontSize + 2}
            labelFontSize={fontSize - 2}
            labelTextStyle={{ paddingRight: 32 }}
            inputContainerStyle={{ paddingRight: 32 }}
            {...this.props}
            value={this.state.inputValue}
          />
          <Icon
            style={{
              position: 'absolute',
              top: 34,
              right: 15,
              color: textLightColor,
              fontSize: 28
            }}
            name={'md-arrow-dropdown'}
            type={'Ionicons'}
          />
        </View>
      </TouchableOpacity>
    );
  }
};

export default PickerSelect;