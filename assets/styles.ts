import { StyleSheet } from "react-native";
import colors from "@/constants/Colors";

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.zinc,
    },
    scrollView: {
        flexGrow: 1,
        backgroundColor: colors.zinc,
    },
    container: {
        flex: 1,
        padding: 34,
        backgroundColor: colors.zinc,
    },
    header: {
        paddingLeft: 0,
        paddingRight: 14,
        marginBottom: 20, 
        flex: 1,
        alignItems: "center", // Centraliza o título
    },
    headerStart: {
        paddingLeft: 0,
        paddingRight: 14,
        marginBottom: 20, 
    },
    LogoText: {
        fontSize: 28,
        fontWeight: "bold",
        color: colors.white,
        marginBottom: 0,
        marginTop: 0,
    },
    greenText: {
        color: colors.green,
    },
    slogan: {
        fontSize: 32,
        color: colors.white,
        marginBottom: 20,
    },
    form: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 16,
        paddingTop: 24,
        paddingLeft: 14,
        paddingRight: 14,
    },
    formHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16, // Adiciona espaçamento horizontal
        paddingVertical: 12, // Adiciona espaçamento vertical
        backgroundColor: colors.zinc, // Cor de fundo do cabeçalho
    },
    label: {
        color: colors.zinc,
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 8,
        paddingVertical: 14,
    },
    button: {
        backgroundColor: colors.green,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        borderRadius: 8,
    },
    buttonText: {
        color: colors.zinc,
        fontWeight: "bold",
    },
    backButton: {
        backgroundColor: "rgba(255,255,255, 0.55)",
        alignSelf: "flex-start",
        padding: 8,
        borderRadius: 8,
        marginBottom: 8,
        marginRight: 14,
    },
    menuButton: {
        backgroundColor: "rgba(255,255,255, 0.55)",
        borderRadius: 8,
        padding: 8,
    },
    menuButtonContainer: {
        marginLeft: 16,
    },
    textLink: {
        paddingTop: 8,
    },
    link: {
        color: colors.green,
    },
    load: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.zinc,
    },
    imageContainer: {
        width: 35,
        height: 35,
        borderRadius: 50,
        overflow: 'hidden',
        marginRight: 6,
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    drawerButton: {
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 10,
    },
    content: {
        marginTop: 20,
    },
    sceneContainerStyle: {
        backgroundColor: colors.zinc,
    },
    overlayColor: {
        backgroundColor: 'transparent',
    },
    drawerLabelStyle: {
        marginLeft: -5,
        fontSize: 16,
        fontWeight: '500',
    },
    drawerItemStyle: {
        borderRadius: 8,
        marginHorizontal: 10,
        marginVertical: 5,
    },
    drawerActiveTintColor: {
        color: colors.green,
    },
    drawerInactiveTintColor: {
        color: colors.white,
    },
    drawerActiveBackgroundColor: {
        backgroundColor: 'rgba(72, 187, 120, 0.1)',
    },
    drawerInactiveBackgroundColor: {
        backgroundColor: 'transparent',
    },
    text: {
        fontSize: 16,
        color: colors.white,
        marginBottom: 10,
    },
});