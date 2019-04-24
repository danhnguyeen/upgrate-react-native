import React, { Component } from 'react';
import { TextField } from 'react-native-material-textfield';

import { brandPrimary, fontSize } from '../../config/variables';

class TextInputUnderline extends Component {
    state = {
        borderColor: '#cfd5db'
    }
    render() {
        let value = '';
        if (this.props.value !== null && this.props.value !== undefined) {
            value = this.props.value;
        }
        return (
            <TextField
                label={this.props.label}
                tintColor={brandPrimary}
                onLayout={this.props.getLayout}
                fontSize={fontSize + 2}
                labelFontSize={fontSize - 2}
                error={this.props.inValid ? this.props.errorMessage : null}
                {...this.props}
                value={value}
            />
        );
    }
};

export default TextInputUnderline;