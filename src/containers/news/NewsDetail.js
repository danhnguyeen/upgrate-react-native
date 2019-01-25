

import React from 'react'
import { TouchableOpacity, View, WebView } from 'react-native'
import { Icon, } from "native-base"
import { Spinner } from '../../components/common';
import { backgroundColor, inverseTextColor } from '../../config/variables';

class NewsDetail extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack(null)}
          style={{ paddingHorizontal: 10, alignItems: 'center' }}>
          <Icon
            name={"ios-arrow-back"}
            underlayColor='transparent'
            style={{ color: inverseTextColor, fontSize: 34 }}
          />
        </TouchableOpacity>
      )
    }
  }
  render() {
    const { newsDetail } = this.props.navigation.getParam('dataProps')
    return (
      <View style={{ flex: 1, backgroundColor: backgroundColor }}>
        {newsDetail.url &&
          <WebView
            source={{ cache: 'force-cache', uri: newsDetail.url }}
            renderLoading={() => { return (<Spinner />) }}
            startInLoadingState
            style={{ flex: 1 }}
          />
        }
      </View>
    )
  }
}
export default NewsDetail