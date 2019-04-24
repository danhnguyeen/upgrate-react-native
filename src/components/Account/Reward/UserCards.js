import React, { Component } from 'react';
import { View, StyleSheet, Text, LayoutAnimation, ScrollView, TouchableOpacity } from 'react-native';
import { ButtonGroup, Divider, Icon, Slider } from 'react-native-elements';
// import * as Animatable from 'react-native-animatable';

import i18n from '../../../i18n';
import { brandLight, brandDark, brandPrimary, textColor, textDarkColor, fontSize, brandWarning, titleFontSize } from '../../../config/variables';

class UserCards extends Component {
  state = {
    selectedIndex: 0,
    cards: this.props.cards,
    copyCards: []
  }
  componentDidMount() {
    this.initCards(this.props.cards);
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.cards || !this.props.cards.length || this.props.cards.length !== nextProps.cards.length) {
      this.initCards(nextProps.cards);
    }
  }
  initCards = (cards) => {
    let selectedIndex = this.state.selectedIndex;
    if (cards && cards.length) {
      const copyCards = cards.map((card, index) => {
        card.isActived = this.props.user.profile
          && (this.props.user.profile.currentPoint >= card.Point || this.props.user.profile.currentLvl.level === card.Level);
        if (card.Level === 1) {
          card.color = textDarkColor;
          card.rewards = 'Chào mừng bạn đến với Mylife Company!\nVới mỗi hóa đơn bạn sẽ được tích lũy một số điểm tương ứng. Điểm số càng cao, bạn sẽ có cơ hội nâng hạng và kèm theo đó là những đặc quyền hấp dẫn!';
        }
        if (card.Level === 2) {
          card.color = textColor;
          card.rewards = i18n.t('account.level2');
        }
        if (card.Level === 3) {
          card.color = brandPrimary;
          card.rewards = i18n.t('account.level3');
        }
        if (card.Level === this.props.user.profile.currentLvl.level) {
          selectedIndex = index;
        }
        return card;
      });
      this.setState({ copyCards, selectedIndex });
    }
  }
  updateIndex = (selectedIndex) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    this.setState({ selectedIndex });
  }

  render() {
    if (!this.state.copyCards.length) {
      return null;
    }
    const { selectedIndex } = this.state;
    const selectedCard = this.state.copyCards[selectedIndex];
    const maxCard = this.state.copyCards[this.state.copyCards.length - 1];
    const profile = this.props.user && this.props.user.profile ? this.props.user.profile : {};
    return (
      <View>
        {/* <View style={{ width: '100%', alignItems: 'center' }}>
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            innerBorderStyle={{ color: 'transparent' }}
            buttons={buttons}
            selectedButtonStyle={{ backgroundColor: '#1b232b' }}
            containerStyle={styles.groupContainer}
          />
        </View> */}
        <View style={{ borderRadius: 5, overflow: 'hidden', marginBottom: 10 }}>
          <ScrollView 
            horizontal
            contentContainerStyle={{ flexDirection: 'row' }}>
            {this.state.copyCards.map((card, idx) =>
              (
                <TouchableOpacity key={card.Id}
                  style={[styles.levelButton, 
                    { 
                      backgroundColor: selectedIndex === idx ? '#1b232b' : brandLight,
                      borderTopRightRadius: idx == this.state.copyCards.length - 1 ? 5 : 0,
                      borderBottomRightRadius: idx == this.state.copyCards.length - 1 ? 5 : 0,
                      borderTopLeftRadius: idx == 0 ? 5 : 0,
                      borderBottomLeftRadius: idx == 0 ? 5 : 0,
                    }]}
                  onPress={() => this.updateIndex(idx)}>
                  <Icon
                    name={card.isActived ? 'star-circle' : 'lock'}
                    type={'material-community'}
                    size={fontSize + 4}
                    color={card.isActived ? (card.Level === this.props.user.profile.currentLvl.level ? brandPrimary : textColor) : textDarkColor}
                  />
                  <Text style={{ fontSize: fontSize - 3, marginTop: 3, color: card.isActived ? textColor : textDarkColor }}>
                    {card.Name}
                  </Text>
                </TouchableOpacity>
              )
            )
            }
          </ScrollView>
        </View>
        <View style={styles.bodyContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name='star-circle'
              type='material-community'
              size={fontSize + 4}
              color={selectedCard.isActived ? textColor : textDarkColor}
              containerStyle={{ paddingRight: 15 }} />
            <Text style={{ flex: 1 }}>{selectedCard.Name}</Text>
          </View>
          <Divider style={{ backgroundColor: brandDark, marginVertical: 20 }} />
          <View>
            <Text style={{ fontSize: fontSize + 4 }}>{`${profile.currentPoint}/${selectedCard.Point}`}</Text>
            <Slider
              style={{ height: 15 }}
              trackStyle={styles.track}
              thumbStyle={styles.thumb}
              minimumTrackTintColor={brandWarning}
              step={1}
              disabled={true}
              animateTransitions={true}
              animationType={'spring'}
              // maximumValue={selectedCard.Point}
              // value={profile.currentPoint >= selectedCard.Point ? selectedCard.Point : profile.currentPoint}
              maximumValue={maxCard.Point}
              value={profile.currentPoint >= selectedCard.Point ? maxCard.Point : profile.currentPoint * maxCard.Point / selectedCard.Point}
            />
          </View>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  containInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  groupContainer: {
    height: 60,
    marginTop: 0,
    width: '100%',
    borderWidth: 0,
    backgroundColor: brandLight,
    borderRadius: 5
  },
  bodyContainer: {
    backgroundColor: brandLight,
    borderRadius: 5,
    padding: 15
  },
  track: {
    height: 6,
    backgroundColor: textDarkColor,
  },
  thumb: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent'
  },
  levelButton: {
    height: 60,
    backgroundColor: brandLight,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60
  }
});

export default UserCards;