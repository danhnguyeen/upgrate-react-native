import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import StarRating from 'react-native-star-rating';
import FastImage from 'react-native-fast-image';
import { Avatar } from 'react-native-elements';

import i18n from '../../../i18n';
import axios from '../../../config/axios-mylife';
import { InvoiceDetails } from '../../../components/Account';
import { Spinner } from '../../../components/common';
import { brandLight, fontSize, brandWarning, brandDark } from '../../../config/variables';

class AccumulationDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: i18n.t('account.accumulation.invoice') + " #" + navigation.getParam('data').id
    }
  };
  state = {
    firstLoading: true,
    isReivew: false,
    data: this.props.navigation.getParam('data', {}),
    billData: {},
    loading: true,
    ratingScore: 5
  }
  componentDidMount() {
    this.getAccumulation();
    this.props.navigation.addListener('willFocus', () => {
      if (!this.state.firstLoading) {
        this.getAccumulation();
      }
    });
  }
  getAccumulation = async () => {
    const result = await axios.post('user/history/accumulation_by_id?langid=1', { Id: this.state.data.id });
    console.log(result);
    this.setState({ billData: result, loading: false, firstLoading: false });
  }
  render() {
    const user = this.props.user ? this.props.user : {};
    const branch = this.state.billData.branch ? this.state.billData.branch : {};
    const reviews = this.state.billData.reviews ? this.state.billData.reviews : {};
    return (
      <View style={{ flex: 1, backgroundColor: brandDark }}>
        {this.state.loading ?
          (
            <Spinner />
          )
          :
          (
            <ScrollView contentContainerStyle={{ padding: 15 }}>
              <View style={styles.brachName}>
                <Image source={{ uri: branch.bimageUrl }} style={{ width: 50, height: 50 }} />
                <View style={{ flex: 1, marginLeft: 15 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: fontSize + 2 }}>{branch.bname}</Text>
                  <Text>{branch.badd}</Text>
                </View>
              </View>
              <View style={styles.ratingContainer}>
                {user.profilePicture ?
                  <FastImage
                    source={{ uri: user.profilePicture }}
                    style={[styles.avatarStyle, { width: 50, height: 50, borderRadius: 50 }]}
                  />
                  :
                  <Avatar
                    size="small"
                    rounded
                    icon={{ name: 'user', type: 'font-awesome' }}
                    activeOpacity={0.7}
                    containerStyle={styles.avatarStyle}
                  />
                }
                <StarRating
                  emptyStar={'ios-star-outline'}
                  fullStar={'ios-star'}
                  iconSet={'Ionicons'}
                  maxStars={5}
                  starSize={26}
                  starStyle={{ paddingHorizontal: 3 }}
                  halfStarEnabled={false}
                  rating={reviews.ratingScore}
                  fullStarColor={brandWarning}
                  disabled={reviews.ratingScore > 0}
                  selectedStar={(rating) => this.props.navigation.navigate('Review', { billData: this.state.billData, rating })}
                />
              </View>
              <InvoiceDetails 
                info={this.state.billData.info} 
                items={this.state.billData.items} 
              />
            </ScrollView>
          )
        }
      </View>
    )
  }
}
const styles = StyleSheet.create({
  containerScan: {

  },
  avatarStyle: {
    marginRight: 10
  },
  brachName: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 80,
    backgroundColor: brandLight,
    borderRadius: 5,
    marginBottom: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ratingContainer: {
    padding: 15,
    flexDirection: 'row',
    minHeight: 80,
    width: '100%',
    backgroundColor: brandLight,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
}

export default connect(mapStateToProps)(AccumulationDetails);
