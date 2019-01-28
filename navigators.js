import React from 'react';
import { createBottomTabNavigator, createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { TouchableOpacity, View, Text } from 'react-native';
import { Icon, Badge } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';

import { Welcome } from './src/containers/welcome';
import { News, NewsDetail } from './src/containers/news';
import { Locations } from './src/containers/locations';
import { Appointment } from './src/containers/appointment';
import { Account, SignIn, SignUp, SignUpWithPhoneAndFacebook, Profile } from './src/containers/account';
import { Buildings, BuildingDetails, Offices, Booking } from './src/containers/buildings';
import { Notifications } from './src/containers/notifications';
import { NotificationIcon } from './src/components/notifications';
import i18n from './src/i18n';
import { inverseTextColor } from './src/config/variables';

// const NotificationIcon = (props) => (
//   <TouchableOpacity onPress={() => props.navigation.navigate('Notifications')}>
//     <View>
//       <Icon
//         name='md-notifications'
//         style={{ paddingHorizontal: 10, marginRight: 5, color: inverseTextColor, fontSize: 20 }}
//       />
//       <View style={{
//         position: 'absolute',
//         top: -5,
//         right: 5,
//         backgroundColor: 'red',
//         borderRadius: 8,
//         width: 18,
//         height: 16,
//         alignItems: 'center',
//         justifyContent: 'center'
//       }}>
//         <Text style={{ color: inverseTextColor, fontSize: 9 }}>28</Text>
//       </View>
//     </View>
//   </TouchableOpacity>
// );

const headerOptions = {
  headerTintColor: '#fff',
  headerBackTitle: null,
  headerTitleStyle: {
    color: '#fff'
  },
  headerBackground: (
    <LinearGradient
      colors={['#2079ae', '#54ace0']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    />
  ),
  headerStyle: {
    // borderBottomColor: brandPrimary
    borderBottomWidth: 0
    // backgroundColor: '#2997d8'
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
      tabBarLabel: i18n.t('tabs.home'),
      tabBarVisible: false
    }
  });

const BuildingStack = createStackNavigator({
  Buildings: {
    screen: Buildings,
    navigationOptions: ({ navigation }) => {
      return {
        ...headerOptions,
        title: i18n.t('tabs.buildingList'),
        headerRight: <NotificationIcon navigation={navigation} />
      }
    }
  },
  BuildingDetails: {
    screen: BuildingDetails,
    navigationOptions: {
      ...headerOptions,
      headerBackTitle: null,
      header: null
    }
  },
  Offices: {
    screen: Offices,
    navigationOptions: {
      ...headerOptions
    }
  },
}, {
    initialRouteName: 'Buildings',
    navigationOptions: {
      tabBarLabel: i18n.t('tabs.buildings'),
      ...headerOptions
    }
  });

const LocationStack = createStackNavigator({
  Locations: {
    screen: Locations,
    navigationOptions: ({ navigation }) => {
      return {
        ...headerOptions,
        tabBarLabel: i18n.t('tabs.locations'),
        title: i18n.t('tabs.locations'),
        headerRight: <NotificationIcon navigation={navigation} />
      }
    }
  }
}, {
    navigationOptions: {
      ...headerOptions,
      tabBarLabel: i18n.t('tabs.locations')
    }
  });

const AccountStack = createStackNavigator({
  Account: {
    screen: Account,
    // navigationOptions: ({ navigation }) => {
    //   return {
    //     ...headerOptions,
    //     title: i18n.t('tabs.account'),
    //     headerRight: <NotificationIcon navigation={navigation} />
    //   }
    // }
  },
  Profile: {
    screen: Profile,
    // navigationOptions: ({ navigation }) => {
    //   return {
    //     ...headerOptions
    //   }
    // }
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
  },
  SignUpWithPhoneAndFacebook: {
    screen: SignUpWithPhoneAndFacebook,
    navigationOptions: {
      ...headerOptions
    }
  }
}, {
    initialRouteName: 'Account',
    navigationOptions: {
      ...headerOptions,
      tabBarLabel: i18n.t('tabs.account')
    }
  });

const AppointmentStack = createStackNavigator({
  Appointment: {
    screen: Appointment,
    navigationOptions: ({ navigation }) => {
      return {
        ...headerOptions,
        title: i18n.t('appointment.appointmentList'),
        headerRight: <NotificationIcon navigation={navigation} />
      }
    }
  }
}, {
    navigationOptions: {
      ...headerOptions,
      tabBarLabel: i18n.t('tabs.appointment')
    }
  });

const NotificationsStack = createStackNavigator({
  Notifications: {
    screen: Notifications,
    navigationOptions: headerOptions
  }
});
const ModalBookingStack = createStackNavigator({
  ModalBooking: { screen: Booking, navigationOptions: headerOptions }
});
const ModalNewsStack = createStackNavigator({
  ModalNews: { screen: NewsDetail, navigationOptions: headerOptions }
});
const MainNavigator = createBottomTabNavigator({
  Home: HomeStack,
  Buildings: BuildingStack,
  Locations: LocationStack,
  Appointment: AppointmentStack,
  Account: AccountStack
}, {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarOptions: {
        activeTintColor: '#2997d8',
        inactiveTintColor: '#919191'
      },
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        let iconSize = 26;
        let iconType = 'Ionicons';
        if (routeName === 'Home') {
          iconName = 'ios-home';
        } else if (routeName === 'Buildings') {
          iconName = `building${focused ? '' : '-o'}`;
          iconSize = 22;
          iconType = 'FontAwesome';
        } else if (routeName === 'Locations') {
          iconName = 'location-pin';
          iconType = 'Entypo';
          iconSize = 28;
        } else if (routeName === 'Account') {
          iconSize = 32;
          iconName = 'ios-person';
        } else if (routeName === 'Appointment') {
          iconSize = 22;
          iconName = `calendar${focused ? '' : '-o'}`;
          iconType = 'FontAwesome';
        }
        return <Icon name={iconName} style={{ color: tintColor, fontSize: iconSize }} type={iconType} />;
      }
    }),
    initialRouteName: 'Home'
  });

const AppNavigator = createStackNavigator({
  Main: createSwitchNavigator({ MainNavigator }),
  ModalNews: ModalNewsStack,
  ModalBooking: ModalBookingStack,
  Notifications: NotificationsStack
}, {
  defaultNavigationOptions: { header: null },
  initialRouteName: 'Main'
});
const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
