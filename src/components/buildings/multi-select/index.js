import React, { Component } from 'react'
import { View, TouchableOpacity, FlatList, UIManager, ScrollView, Animated, Easing } from 'react-native'
import PropTypes from 'prop-types'
import { Text, Icon, } from "native-base"

// set UIManager LayoutAnimationEnabledExperimental
if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default class MultiSelect extends Component {
  static propTypes = {
    selectedItems: PropTypes.string,
    items: PropTypes.array.isRequired,
    uniqueKey: PropTypes.string,
    onSelectedItemsChange: PropTypes.func.isRequired,
    displayKey: PropTypes.string,
  }

  static defaultProps = {
    selectedItems: '',
    items: [],
    uniqueKey: 'id',
    displayKey: 'name',
    onSelectedItemsChange: () => { },
  }

  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      animation: new Animated.Value()
    }
  }

  shouldComponentUpdate() {
    return true
  }

  _submitSelection = () => {
    this.setState({ expanded: !this.state.expanded })
  }


  _toggleItem = item => {
    this._submitSelection()
    this.props.onSelectedItemsChange(item)
  }

  _getRow = item => {
    const { displayKey } = this.props
    return (
      <TouchableOpacity onPress={() => this._toggleItem(item)} >
        <Text style={{ fontSize: 18, lineHeight: 30 }}>{item[`${displayKey}`]}</Text>
      </TouchableOpacity>
    )
  }
  _renderItems = () => {
    const { items, displayKey, selectedItems, addItemAll = false } = this.props
    if (items.length) {
      if (addItemAll) {
        const radiantTeam = items.find((item) => item[`${displayKey}`] === 'Tất cả')
        if (!radiantTeam) {
          items.unshift({ [`${displayKey}`]: "Tất cả" })
        }
      }
      return (
        <View style={{ marginHorizontal: 10 }}>
          <FlatList
            data={items}
            extraData={selectedItems}
            keyExtractor={item => item[`${displayKey}`]}
            renderItem={rowData => this._getRow(rowData.item)}
          />
        </View>
      )
    }
  }
  _setMaxHeight(event) {
    this.setState({
      maxHeight: event.nativeEvent.layout.height
    })
  }

  _setMinHeight(event) {
    this.setState({
      minHeight: event.nativeEvent.layout.height
    })
  }
  toggle() {
    //Step 1
    let initialValue = this.state.expanded ? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
      finalValue = this.state.expanded ? this.state.minHeight : this.state.maxHeight + this.state.minHeight

    this.setState({
      expanded: !this.state.expanded  //Step 2
    })

    this.state.animation.setValue(initialValue)  //Step 3
    Animated.timing(     //Step 4
      this.state.animation,
      {
        toValue: finalValue,
        duration: 300,
        easing: Easing.linear
      }
    ).start()  //Step 5

  }

  render() {
    const { selectedItems } = this.props
    return (
      <Animated.View style={{ height: this.state.animation, overflow: 'hidden' }}>
        <View onLayout={this._setMinHeight.bind(this)}>
          <TouchableOpacity onPress={this._submitSelection}
            style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
            <Text style={{ color: '#4c4c4c', fontSize: 20, lineHeight: 40,  }} numberOfLine={1} adjustsFontSizeToFit>{selectedItems} </Text>
            <Icon style={{ color: '#4c4c4c', fontSize: 28, lineHeight: 40, alignSelf: 'flex-end' }} name="angle-down" type='FontAwesome' />
          </TouchableOpacity>
        </View>
        <View onLayout={this._setMaxHeight.bind(this)}>
          {this.state.expanded && this._renderItems()}
        </View>
      </Animated.View>

    )
  }
}
