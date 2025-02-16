import colors from "@/constants/Colors";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import styles from "@/assets/styles";

export default function Index() {

    return(

        <View style={styles.load}>

            <ActivityIndicator 
                size={88}
                color={colors.green}
            />

        </View>

    )
}
