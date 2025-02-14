import colors from "@/constants/colors";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function Index() {

    return(

        <View style={styles.container}>

            <Text> Pagina Signin </Text>

        </View>

    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white

    },

})