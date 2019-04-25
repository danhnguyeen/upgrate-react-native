import React, { Component } from 'react';
import { FlatList } from 'react-native';

import axios from '../../../../config/axios-mylife';
import { ReviewItem } from '../../../../components/BookTable/Review';
import { Spinner } from '../../../../components/common';

class AllReviews extends Component {

  state = {
    isRender: false,
    reviews: [],
    isFetching: false,
    firstLoading: true,
    page: 1,
    size: 20,
    totalPage: null
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.isRender !== this.state.isRender
      || nextProps.refreshAllReview
      || (nextProps.focused && nextProps.reviewFocused)) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedShop.bid !== this.props.selectedShop.bid) {
      this.setState({ reviews: [], isRender: !this.state.isRender, page: 1, firstLoading: true });
    }
  }
  componentDidUpdate (prevProps) {
    if (this.props.focused && this.props.reviewFocused 
      && (this.state.firstLoading || this.props.refreshAllReview)
      && ((!prevProps.reviewFocused || !prevProps.focused))) {
      this.fetchReview(this.props.selectedShop);
    }
  }
  fetchReview = async (selectedShop, isLoadMore) => {
    if (isLoadMore && this.state.page > this.state.totalPage) {
      return;
    }
    // if the fetch is not loadmore, reset the page size
    const prevState = { ...this.state };
    if (!isLoadMore) {
      prevState.page = 1;
    }
    this.setState({ isFetching: true, page: prevState.page + 1 });
    try {
      const shop = selectedShop ? selectedShop : this.props.selectedShop;
      const { result } = await axios.post(`business/review/list?branchId=${shop.bid}&page=${prevState.page}&itemPerPage=${prevState.size}`);
      this.setState({
        totalPage: result.PAGING[0].totalPage,
        reviews: isLoadMore ? [...this.state.reviews, ...result.CONTAIN] : result.CONTAIN,
        isRender: !this.state.isRender,
        isFetching: false,
        firstLoading: false
      });
      if (this.props.refreshAllReview) {
        this.props.stopRefreshAllReview();
      }
    } catch (error) {
      this.setState({ isFetching: false });
    }
  }

  _renderItem = ({ item }) => (
    <ReviewItem review={item} />
  );

  render() {
    if (this.state.firstLoading) {
      return <Spinner />;
    }
    return (
      <FlatList
        onRefresh={() => this.fetchReview()}
        refreshing={this.state.isFetching}
        keyExtractor={(item) => item.Id.toString()}
        data={this.state.reviews}
        renderItem={this._renderItem}
        onEndReached={() => this.fetchReview(null, true)}
        onEndReachedThreshold={0.5}
      />
    );
  }
}

export default AllReviews;
