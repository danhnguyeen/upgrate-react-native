import React from 'react';
import { createBottomTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import { Text } from 'react-native';
import { Icon } from 'native-base';

import { Welcome } from './src/containers/welcome';
import { News } from './src/containers/news';
import { Locations } from './src/containers/locations';
import { Account, SignIn, SignUp } from './src/containers/account';
import { Buildings, BuildingDetails, Offices } from './src/containers/buildings';
import i18n from './src/i18n';
import { brandPrimary, textColor } from './src/config/variables';

const headerOptions = {
  headerTintColor: '#fff',
  headerBackTitle: null,
  headerTitleStyle: {
    color: '#fff'
  },
  headerStyle: {
    backgroundColor: '#2997d8'
  }
};

const HomeStack = createStackNavigator({
  Welcome: {
    screen: Welcome,
    navigationOptions: {
      ...headerOptions,
      header: null
    }
  },
  News: {
    screen: News,
    navigationOptions: {
      ...headerOptions,
      title: i18n.t('tabs.news')
    }
  }
}, {
  initialRouteName: 'Welcome',
  navigationOptions: {
    ...headerOptions,
    tabBarVisible: false
  }
});

const BuildingStack = createStackNavigator({
  Buildings: {
    screen: Buildings,
    navigationOptions: {
      ...headerOptions,
      title: i18n.t('tabs.buildings')
    }
  },
  BuildingDetails: {
    screen: BuildingDetails,
    navigationOptions: {
      headerBackTitle: null,
      header: null
    }
  },
  Offices: {
    screen: Offices,
    navigationOptions: {
      ...headerOptions
    }
  }
}, {
  initialRouteName: 'Buildings',
  navigationOptions: {
    ...headerOptions
  }
});

const LocationStack = createStackNavigator({
  Locations: {
    screen: Locations,
    navigationOptions: {
      ...headerOptions,
      title: i18n.t('tabs.buildings')
    }
  }
});

const AccountStack = createStackNavigator({
  Account: {
    screen: Account,
    navigationOptions: {
      ...headerOptions,
      title: i18n.t('tabs.account')
    }
  },
  SignIn: {
    screen: SignIn,
    navigationOptions: {
      ...headerOptions,
      title: i18n.t('account.signIn')
    }
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      ...headerOptions,
      title: i18n.t('account.signUp')
    }
  }
}, {
  initialRouteName: 'Account'
});

const AppNavigator = createBottomTabNavigator({
  Home: HomeStack,
  Buildings: BuildingStack,
  Locations: LocationStack,
  Account: AccountStack
}, {
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      let iconSize = 26;
      let iconType = 'Ionicons';
      if (routeName === 'Home') {
        iconName = 'ios-home';
      } else if (routeName === 'Buildings') {
        iconName = `building${focused ? '' : '-o'}`;
        iconSize = 24;
        iconType = 'FontAwesome';
      } else if (routeName === 'Locations') {
        iconName = 'ios-pin';
      } else if (routeName === 'Account') {
        iconSize = 30;
        iconName = 'ios-person';
      }
      return <Icon name={iconName} style={{ color: tintColor, fontSize: iconSize }} type={iconType} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: brandPrimary,
    inactiveTintColor: textColor
  },
}, {
  initialRouteName: 'Home'
});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
