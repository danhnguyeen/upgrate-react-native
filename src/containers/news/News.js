import React from 'react';
import { connect } from 'react-redux';
import * as actions from './news-actions';
import { Image, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, View, Alert, Text } from 'react-native'
import i18n from '../../i18n';
import {
  DEVICE_WIDTH, shadow, backgroundColor, brandPrimary, brandLight,
  fontSize, textH4, textDarkColor, textLightColor,
} from '../../config/variables';
import FastImage from 'react-native-fast-image'
const marginHorizontal = 15;
const itemHeight = 185
const itemWidth = (DEVICE_WIDTH - (marginHorizontal * 2));
const itemWidthHor = itemWidth * 0.9;

class News extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }
  componentDidMount() {
    this._onRefresh();
  }
  _onRefresh = async () => {
    try {
      this.setState({ refreshing: true });
      await this.props._onfetchNews().catch(error => Alert.alert(i18n.t('global.error'), error.message))
      this.setState({ refreshing: false });
    } catch (error) {
      this.setState({ refreshing: false });
    }
  }
  showDetails = (selectedItem) => {
    this.setState({ selectedItem });
    this.props.navigation.navigate('ModalNews', { dataProps: { newsDetail: selectedItem } })
  }
  closeModalDetails = () => {
    this.setState({ selectedItem: null });
  }
  renderSpecialNews = () => this.props.specialNews.map((item, index) =>
    <TouchableOpacity activeOpacity={1} key={index} onPress={() => this.showDetails(item)}>
      <View style={[styles.tagNewsHor, shadow, { width: itemWidthHor, minHeight: 280 }]}>
        <View style={{ overflow: 'hidden', borderTopRightRadius: 3, borderTopLeftRadius: 3 }}>
          <FastImage resizeMode='cover'
            source={{ uri: item.image, priority: FastImage.priority.high }}
            style={{ width: itemWidthHor, height: 120 }} />
        </View>
        <View style={{ padding: 15 }}>
          <Text numberOfLines={1} style={styles.time}>{item.public_date}</Text>
          <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
          <Text numberOfLines={3} style={styles.content}>{item.content}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
  render() {
    return (
      <View style={styles.container}>
        <ScrollView horizontal={false}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}>
          {this.props.specialNews.length > 0 &&
            <View style={{ paddingVertical: 15 }} >
              <Text style={{ paddingHorizontal: 15, color: brandPrimary, fontWeight: 'bold', fontSize: 18 }}>{i18n.t('news.specialNews')}</Text>
              <ScrollView horizontal
                showsHorizontalScrollIndicator={false}
                ref={ref => { this.renderSpecialNewsScroll = ref }} >
                <View style={{ paddingHorizontal: 10, flexDirection: 'row' }} >
                  {this.renderSpecialNews()}
                </View>
              </ScrollView>
            </View>
          }
          {this.props.news.length > 0 &&
            <View style={{ paddingHorizontal: 15 }} >
              <Text style={{ color: brandPrimary, fontWeight: 'bold', fontSize: 18, marginBottom: 5  }}>{i18n.t('news.news')}</Text>
              {this.props.news.map((item, index) =>
                <TouchableOpacity activeOpacity={1} key={index} onPress={() => this.showDetails(item)}>
                  <View style={[styles.tagNewsVer, shadow]}>
                    <View style={{ flex: 1, overflow: 'hidden', borderTopRightRadius: 3, borderTopLeftRadius: 3 }}>
                      <FastImage resizeMode='cover' style={{ width: '100%', height: itemHeight }}
                        source={{ uri: item.image, priority: FastImage.priority.high }} />
                    </View>
                    <View style={{ padding: 10 }} >
                      <Text numberOfLines={1} style={styles.time} >{item.public_date} </Text>
                      <Text numberOfLines={3} style={styles.title}>{item.title}</Text>
                      <Text numberOfLines={3} style={styles.content}>{item.content}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          }
        </ScrollView>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor
  },
  time: {
    color: textLightColor,
    fontSize: 12,
    lineHeight: 18,
  },
  title: {
    color: brandPrimary,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '700',
  },
  content: {
    color: textDarkColor,
    fontSize: 16,
    lineHeight: 21,
  },
  tagNewsHor: {
    ...shadow,
    backgroundColor: brandLight,
    borderRadius: 3,
    marginHorizontal: 5,
    marginVertical: 10,
  },
  tagNewsVer: {
    ...shadow,
    backgroundColor: brandLight,
    borderRadius: 3,
    marginTop: 5,
    marginBottom: 10,
  }
});

const mapStateToProps = state => ({
  news: state.news.news,
  specialNews: state.news.specialNews,
})

const mapDispatchToProps = dispatch => ({
  _onfetchNews: () => dispatch(actions.fetchNews())
})

export default connect(mapStateToProps, mapDispatchToProps)(News)
