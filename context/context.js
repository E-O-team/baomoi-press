import React from 'react';

const Context = React.createContext();

class Provider extends React.Component {
  state = {
    textColor: 'black',
    backGround: 'white',
    }
    constructor() {
    super()
    this.changeDay = this.changeDay.bind(this)
    this.changeNight = this.changeNight.bind(this)
    }
    changeDay() {
    // setting timeout to mimic an async login
      this.setState({  textColor: 'black',
        backGround: 'white', })
      }
    changeNight() {
      this.setState({ textColor: 'white',
      backGround: 'black', })
      }

  render() {
    return (
      <Context.Provider
        value={{ textColor: this.state.textColor,
          backGround: this.state.backGround,
          login: this.login,
          logout: this.logout }}
      >
        {this.props.children}
      </Context.Provider>
    )
  }
}
const Consumer = Context.Consumer
export { Provider, Consumer }
