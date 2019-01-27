import React from 'react';
import { Text, View, AsyncStorage, StyleSheet, TouchableOpacity, Picker, ScrollView } from 'react-native';
import axios from 'axios';
import { Avatar, Card, Icon, Button } from 'react-native-elements';
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';
export default class UserProfile extends React.Component {
    constructor() {
        super()
        this.state={
            user: {}
        }
    }
    componentWillMount() {
        AsyncStorage.getItem('user')
        .then(user => {
            if(user){
                this.setState({
                    user: JSON.parse(user)
                })
            }else{
                this.props.navigation.navigate("Auth")
            }
        })
    }
    render(){
        const {user} = this.state
        return(
            <View style={styles.container}>
                <View style={styles.avatar_name_email}>
                    {user.avatar_urls &&
                        <Avatar
                            overlayContainerStyle={styles.avatar}
                            width={100}
                            rounded
                            source={{uri: user.avatar_urls['96'] || defaultImg}}
                        />
                    }
                    <View style={styles.name_email}>
                        <Text style={styles.name}>{user.name}</Text>
                        <Text style={styles.email}>{user.email}</Text>
                    </View>
                </View>
                <View style={styles.usersConfig}>
                    <View style={styles.XuAndExp}>
                        <View style={styles.menuItem}>
                            <Text style={styles.menuItemText}>Xu</Text>
                            <Text style={{color: "#ffb040", fontSize: 35}}>{user.xu}</Text>
                        </View>
                        <View style={styles.menuItem}>
                            <Text style={styles.menuItemText}>Exp</Text>
                            <Text style={{color: "#ffb040", fontSize: 35}}>{user.exp}</Text>
                        </View>
                    </View>
                    <ScrollView>
                        <View style={styles.userInfo}>
                            <Text style={{fontSize: 20,}}>Tên</Text>
                            <Text style={{fontSize: 20, color: '#696969'}}>{user.name}</Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={{fontSize: 20,}}>Email</Text>
                            <Text style={{fontSize: 20, color: '#696969'}}>{user.email}</Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={{fontSize: 20,}}>Ngày Sinh</Text>
                            <Text style={{fontSize: 20, color: '#696969'}}>{user.birth_date}</Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={{fontSize: 20,}}>Giới Tính</Text>
                            <Text style={{fontSize: 20, color: '#696969'}}>{user.gender}</Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={{fontSize: 20,}}>Số điện thoại</Text>
                            <Text style={{fontSize: 20, color: '#696969'}}>{user.mobile_number}</Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={{fontSize: 20,}}>Sở thích</Text>
                            <Text style={{fontSize: 20, color: '#696969'}}>{user.mobile_number}</Text>
                        </View>
                        <Button buttonStyle={styles.button} title="Chỉnh sửa"/>
                    </ScrollView>
                </View>
            </View>
        )
    }
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    avatar_name_email: {
        padding: 10,
        backgroundColor: 'white',
        height: 110,
        flexDirection: "row",
        alignItems: "center",
        flex: 1
    },
    avatar: {
        margin: 10,
        backgroundColor: "white",
    },
    name_email: {
        padding: 10,
    },
    name:{
        fontSize: 30,
    },
    email:{
        fontSize: 17,
    },
    usersConfig:{
        marginTop: 4,
        flex: 5,
    },
    XuAndExp:{
        borderColor: "white",
        backgroundColor: "white",
        borderStyle: "solid",
        borderRadius: 10,
        borderWidth: 3,
        flexDirection: "row",
        marginHorizontal: 10,
        marginVertical: 10,
    },
    menuItem:{
        alignItems: "center",
        flex: 1,
        padding: 10,
        flexDirection: "column",
        backgroundColor: "white",
    },
    menuItemText:{
        fontSize: 30,
    },
    userInfo:{
        justifyContent: "space-between",
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        height: 55,
    },
    button:{
        marginTop: 10,
        backgroundColor: '#e12f28',
    }
})
