// import React from 'react'
// import { View } from 'react-native'
// import { ModalFilter } from '../../components/Building/'
// import Header from '../../components/Header'
// export default class BuildingFilter extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       text: '',
//       modalVisible: true
//     }
//   }
//   onFilterPress(dataFilter) {
//     this.setState({ modalVisible: false })
//     this.props.navigation.navigate('BuildingList')
//   }
//   render() {
//     return (
//       <View style={{ flex: 1 }}>
//         <Header goBackFunction={() => { this.props.navigation.navigate('IntroScreen') }} title='Tìm kiếm tòa nhà' />
//         <View style={{ backgroundColor: '#FFF', flex: 1 }}>
//           <ModalFilter onFilterPress={(dataFilter) => { this.onFilterPress(dataFilter) }} />
//         </View>
//       </View>
//     )
//   }
// }
