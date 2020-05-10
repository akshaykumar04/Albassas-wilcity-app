import { PureComponent } from "react";

export default class NavigationSuspense extends PureComponent {
  static defaultProps = {
    fallback: null
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false
    };
    this._req = requestAnimationFrame(this._handleLoaded);
  }

  componentWillUnmount() {
    this._req && cancelAnimationFrame(this._req);
  }

  _handleLoaded = () => {
    this.setState({
      isLoaded: true
    });
  };

  render() {
    const { children, fallback } = this.props;
    const { isLoaded } = this.state;
    return isLoaded ? children : fallback;
  }
}
