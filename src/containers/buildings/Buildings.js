import React from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity, View, StyleSheet, Text, FlatList } from 'react-native';

import * as actions from './building-actions';
import { fontSize, brandPrimary, brandLight, DEVICE_WIDTH } from '../../config/variables';

class Buildings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    
  }
  render() {
    return (
      <View style={[styles.container]}>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandLight
  },
  
});

const mapStateToProps = state => {
  return {
    buildings: state.buildings.buildings
  }
}

const mapDispatchToProps = dispatch => {
  return {
    _onfetchBuidlings: (district_id) => dispatch(actions.fetchBuidlings(district_id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Buildings)
