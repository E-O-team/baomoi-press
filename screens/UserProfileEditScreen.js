import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, AsyncStorage } from 'react-native';
import axios from 'axios';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
export default class UserProfileEdit extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            user: {}
        }

    }
    componentWillMount() {
        const user = this.props.navigation.getParam("user", null)
        this.setState({
            user: user,
            birth_date: user.birth_date,
            gender: user.gender,
            so_thich: user.so_thich,
            mobile_number: user.mobile_number,
        })
    }

    handleSubmit = () => {
        const data = new FormData()
        data.append("birth_date", this.state.birth_date)
        data.append("gender", this.state.gender)
        data.append("so_thich", this.state.so_thich)
        data.append("mobile_number", this.state.mobile_number)
        axios({
            method: "POST",
            url: 'https://baomoi.press/wp-json/wp/v2/update_user_info',
            headers: {'Authorization': 'Bearer ' + this.state.user.token},
            data: data
        })
        .then(res => {
            this.logOut()
        })
        .catch(err => console.log(err))
    }

    logOut = async () => {
        AsyncStorage.clear()
        this.props.navigation.navigate("Auth")
    }

    render(){
        const {user} = this.state
        return(
            <ScrollView style={styles.container}>
                <FormLabel>ngày sinh</FormLabel>
                <FormInput placeholder={user.birth_date} onChangeText={(text) => this.setState({birth_date: text})}/>
                <FormLabel>giới tính</FormLabel>
                <FormInput placeholder={user.gender[0]} onChangeText={(text) => this.setState({gender: text})}/>
                <FormLabel>sở thích</FormLabel>
                <FormInput placeholder={user.so_thich} onChangeText={(text) => this.setState({so_thich: text})}/>
                <FormLabel>số điện thoại</FormLabel>
                <FormInput placeholder={user.mobile_number} onChangeText={(text) => this.setState({mobile_number: text})}/>

                <Button
                    buttonStyle={styles.button}
                    title="Lưu"
                    onPress={this.handleSubmit}
                />

                <Text style={{color: '#696969', marginHorizontal: 10, marginTop: 20}}>Lưu ý: bạn cần điền đầy đủ thông tin trước khi thực hiện bình luận bài viết</Text>
            </ScrollView>
        )
    }
}

styles = StyleSheet.create({
    container:{
        justifyContent: "flex-start",
    },
    button:{
        marginTop: 10,
        backgroundColor: '#e12f28',
        marginHorizontal: 10
    }
})
