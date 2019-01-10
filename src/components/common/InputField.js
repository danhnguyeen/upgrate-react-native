import React, { Component } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Icon } from 'native-base';

const TEXTCOLOR = '#575757'
export default class InputField extends Component {
  static defaultProps = {
    focus: () => { },
    style: {},
    styleContainer: {},
    placeholder: '',
    blurOnSubmit: false,
    returnKeyType: 'next',
    error: false,
    keyboardType: null,
    secureTextEntry: false,
    autoCapitalize: "none",
    editable: true
  }

  state = { text: '' }
  getInputValue = () => this.state.text
  render() {
    return (
      <View style={[
        stylesInputField.input,
        this.props.error ? stylesInputField.containerError : {},
        this.props.noBorder ? { borderBottomWidth: 0, paddingBottom: 10, } : {},
        this.props.styleContainer
      ]}>
        <Icon style={[stylesInputField.icon]} name={this.props.icon} type="Ionicons" />
        <TextInput
          editable={this.props.disabled ? false : true}
          style={stylesInputField.text}
          value={this.state.text}
          selectionColor={TEXTCOLOR}
          autoCapitalize={this.props.autoCapitalize}
          ref={ref => { this.input = ref }}
          autoCorrect={false}
          underlineColorAndroid='transparent'
          secureTextEntry={this.props.secureTextEntry}
          blurOnSubmit={this.props.blurOnSubmit}
          keyboardType={this.props.keyboardType}
          returnKeyType={this.props.returnKeyType}
          placeholder={this.props.placeholder}
          onSubmitEditing={this.props.focus(this.props.placeholder)}
          placeholderTextColor={TEXTCOLOR}
          onChangeText={(text) => this.setState({ text })}
        />
        {this.props.error && <Icon style={[stylesInputField.icon]} name='md-close' type="Ionicons" />}
      </View>
    )
  }
}
const stylesInputField = StyleSheet.create({
  input: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: 'rgba(0,0,0,0.5)',
    borderBottomWidth: 0.5,
    marginVertical: 5,
    marginHorizontal: 15
  },
  icon: {
    color: TEXTCOLOR,
    fontSize: 20,
    width: 40,
    lineHeight: 46,
    paddingHorizontal: 10,
  },
  text: {
    color: TEXTCOLOR,
    flex: 1,
    fontSize: 16,
  },
  containerError: {
    // backgroundColor: '#EF9A9A',
    borderWidth: 1,
    borderColor: '#E57373',
    borderBottomColor: '#E57373',
    borderBottomWidth: 1,
  }
})
