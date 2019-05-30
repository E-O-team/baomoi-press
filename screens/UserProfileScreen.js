import React from 'react';
import { Text, View, AsyncStorage, StyleSheet, TouchableOpacity, Picker, ScrollView, SafeAreaView } from 'react-native';
import axios from 'axios';
import { Avatar, Card, Icon, Button } from 'react-native-elements';
import {Consumer} from '../context/context.js'
import dateFormat from 'dateformat';
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';
export default class UserProfile extends React.PureComponent {
    constructor() {
        super()
        this.state={
            user: {}
        }
    }

    static navigationOptions = ({navigation}) => {
        return {
            tabBarVisible: false,
            header: (
              <Consumer>
                {({backGround, textColor}) => (
                    <SafeAreaView
                        style={{
                        height: 50,
                        flexDirection: "row",
                        backgroundColor: backGround,
                        alignItems:'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#C6C3BC'
                        }}
                    >
                        <View>
                            <Icon
                                name='chevron-left'
                                size={35}
                                color={textColor}
                                onPress={() => {
                                    navigation.goBack()
                                    navigation.openDrawer()
                                }}
                            />
                        </View>
                    </SafeAreaView>
                )}
            </Consumer>
            )
        }
    }

    componentWillMount() {
        AsyncStorage.getItem('user')
        .then(res => {
            if(res){
                const user = JSON.parse(res)
                this.setState({
                    user: user,
                    token: user.token
                }, () => {
                    axios({
                        method: "GET",
                        url: "https://baomoi.press/wp-json/wp/v2/users/" + this.state.user.id,
                        headers: {'Authorization': 'Bearer ' + this.state.user.token},
                    })
                    .then((res) => this.setState({
                        user: res.data
                    }))
                    .catch(err => console.log(err))

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
                            large
                            width={100}
                            rounded
                            source={{uri: user.custom_avatar || defaultImg}}
                        />
                    }
                    <View style={styles.name_email}>
                        <Text style={styles.name}>{user.name}</Text>
                    </View>
                </View>
                <View style={styles.usersConfig}>
                    <View style={styles.XuAndExp}>
                        <View style={styles.menuItem}>
                            <Text style={styles.menuItemText}>Xu</Text>
                            <Text style={{color: "#ffb040", fontSize: 35}}>{user.xu}</Text>
                        </View>
                        <View style={{ backgroundColor: "#949494", height: 100, width: 2}}></View>
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
                            <Text style={{fontSize: 20, color: '#696969'}}>{user.user_email}</Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={{fontSize: 20,}}>Ngày Sinh</Text>
                            <Text style={{fontSize: 20, color: '#696969'}}>{dateFormat(user.birth_date, "dd-mm-yyyy")}</Text>
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
                            <Text style={{fontSize: 20, color: '#696969'}}>{user.so_thich}</Text>
                        </View>
                        <Button
                            style={{}}
                            buttonStyle={styles.button}
                            title="Chỉnh sửa"
                            onPress={() => this.props.navigation.navigate("UserProfileEdit", {
                                user: user,
                                token: this.state.token
                            })}
                        />
                    </ScrollView>
                </View>
            </View>
        )
    }
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f3f3"
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
        marginBottom: 10,
        backgroundColor: '#e12f28',
        marginHorizontal: 10
    }
})
