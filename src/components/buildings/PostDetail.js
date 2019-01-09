import React from 'react';
import { View, Text, WebView, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { brandPrimary } from '../../config/variables';

class PostDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isReady: false,
      expanded: false,
      animation: new Animated.Value(250)
    }
  }
  _setMaxHeight(event) {
    this.setState({
      maxHeight: event.nativeEvent.layout.height + 60
    })
  }
  onMorePress() {
    let HEADER_MIN_HEIGHT = 250

    let initialValue = this.state.expanded ? this.state.maxHeight : HEADER_MIN_HEIGHT,
      finalValue = !this.state.expanded ? this.state.maxHeight : HEADER_MIN_HEIGHT

    this.setState({
      expanded: !this.state.expanded  //Step 2
    })

    this.state.animation.setValue(initialValue)
    Animated.timing(
      this.state.animation,
      {
        toValue: finalValue,
        duration: 300,
      }
    ).start()

  }
  render() {
    return (
      <Animated.View style={{ height: this.state.animation, overflow: 'hidden', position: 'relative' }}>
        <View ref='refContainer' onLayout={this._setMaxHeight.bind(this)}>
          <View style={styles.paragraph}><Text style={styles.text}>{this.props.description}</Text></View>
          <WebView source={{ html: `${this.props.content}` }} />
        </View>
        <TouchableOpacity style={{ position: 'absolute', bottom: 0, width: '100%', alignSelf: 'center' }}
          onPress={() => { this.onMorePress() }}>
          <LinearGradient style={{ paddingTop: 40, paddingBottom: 10 }} colors={['rgba(255,255,255,0.7)', '#fff']}>
            <Text style={[styles.buttonText, { fontSize: 18, fontWeight: '700' }]}>{!this.state.expanded ? 'Xem thêm' : 'Ẩn tin'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    )
  }
};

const styles = StyleSheet.create({
  buttonText: {
    color: brandPrimary,
    textAlign: 'center'
  },
  paragraph: {
    marginBottom: 20,
  },
  text: {
    marginBottom: 10,
    color: '#666666',
    lineHeight: 25,
  },
});

export default PostDetail;
