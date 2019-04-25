/* eslint-disable no-unused-vars,no-mixed-operators,max-len,import/no-extraneous-dependencies */
import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';

import ListMenu from '../../../components/Menu/ListMenu';
import { 
  DEVICE_WIDTH,
  brandDark
} from '../../../config/variables';
import axios from "../../../config/axios-mylife";
import Categories from "../../../components/Menu/Categories";
import { Spinner } from "../../../components/common";

class Menu extends Component {
  state = {
    isRender: false,
    firstLoading: true,
    showListMenu: false,
    isFetching: false,
    isFetchingMenu: false,
    isFirstLoadingMenu: true,
    menus: [],
    listDetailMenu: [],
    selectedMenu: null,
    page: 1,
    size: 20,
    totalPage: null
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.isRender !== this.state.isRender 
      || (nextProps.menuFocused && !this.props.menuFocused)) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedShop.bid !== this.props.selectedShop.bid) {
      this.setState({ menus: [], isRender: !this.state.isRender, page: 1, firstLoading: true });
    }
  }
  componentDidUpdate (prevProps) {
    if (this.props.menuFocused && !prevProps.menuFocused && this.state.firstLoading) {
      this.fetchCategories(this.props.selectedShop);
    }
  }
  fetchCategories = async (selectedShop) => { 
    this.setState({ isFetching: true });
    try {
      const shop = selectedShop ? selectedShop : this.props.selectedShop;
      const { result } = await axios.get(`business/branch/detail/${shop.bid}/menu`);
      this.setState((prevState) => ({
          menus: result,
          isRender: !prevState.isRender,
          isFetching: false,
          firstLoading: false
      }));
    } catch (error) {
      this.setState((prevState) => ({ 
        isFetching: false, 
        isRender: !prevState.isRender 
      }));
    }
  };
  handleCloseModal = () => {
    this.setState((prevState) => ({
      showListMenu: false,
      isRender: !prevState.isRender,
      listDetailMenu: [],
      selectedMenu: null,
    }));
  };
  handleSelectMenu = async (selectedMenu) => {
    await this.setState((prevState) => ({
      isRender: !prevState.isRender,
      selectedMenu,
      page: 1,
      totalPage: null,
      showListMenu: true,
      isFirstLoadingMenu: true
    }));
    this.fetchMenuByCategory();
  };
  fetchMenuByCategory = async(isLoadMore) => {
    if (isLoadMore && this.state.page > this.state.totalPage) {
      return;
    }
    const prevState = { ...this.state };
    if (!isLoadMore) {
      prevState.page = 1;
    }
    this.setState({ page: prevState.page + 1 });
    const params = {
      page: prevState.page,
      size: prevState.size
    };
    try {
      const { result } = await axios.get(`business/branch/detail/${this.props.selectedShop.bid}/${this.state.selectedMenu.id}`, { params });
      this.setState({
        listDetailMenu: isLoadMore ? [...this.state.listDetailMenu, ...result.CONTAIN] : result.CONTAIN,
        isRender: !this.state.isRender,
        totalPage: result.PAGING[0].totalPage,
        isFirstLoadingMenu: false
      });
    } catch (error) {
      this.setState({ isFirstLoadingMenu: false });
    }
  }

  render() {
    if(this.state.firstLoading) {
      return <Spinner />;
    }
    const listMenuModal = this.state.showListMenu
      ? (<ListMenu
        show={this.state.showListMenu}
        fetchMenuByCategory={this.fetchMenuByCategory}
        isFetchingMenu={this.state.isFetchingMenu}
        isFirstLoadingMenu={this.state.isFirstLoadingMenu}
        handleClose={this.handleCloseModal}
        selectedMenu={this.state.selectedMenu}
        listDetailMenu={this.state.listDetailMenu}
      />)
      : null;
    let contentMenu = null;
    if(this.state.menus.length > 0){
      contentMenu = (
        <FlatList
          onRefresh={this.fetchCategories}
          refreshing={this.state.isFetching}
          numColumns={2}
          contentContainerStyle={{ paddingTop: 10 }}
          style={{ width: DEVICE_WIDTH }}
          data={this.state.menus}
          renderItem={({ item, index }) =>
            <Categories
              data={item}
              index={index}
              handleSelectMenu={this.handleSelectMenu}/>
          }
          keyExtractor={(item) => item.menuid.toString()}
        />
      )
    }
    return (
      <View style={styles.container}>
        {contentMenu}
        {listMenuModal}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandDark
  },
});

export default Menu;
