import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import { Divider, Badge } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Collapsible from 'react-native-collapsible';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';

import { formatPrice } from '../../../util/utility';
import i18n from '../../../i18n';
import { brandLight, fontSize, brandPrimary, textColor, brandDark } from '../../../config/variables';

class InvoiceDetails extends Component {
  state = {
    activeSections: [0],
    isActive: false
  }

  render() {
    const items = this.props.items ? this.props.items : [];
    const info = this.props.info ? this.props.info : {};
    const { isActive } = this.state;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.setState({ isActive: !isActive })}>
          <View style={{ flex: 1, paddingBottom: 1 }}>
            <View style={styles.header}>
              <Text style={[styles.headerText, { fontWeight: 'bold' }]}>{i18n.t('account.accumulation.invoiceDetails')}</Text>
              {isActive ?
                <Icon size={22} color={textColor} name="md-arrow-dropdown" />
                :
                <Icon size={22} color={textColor} name="md-arrow-dropup" />
              }
            </View>
            <Divider style={{ flex: 1, backgroundColor: brandDark }} />
          </View>
        </TouchableOpacity>
        <Collapsible duration={1000} collapsed={isActive} align="center">
          <Animatable.View style={styles.content} animation={'fadeIn'} easing="ease-out">
            {items.map((item, idx) => (
              <View style={styles.itemContainer} key={item.num}>
                <Badge value={item.quantity} textStyle={{ color: textColor }} containerStyle={{ backgroundColor: brandDark }} />
                <View style={{ flex: 1 }}>
                  <View style={{ flex: 1, flexDirection: 'row', paddingVertical: 20 }}>
                    <View style={{ flex: 1, marginHorizontal: 10, justifyContent: 'flex-start' }}>
                      <Text numberOfLines={1}>{item.item_name}</Text>
                    </View>
                    <Text>{formatPrice(item.total_amount)}</Text>
                  </View>
                  {(idx !== items.length - 1) ? <Divider style={{ backgroundColor: brandDark }} /> : null}
                </View>
              </View>
            ))}
            <Divider style={{ backgroundColor: brandDark }} />
          </Animatable.View>
        </Collapsible>
        <View style={{ padding: 15 }}>
          <View style={styles.invoiceSummaryText}>
            <Text style={styles.headerText}>{i18n.t('account.accumulation.total')}</Text>
            <Text style={{ fontSize: fontSize * 1.3 }}>{formatPrice(info.totalAmount)}</Text>
          </View>
          <View style={styles.invoiceSummaryText}>
            <Text style={styles.headerText}>{i18n.t('account.accumulation.starsAccumulated')}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.score}>{info.score}</Text>
              <Icon
                size={fontSize * 1.3}
                name='ios-star'
                type='ionicon'
                color={brandPrimary}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.headerText}>{i18n.t('account.accumulation.time')}</Text>
            <Text style={styles.headerText}>{info.timeOut ? moment(info.timeOut).format('HH:mm:ss DD/MM/YYYY') : null}</Text>
          </View>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: brandLight,
    borderRadius: 5
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15
  },
  itemContainer: {
    // paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  score: {
    fontSize: fontSize * 1.3,
    color: brandPrimary,
    marginRight: 3,
    marginBottom: 5
  },
  headerText: {
    fontSize: fontSize + 2
  },
  content: {
    paddingHorizontal: 15
  },
  invoiceSummaryText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  }
});


export default InvoiceDetails;
