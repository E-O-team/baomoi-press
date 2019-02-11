import React from 'react';

const Context = React.createContext();

class Provider extends React.Component {
    state = {
        nightMode: false,
        textColor: 'black',
        backGround: 'white',
        fontSizeRatio : 1,
    }
    constructor() {
    super()
    }
    changeDay = () => {
        this.setState({
            textColor: 'black',
            backGround: 'white',
            nightMode: false,
        })
    }
    changeNight = () => {
        this.setState({
            textColor: 'white',
            backGround: '#404040',
            nightMode: true,
        })
    }

    switchMode = () => {
        if(this.state.nightMode == true){
            this.changeDay()
        }else{
            this.changeNight()
        }
    }

    changeRatio = (r) => {
      this.setState({fontSizeRatio : r})
    }

  render() {
    return (
      <Context.Provider
        value={{ textColor: this.state.textColor,
          backGround: this.state.backGround,
          fontSizeRatio: this.state.fontSizeRatio,
          nightMode: this.state.nightMode,
          changeDay: this.changeDay,
          changeNight: this.changeNight,
          changeRatio: this.changeRatio,
          switchMode: this.switchMode
      }}
      >
        {this.props.children}
      </Context.Provider>
    )
  }
}
const Consumer = Context.Consumer
export { Provider, Consumer }
