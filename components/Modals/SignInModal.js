import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
    ActivityIndicator,
    AsyncStorage,
    FlatList,
    Modal,
    TouchableHighlight,
    Alert,
} from 'react-native';
import { Facebook } from 'expo';
import {
    Consumer
} from '../../context/context.js'
import {
    Avatar,
    Card,
    Icon,
    Button,
    Divider,
    Badge,
    FormValidationMessage
} from 'react-native-elements';
import axios from 'axios';
import logo from '../../assets/images/logo.png';
const FBAppID = "418043712281827"
export default class SignInModal extends React.PureComponent {
    constructor(props){
        super(props)
        this.state ={
            loading: false,
        }
    }

    signIn = async (email, id, name, picture) => {
        this.props.setLoading(true)
        axios.post('https://baomoi.press/wp-json/jwt-auth/v1/token', {
            username: name,
            password: id,
            email: email,
        })
        .then((response) => {
            let user = response.data
            this.signInApp(user, picture, name)
        })
        .catch((err) => {
            console.log(err.response.data);
            this.setState({
                errorMessage: "The username or password you have entered is incorrect"
            })
        });
    }

    signInApp = async(user, picture, fbName) => {
        axios({
            method: "GET",
            url: 'https://baomoi.press/wp-json/wp/v2/current_user',
            headers: {'Authorization': 'Bearer ' + user.token},
        })
        .then(res => {
            console.log(user.token);
            let id = res.data.data.ID
            return axios({
                method: "GET",
                url: "https://baomoi.press/wp-json/wp/v2/users/" + id,
                headers: {'Authorization': 'Bearer ' + user.token},
            })
        })
        .then(res => {
            res.data.token = user.token
            const avatar_data = new FormData()
            avatar_data.append("avatar_url", picture.data.url)


            // const data = {
            //     avatar_url: picture.data.url
            // }
            axios({
                method: "POST",
                url: 'https://baomoi.press/wp-json/wp/v2/update_user_avatar',
                headers: {'Authorization': 'Bearer ' + user.token},
                data: avatar_data
            })
            .then(() => {

                const fbDisplayName_data = new FormData()
                fbDisplayName_data.append("name", fbName)

                axios({
                    method: "POST",
                    url: 'https://baomoi.press/wp-json/wp/v2/users/' + res.data.id,
                    headers: {'Authorization': 'Bearer ' + user.token},
                    data: fbDisplayName_data
                })
                .then(result => {
                    result.data.token = user.token
                    AsyncStorage.setItem('user', JSON.stringify(result.data))
                    this.props.updateUser()
                })
                .catch(error => console.log(error))


            })

        })
        .catch(err => console.log(err))
    }

    FBLogin = async() => {
        this.props.setModalVisible(!this.props.visible)
        try {
            const {
                type,
                token,
                expires,
                permissions,
                declinedPermissions,
            } = await Facebook.logInWithReadPermissionsAsync(FBAppID, {
                permissions: ['public_profile', 'email'],
            });
            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large),email`);
                const {email, id, name, picture} = await response.json()
                this.handleCreateAccount(email, id, name, picture)
            } else {
            // type === 'cancel'
            }
        } catch ({ message }) {
            console.log(message);
        }
    }

    handleCreateAccount = (email, id, name, picture) => {
        const data = {
            email: email,
            username: name,
            password: id,
        }
        axios({
            method: "POST",
            url: 'https://baomoi.press/wp-json/wp/v2/users/register',
            data: data
        })
        .then(res => {
            // NEW ACCOUNT
            if(res.data.code == 200){
                this.signIn(email, id, name, picture)
            }
        })
        .catch(err => {
            // ACCOUNT ALREADY EXIST, PROCEED TO LOGIN
            if(err.response.data.code == 406){
                this.signIn(email, id, name, picture)
            }
        })
    }

    render(){
        return(
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => this.props.setModalVisible(!this.props.visible)}
            >
            <View style={{alignItems: "center", justifyContent:"center", flex:1, backgroundColor: 'rgba(0,0,0,0.5)'}}

            >
                <View style={{backgroundColor: "#f0eff4" ,height: 320, width: 320, justifyContent: "space-between", paddingBottom: 5, opacity: 2}}>
                    <View style={{flexDirection: "column"}}>
                        <View style={{flexDirection: "row", borderBottomWidth: 1, borderBottomColor: '#B8B8B8', alignItems: "center", height: 32, backgroundColor:"#ffffff"}}>
                            <View style={{flex: 1, alignItems: "flex-start"}}>
                                <Icon
                                    name='close'
                                    type='evilicon'
                                    size={30}
                                    color="black"
                                    onPress={() => this.props.setModalVisible(!this.props.visible, null)}
                                />
                            </View>
                            <View style={{flex: 2, alignItems: "center"}}>
                                <Text style={{color: "black", marginLeft: 3}}>Đăng nhập hoặc đăng kí</Text>
                            </View>
                            <View style={{flex: 1}}></View>
                        </View>
                        <View style={{padding: 15}}>
                            <View style={{width: 114*1.4, height: 40*1.4, alignSelf: "center", marginTop: 10}}>
                                <Image
                                    source={logo}
                                    style={{ width: 114*1.4, height: 40*1.4, alignSelf: 'center' }}
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 30}}>
                                <View style={{flex:1, backgroundColor: 'black', height: 0.5, opacity: 0.5}}></View>
                                <View style={{flex:2, alignItems: "center"}}>
                                    <Text style={{ fontSize: 15, opacity: 0.8}}>ĐĂNG NHẬP BẰNG</Text>
                                </View>
                                <View style={{flex:1, backgroundColor: 'black', height: 0.5, opacity: 0.5}}></View>
                            </View>
                            <View>
                                <Button
                                    containerViewStyle={{marginTop: 20}}
                                    backgroundColor="#4a6da7"
                                    buttonStyle={{borderRadius: 6.5, marginHorizontal: -15}}
                                    raised
                                    icon={{name: 'facebook-official', type: "font-awesome", reverse: true}}
                                    title='Đăng nhập bằng facebook'
                                    loading={this.state.loading}
                                    onPress={this.FBLogin}
                                />
                            </View>
                            <View style={{}}>
                                <Text style={{fontStyle: "italic", textAlign: "center", marginTop: 30}}>Đăng nhập để trải nghiệm đầy đủ các tính năng của ứng dụng và để lại những bình luận hay</Text>
                            </View>
                        </View>


                    </View>
                </View>
            </View>
            </Modal>
        )
    }
}
