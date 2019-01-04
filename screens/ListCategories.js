import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {
    Card,
    ListItem
} from 'react-native-elements';
import {
    MonoText
} from '../components/StyledText';
export default class ListCategories extends React.Component {
    static navigationOptions = {
        title: 'Categories',
    };
    render() {
        const Categories = [
            "Technology",
            "Life Styles",
            "Culture",
            "Self",
            "Politics",
            "Design",
            "Health",
            "Popular",
            "Collections"
        ]
        return (
            <View >
                <Card style={{flex: 1}}>
                    {
                        Categories.map((u, i) => {
                            return (
                                <ListItem
                                    key={i}
                                    roundAvatar
                                    title={u}
                                />
                            );
                        })
                    }
                </Card>
            </View>
        );
    }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 15,
//     backgroundColor: '#fff',
//   },
// });
