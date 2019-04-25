/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { FlatList } from 'react-native';

import ItemMenu from './ItemMenu';
import ImageView from './ImageView';
import { DEVICE_WIDTH } from "../../config/variables";
import { Spinner, Modal } from "../../components/common";

class ListMenu extends Component {
  state = {
    isPhotoView: false,
    photo: null
  }
  showPhotoView = (photo) => {
    if (photo) {
      this.setState({ photo, isPhotoView: true });
    }
  }
  photoViewHandler = () => {
    this.setState({ isPhotoView: !this.state.isPhotoView });
  }
  render() {
    return (
      <Modal
        visible={this.props.show}
        onRequestClose={this.props.handleClose}
        title={this.props.selectedMenu ? this.props.selectedMenu.title : null}
      >
        {this.state.isPhotoView ?
          <ImageView
            visible={this.state.isPhotoView}
            photo={this.state.photo}
            photoViewHandler={this.photoViewHandler}
          />
          : null
        }
        {this.props.isFirstLoadingMenu ?
          <Spinner />
          :
          <FlatList
            onRefresh={this.props.fetchMenuByCategory}
            refreshing={this.props.isFetchingMenu}
            numColumns={2}
            contentContainerStyle={{ paddingTop: 10 }}
            style={{ width: DEVICE_WIDTH }}
            data={this.props.listDetailMenu}
            renderItem={({ item, index }) =>
              <ItemMenu
                key={item.itemid}
                index={index}
                showPhotoView={this.showPhotoView}
                deviceWidth={this.props.deviceWidth}
                item={item}
              />
            }
            keyExtractor={item => item.itemid.toString()}
            onEndReached={() => this.props.fetchMenuByCategory(true)}
            onEndReachedThreshold={0.5}
          />
        }
      </Modal>
    );
  }
};

export default ListMenu;
