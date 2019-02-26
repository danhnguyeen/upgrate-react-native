import React from 'react';
import { Text } from 'react-native';
import { Icon, ListItem, Left, Button, Body, Right } from 'native-base';

const ContactItem = (props) => (
  <ListItem icon onPress={props.onPress}>
    <Left>
      <Button style={{ backgroundColor: props.color }}>
        {props.icon}
      </Button>
    </Left>
    <Body style={props.nonBorder ? { borderBottomWidth: 0 } : null}>
      <Text>{props.title}</Text>
    </Body>
    {!props.hideRight ?
      <Right style={props.nonBorder ? { borderBottomWidth: 0 } : null}>
        <Icon active name="arrow-forward" />
      </Right>
      : null}
  </ListItem>
);

export default ContactItem;