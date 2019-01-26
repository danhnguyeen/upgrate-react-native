import React, { Component } from 'react';
import { View, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { Icon } from 'native-base';
import Picker from 'react-native-picker';

import i18n from '../../i18n';
import { brandPrimary, fontSize, textLightColor, DEVICE_WIDTH, DEVICE_HEIGTH, platform } from '../../config/variables';

class PickerSelect extends Component {
  state = {
    inputValue: '',
    keyName: this.props.keyName ? this.props.keyName : 'name',
    keyId: this.props.keyId ? this.props.keyId : 'id',
    selectedValue: '',
    isPickerShowing: false
  }
  componentDidUpdate(prevProps) {
    if ((this.props.data && prevProps.data && prevProps.data.length !== this.props.data.length)
      || this.props.value !== prevProps.value) {
      this.initInputValue();
    }
  }
  initInputValue = () => {
    if (this.props.data) {
      const keyName = this.state.keyName;
      const value = this.props.isObject ? this.props.value[this.state.keyId] : this.props.value;
      const data = this.props.data.find(item => item[this.state.keyId] === value);
      if (data) {
        this.setState({ inputValue: data[keyName], selectedValue: data[keyName] });
      } else {
        this.setState({ inputValue: '', selectedValue: '' })
      }
    }
  }
  _createData() {
    let data = this.props.data.map(item => item[this.state.keyName]);
    if (!data.length) {
      data = [''];
    }
    return data;
  }
  showPicker = () => {
    this.setState({ isPickerShowing: true });
  }
  hidePicker = () => {
    this.setState({ isPickerShowing: false });
    Picker.hide();
  }
  _showDatePicker = () => {
    Picker.init({
      pickerData: this._createData(),
      pickerTitleText: '',
      pickerTextEllipsisLen: 20,
      pickerFontFamily: platform === 'android' ? 'Roboto-Regular' : null,
      pickerFontSize: 18,
      pickerConfirmBtnText: i18n.t('global.confirm'),
      pickerCancelBtnText: i18n.t('global.cancel'),
      pickerTitleColor: [7, 47, 106, 1],
      selectedValue: [this.state.selectedValue],
      onPickerConfirm: (pickedValue, pickedIndex) => {
        const data = this.props.data[pickedIndex];
        this.props.onChange(this.props.isObject ? data : data[this.state.keyId]);
        this.hidePicker();
      },
      onPickerCancel: () => {
        this.hidePicker();
      }
    });
    Picker.show();
  }
  render() {
    return (
      <View>
        {this.state.isPickerShowing ?
          <Modal
            style={{
              justifyContent: "flex-end",
              flex: 1,
              paddingTop: 55,
            }}
            transparent={true}
            animationTiming={1}
            isVisible={this.state.isPickerShowing}
            onRequestClose={this.hidePicker}
            onBackdropPress={this.hidePicker}
            onBackButtonPress={this.hidePicker}
            onDismiss={this.hidePicker}
            onShow={this._showDatePicker}
          >
            <TouchableWithoutFeedback style={{ flex: 1 }} onPress={this.hidePicker}>
              <View style={{ flex: 1, backgroundColor: '#000', opacity: 0.3, width: DEVICE_WIDTH, height: DEVICE_HEIGTH, zIndex: 1 }} />
            </TouchableWithoutFeedback>
          </Modal>
          : null
        }
        <TouchableOpacity onPress={this.showPicker}>
          <View pointerEvents="none">
            <TextField
              label={this.props.label}
              tintColor={brandPrimary}
              fontSize={fontSize + 2}
              labelFontSize={fontSize - 2}
              labelTextStyle={{ paddingRight: 35 }}
              inputContainerStyle={{ paddingRight: 35 }}
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
      </View>
    );
  }
};

export default PickerSelect;