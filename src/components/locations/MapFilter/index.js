'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  StyleSheet,
  LayoutAnimation
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

class DropdownMenu extends Component {
  constructor(props, context) {
    super(props, context);
    let dataFilter = [];
    dataFilter.push([{ district_name: 'Quận : Tất cả' }, ...this.props.districts]);
    let selectIndex = new Array(dataFilter.length);
    for (let i = 0; i < selectIndex.length; i++) {
      selectIndex[i] = 0;
    }
    this.state = {
      activityIndex: -1,
      selectIndex: selectIndex,
      rotationAnims: dataFilter.map(() => new Animated.Value(0)),
      dataFilter: dataFilter
    };

    this.defaultConfig = {
      bgColor: 'grey',
      tintColor: '#333333',
      activityTintColor: "red",
      arrowImg: require('./img/dropdown_arrow.png'),
      checkImage: require('./img/menu_check.png')
    };

  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.districts.length !== this.props.districts.length) {
      this.setState({ dataFilter: [[{ district_name: 'Quận : Tất cả' }, ...nextProps.districts]] })
    }
  }
  renderCheck(index, title) {
    let activityIndex = this.state.activityIndex;
    if (this.state.selectIndex[activityIndex] === index) {
      let checkImage = this.props.checkImage ? this.props.checkImage : this.defaultConfig.checkImage;
      return (
        <View style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: "center",
          paddingHorizontal: 15,
          flexDirection: 'row'
        }}>
          <Text
            style={[
              styles.item_text_style,
              this.props.optionTextStyle,
              {color: this.props.activityTintColor ? this.props.activityTintColor : this.defaultConfig.activityTintColor}
            ]}>
            {title.district_name}
          </Text>
          <Image
            source={checkImage}
            style={{tintColor: this.props.activityTintColor ? this.props.activityTintColor : this.defaultConfig.activityTintColor}}/>
        </View>
      );
    } else {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: "center",
          paddingHorizontal: 15,
          flexDirection: 'row'
        }}>
          <Text style={[
            styles.item_text_style,
            this.props.optionTextStyle,
            {color: this.props.tintColor ? this.props.tintColor : this.defaultConfig.tintColor}
          ]}>{title.district_name}</Text>
        </View>
      );
    }
  }

  renderActivityPanel() {
    if (this.state.activityIndex >= 0) {

      let currentTitles = this.state.dataFilter[this.state.activityIndex];

      let heightStyle = {};
      if (this.props.maxHeight && this.props.maxHeight < currentTitles.length * 44) {
        heightStyle.height = this.props.maxHeight;
      }

      return (
        <View style={{position: 'absolute', left: 20, right: 20, top: 40, bottom: 0}}>
          <ScrollView
            style={[{position: 'absolute', top: 12, left: 0, right: 0, backgroundColor: 'white', borderRadius: 5}, heightStyle]}>
            {
              currentTitles.map((title, index) =>
                <TouchableOpacity key={index} activeOpacity={1} style={{flex: 1, height: 44}}
                                  onPress={this.itemOnPress.bind(this, index)}>
                  {this.renderCheck(index, title)}
                  <View style={{backgroundColor: '#F6F6F6', height: 1, marginHorizontal: 15}}/>
                </TouchableOpacity>
              )
            }
          </ScrollView>
        </View>
      );
    } else {
      return (<View></View>);
    }
  }

  openOrClosePanel(index) {

    this.props.bannerAction ? this.props.bannerAction() : null;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    // var toValue = 0.5;
    if (this.state.activityIndex === index) {
      this.closePanel(index);
      this.setState({
        activityIndex: -1,
      });
      // toValue = 0;
    } else {
      if (this.state.activityIndex > -1) {
        this.closePanel(this.state.activityIndex);
      }
      this.openPanel(index);
      this.setState({
        activityIndex: index,
      });
      // toValue = 0.5;
    }
  }

  openPanel(index) {
    Animated.timing(
      this.state.rotationAnims[index],
      {
        toValue: 0.5,
        duration: 300,
        easing: Easing.linear
      }
    ).start();
  }

  closePanel(index) {
    Animated.timing(
      this.state.rotationAnims[index],
      {
        toValue: 0,
        duration: 300,
        easing: Easing.linear
      }
    ).start();
  }

  itemOnPress(index) {
    if (this.state.activityIndex > -1) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
      let selectIndex = this.state.selectIndex;
      selectIndex[this.state.activityIndex] = index;
      this.setState({
        selectIndex: selectIndex
      });
      if (this.props.handler) {
        this.props.handler(this.state.activityIndex, this.props.districts[index - 1], this.state.dataFilter);
      }
    }
    this.openOrClosePanel(this.state.activityIndex);
  }

  renderDropDownArrow(index) {
    let icon = this.props.arrowImg ? this.props.arrowImg : this.defaultConfig.arrowImg;
    return (
      <Animated.Image
        source={icon}
        style={{
          width: 10,
          height: 6,
          tintColor: (index === this.state.activityIndex) ? (this.props.activityTintColor ? this.props.activityTintColor : this.defaultConfig.activityTintColor) : (this.props.tintColor ? this.props.tintColor : this.defaultConfig.tintColor),
          transform: [{
            rotateZ: this.state.rotationAnims[index].interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg']
            })
          }]
        }}/>
    );
  }

  render() {
    return (
      <View style={{flexDirection: 'column', flex: 1, paddingTop: 5, paddingHorizontal: 20 }}>
        <View style={{
          flexDirection: 'row',
          borderRadius: 5,
          borderWidth: 0.5,
          borderColor: '#d4d4d6',
          backgroundColor: this.props.bgColor ? this.props.bgColor : this.defaultConfig.bgColor
        }}>
          {
            this.state.dataFilter.map((rows, index) =>
              <TouchableOpacity
                activeOpacity={1}
                onPress={this.openOrClosePanel.bind(this, index)}
                key={index}
                style={{flexDirection: 'row', flex: 1, height: 44, alignItems: "center", justifyContent: "space-between", paddingLeft: 15, paddingRight: 18}}>
                <View style={{ alignItems: "center", justifyContent: "space-between" }}>
                  <Text
                    style={[
                      styles.title_style,
                      this.props.titleStyle,
                      {
                        color: (index === this.state.activityIndex) ?
                          (this.props.activityTintColor ? this.props.activityTintColor : this.defaultConfig.activityTintColor)
                          :
                          (this.props.tintColor ? this.props.tintColor : this.defaultConfig.tintColor)
                      }
                    ]}>
                    {rows[this.state.selectIndex[index]] ? rows[this.state.selectIndex[index]].district_name : ''}
                  </Text>
                </View>
                {this.renderDropDownArrow(index)}
              </TouchableOpacity>
            )}
        </View>
        {this.props.children}

        {this.renderActivityPanel()}

      </View>
    );
  }
}

DropdownMenu.propTypes = {
  bgColorbgColor: PropTypes.string,
  tintColor: PropTypes.string,
  activityTintColor: PropTypes.string,
  arrowImg: PropTypes.number,
  checkImage: PropTypes.number,
  bannerAction: PropTypes.func,
  optionTextStyle: PropTypes.object,
  titleStyle: PropTypes.object,
  maxHeight: PropTypes.number
};

const styles = StyleSheet.create({
  title_style: {
    // fontSize
  },
  item_text_style: {
    color: '#333333',
    // fontSize
  }
});
const mapStateToProps = state => ({
  districts: state.buildings.buildingsDistricts
});
export default connect(mapStateToProps, null)(DropdownMenu);
