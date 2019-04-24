import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';

import i18n from '../../../i18n';
import { Spinner } from '../../../components/common';
import { AccumulationItem, AccumulationIcon } from '../../../components/Account';
import { brandDark } from "../../../config/variables";
import axios from '../../../config/axios-mylife';

class Accumulation extends Component {
  static navigationOptions = {
    title: i18n.t('account.accumulationHistory'),
    headerBackTitle: null
  };

  state = {
    isDetails: false,
    selectedItem: null,
    firstLoading: true,
    accumulations: [],
    page: 1,
    size: 20,
    isPullRefresh: false,
    totalPage: null
  }
  componentDidMount() {
    if (this.props.user) {
      this.fetchAccumulation();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.user && !this.props.user) {
      this.fetchAccumulation();
    }
  }
  fetchAccumulation = async (isLoadMore, isPullRefresh = false) => {
    if (isLoadMore && this.state.page > this.state.totalPage) {
      return;
    }
    const prevState = { ...this.state };
    if (!isLoadMore) {
      prevState.page = 1;
    }
    this.setState({ isPullRefresh, page: prevState.page + 1 });
    try {
      const params = {
        langid: 1,
        page: prevState.page,
        size: prevState.size
      };
      const { result } = await axios.post(`user/history/accumulation`, params);
      this.setState({
        totalPage: result.PAGING[0].totalPage,
        accumulations: isLoadMore ? [...this.state.accumulations, ...result.ACCUHISTORY] : result.ACCUHISTORY,
        isRender: !this.state.isRender,
        isPullRefresh: false,
        firstLoading: false
      });
    } catch (error) {
      this.setState({ isPullRefresh: false });
    }
  }
  _renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => this.props.navigation.navigate('AccumulationDetails', { data: item })}
      style={{ marginHorizontal: 15, marginTop: index === 0 ? 10 : 0 }}
    >
      <AccumulationItem data={item} />
    </TouchableOpacity>
  )
  modalHandler = (data) => {
    this.setState({ isDetails: !this.state.isDetails, selectedItem: data });
  }
  render() {
    if (!this.props.user) {
      return <AccumulationIcon />;
    }
    const accumulations = this.state.accumulations || [];
    if (this.state.firstLoading) {
      return <Spinner backgroundColor={brandDark} />;
    }
    return (
      <View style={{ flex: 1, backgroundColor: brandDark }}>
        {!this.state.firstLoading && !accumulations.length ?
          <AccumulationIcon />
          :
          <FlatList
            onRefresh={this.fetchAccumulation}
            refreshing={this.state.isPullRefresh}
            keyExtractor={(item) => item.id.toString()}
            data={accumulations}
            renderItem={this._renderItem}
            onEndReached={() => this.fetchAccumulation(true)}
            onEndReachedThreshold={0.5}
          />
        }
      </View>
    )
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(Accumulation);
