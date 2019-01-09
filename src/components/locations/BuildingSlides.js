import React, { Component } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';

class BuildingSlides extends Component {

  renderSlides = () => this.props.buildings.map((slide, idx) => (
    <View
      key={slide.building_id}
      style={[styles.container, { marginLeft: (idx === 0 ? 10 : 0) }]}
    >
      <TouchableOpacity style={styles.slideStyle} onPress={() => this.props.selectedBuilding(slide)} >
        <Image
          style={styles.image}
          source={{ uri: slide.main_image }}
        />
        <View style={styles.infoContainer}>
          <View>
            <Text style={styles.titleStyle}>PAX SKY</Text>
            <Text style={styles.subTitleStyle} numberOfLines={2}>{`${slide.sub_name}, ${slide.district}`}</Text>
          </View>
          <View>
            <Text>2 hầm, 11 tầng</Text>
            <Text style={styles.priceStyle}>{`$${slide.rent_cost.toFixed(2)}/m2`}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  ));

  render() {
    return (
      <ScrollView
        horizontal
        style={{ flex: 1 }}
        showsHorizontalScrollIndicator={false}
      >
        {this.renderSlides()}
      </ScrollView>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    width: 230,
    backgroundColor: '#fff',
    marginRight: 10,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2
  },
  slideStyle: {
    overflow: 'hidden',
    flexDirection: 'row',
    borderRadius: 5
  },
  infoContainer: {
    padding: 10,
    justifyContent: 'space-between'
  },
  titleStyle: {
    color: '#156DAC',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5
  },
  subTitleStyle: {
    fontSize: 13,
    width: 120,
    color: '#616161'
  },
  priceStyle: {
    // fontWeight: 'bold',
    marginTop: 3,
    // fontSize: 15
  },
  image: {
    width: 80,
    height: 130
  }
};

export default BuildingSlides;
