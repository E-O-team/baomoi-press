import React from 'react';

export default class HandleNetworkError extends React.Component {
    constructor(props){
        super(props)
        console.log(props);
    }


    render(){
        console.log(this.props);
        return null
    }
};
