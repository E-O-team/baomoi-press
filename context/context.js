import React from 'react';

const Context = React.createContext();

class Provider extends React.Component {
  state = {
    textColor: 'black',
    backGround: 'white',
    fontSizeRatio : 1,
    }
    constructor() {
    super()
    this.changeDay = this.changeDay.bind(this)
    this.changeNight = this.changeNight.bind(this)
    this.changeRatio = this.changeRatio.bind(this)
    }
    changeDay() {
    // setting timeout to mimic an async login
      this.setState({  textColor: 'black',
        backGround: 'white', })
      }
    changeNight() {
      this.setState({ textColor: 'white',
      backGround: '#404040', })
      }
    changeRatio(r) {
      this.setState({fontSizeRatio : r})
    }

  render() {
    return (
      <Context.Provider
        value={{ textColor: this.state.textColor,
          backGround: this.state.backGround,
          fontSizeRatio: this.state.fontSizeRatio,
          changeDay: this.changeDay,
          changeNight: this.changeNight, }}
      >
        {this.props.children}
      </Context.Provider>
    )
  }
}
const Consumer = Context.Consumer
export { Provider, Consumer }
