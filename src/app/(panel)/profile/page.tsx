import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import styles from "@/assets/styles";
import colors from "@/constants/colors";

export default function Profile() {
    const { setAuth, user } = useAuth()

    async function handleSignout() {
        const { error } = await supabase.auth.signOut()
        setAuth(null)

        if (error) {
            Alert.alert("Error", 'Erro ao tentar sair da conta')
            return
        }
        
    }
    

    return(

        <View style={styles.container} >
            <Text style={{ color: colors.white}} >Pagina De Perfil</Text>
            <Text style={{ color: colors.white}} >{user?.email}</Text>
            <Text style={{ color: colors.white}} >{user?.id}</Text>

            <Button
                title="Deslogar"
                onPress={handleSignout}
            >

            </Button>
        </View>

    )
}