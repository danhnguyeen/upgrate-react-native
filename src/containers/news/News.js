import React from 'react';
import { Image, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Content, Text } from "native-base"

import { shadow, backgroundColor, brandLight } from '../../config/variables';

const marginHorizontal = 10;
const windowWidth = Dimensions.get('window').width;
const itemHeight = 185
const itemWidth = (windowWidth - (marginHorizontal * 2));
const itemWidthHor = itemWidth / 4 * 3;
const ENTRIES1 = [
  {
    title: 'Nắm ngay bí quyết có làn da đẹp cho phụ nữ văn phòng',
    subtitle: 'Với những gợi ý của các chuyên gia dinh dưỡng dưới đây thì phụ nữ văn phòng sẽ chẳng còn phải lo lắng làm gì để có làn da đẹp nữa. Cùng hệ thống văn phòng cho thuê PAX SKY tham khảo ngay những bí quyết làm đẹp da này để luôn tự tin nơi công sở, làm việc hiệu quả nhất các cô nàng nhé.',
    illustration: require('../../assets/images/news1.jpg')
  },
  {
    title: 'Văn phòng vàng vị trí vàng – Tặng 12 tháng phí quản lý',
    subtitle: 'Nhân dịp khai trương 2 tòa nhà mới đi vào hoạt động, Hệ thống văn phòng cho thuê PAX SKY áp dụng chương trình Văn phòng vị trí vàng – Tặng 12 tháng quản lý.',
    illustration: require('../../assets/images/news2.jpg')
  },
  {
    title: 'Kỷ niệm Ngày lập quốc của Đại Hàn Dân Quốc tại phòng sự kiện PAX SKY',
    subtitle: 'Ngày 18/10/2018 vừa qua, lần kỷ niệm thứ 4350 Ngày lập quốc của Đại Hàn Dân Quốc đã diễn ra tại phòng sự kiện tòa nhà PAX SKY 159C Đề Thám, Quận 1.',
    illustration: require('../../assets/images/news3.jpg')
  },
  {
    title: 'Top những văn phòng đẹp và độc đáo nhất trên thế giới',
    subtitle: 'Không hề đi theo những nguyên tắc truyền thống trong việc thiết kế không gian làm việc, top 5 văn phòng đẹp và độc đáo nhất thế giới sau sẽ khiến bạn phải kinh ngạc.',
    illustration: require('../../assets/images/news4.jpg')
  }
]
class News extends React.Component {

  renderSlides = () => ENTRIES1.map((item, index) => {
    return (
      <View key={index} style={[styles.tagNewsHor, { width: itemWidthHor }]}>
        <View style={{ overflow: 'hidden', borderTopRightRadius: 3, borderTopLeftRadius: 3 }}>
          <Image style={{ width: itemWidthHor, height: 120 }} source={item.illustration} />
        </View>
        <View style={{ paddingHorizontal: 10, paddingTop: 10 }} >
          <Text numberOfLines={1} style={[styles.line, { fontSize: 10, }]} >19 THÁNG MƯỜI MỘT, 2018 </Text>
          <Text numberOfLines={3} style={[styles.line, styles.h2]} >{item.title}</Text>
          <Text numberOfLines={3} style={[styles.line, styles.text]} >{item.subtitle}</Text>
        </View>
      </View>
    )
  });
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: backgroundColor}}>
        <Content>
          <View style={{ paddingVertical: 10 }} >
            <Text style={[styles.h2, { paddingLeft: 10 }]}>NỔI BẬT</Text>
            <ScrollView 
              horizontal
              contentContainerStyle={{ paddingHorizontal: 10 }}
              // style={{ flex: 1, paddingRight: 10 }}
              showsHorizontalScrollIndicator={false}
              ref={ref => { this.slideMapScroll = ref }} >
              {this.renderSlides()}
            </ScrollView>
          </View>
          <View style={{ paddingHorizontal: 15 }} >
            <Text style={[styles.h2, { paddingBottom: 10 }]}>TIN TỨC</Text>
            {ENTRIES1.map((item, index) =>
              <View key={index} style={styles.tagNewsVer}>
                <View style={{ flex: 1, overflow: 'hidden', borderTopRightRadius: 3, borderTopLeftRadius: 3 }}>
                  <Image style={{ width: '100%', height: itemHeight }} source={item.illustration} />
                </View>
                <View style={{ paddingHorizontal: 10, paddingTop: 10 }} >
                  <Text numberOfLines={1} style={[styles.line, { fontSize: 10, }]} >19 THÁNG MƯỜI MỘT, 2018 </Text>
                  <Text numberOfLines={3} style={[styles.line, styles.h2]} >{item.title}</Text>
                  <Text numberOfLines={3} style={[styles.line, styles.text]} >{item.subtitle}</Text>
                </View>
              </View>
            )}
          </View>
        </Content>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  paragraph: {
    marginBottom: 20,
  },
  line: {
    marginBottom: 10
  },
  text: {
    marginBottom: 10,
    color: '#666666',
    lineHeight: 25,
  },
  h1: {
    color: '#11519b',
    fontSize: 18,
    fontWeight: '700'
  },

  h2: {
    color: '#11519b',
    fontWeight: '500'
  },
  highlight: {
    color: '#11519b',
  },
  tagNewsHor: {
    ...shadow,
    backgroundColor: brandLight,
    borderRadius: 3,
    marginHorizontal: 5,
    marginVertical: 10,
  },
  tagNewsVer: {
    ...shadow,
    backgroundColor: brandLight,
    borderRadius: 3,
    marginVertical: 10,
  }
});

export default News;