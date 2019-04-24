import React, { PureComponent } from 'react'
import MapView from 'react-native-maps'

export default class MapMarker extends PureComponent {
  state = {
    tracksViewChanges: true
  }
  componentWillReceiveProps(nextProps) {
    // this.setState(() => ({
    //   tracksViewChanges: true,
    // }));
  }
  componentDidUpdate() {
    // if (this.state.tracksViewChanges) {
      // this.setState(() => ({
      //   tracksViewChanges: false,
      // }))
    // }
  }
  render() {
    return (
      <MapView.Marker
        tracksViewChanges={this.state.tracksViewChanges}
        {...this.props}
      >{this.props.children}</MapView.Marker>
    )
  }
}