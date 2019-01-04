import React from 'react';
import { Text, View, ScrollView, Dimensions, WebView } from 'react-native';
import HTML from 'react-native-render-html';

export default class ArticleScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Article: {}
        }
    }
    componentWillMount() {
        this.setState({
            Article: this.props.navigation.getParam("Article", "ERR")
        })
    }
    componentDidMount() {
        console.log(this.state.Article.content);
    }
    render(){
        return(
                <WebView
                    originWhitelist={['*']}
                    source={{html: this.state.Article.content}}
                    style={{marginTop: 20}}
                />
        )
    }
};
