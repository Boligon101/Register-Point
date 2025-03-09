import { StyleSheet } from "react-native";
import colors from "@/constants/Colors";

export default StyleSheet.create({
    // Estilos gerais
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

    // Cabeçalho e Nav
    formHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.zinc,
    },
    header: {
        flex: 1,
        alignItems: "center",
    },
    headerLeft: {
        flex: 1,
        alignItems: "flex-start", 
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
        marginLeft: 0,
    },
    greenText: {
        color: colors.green,
    },
    backButton: {
        backgroundColor: "rgba(255,255,255, 0.55)",
        padding: 8,
        borderRadius: 8,
    },
    emptySpace: {
        width: 40, 
    },

    // Títulos e textos
    slogan: {
        fontSize: 32,
        color: colors.white,
        marginBottom: 20,
    },
    label: {
        color: colors.zinc,
        marginBottom: 4,
    },
    text: {
        fontSize: 16,
        color: colors.zinc,
        marginBottom: 10,
    },
    errorText: {
        color: "red",
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
    },

    // Formulários e inputs
    form: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 16,
        paddingTop: 24,
        paddingLeft: 14,
        paddingRight: 14,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 8,
        paddingVertical: 14,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        marginBottom: 16,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 14,
    },
    passwordToggle: {
        padding: 10,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 20,
        backgroundColor: colors.white,
        fontSize: 16,
    },

    // Botões
    button: {
        backgroundColor: colors.green,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        borderRadius: 8,
    },
    buttonDisabled: {
        backgroundColor: colors.green,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        borderRadius: 8,
        opacity: 0.5,
    },
    buttonText: {
        color: colors.zinc,
        fontWeight: "bold",
    },
    buttonAdd: {
        backgroundColor: colors.green,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        borderRadius: 8,
        marginBottom: 20,
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "flex-end", // Alinha os botões à direita
        marginTop: 10,
    },
    editButton: {
        backgroundColor: "transparent", // Fundo transparente
        padding: 8,
        borderRadius: 8,
        marginRight: 10, // Espaçamento entre os botões
    },
    deleteButton: {
        backgroundColor: "transparent", // Fundo transparente
        padding: 8,
        borderRadius: 8,
    },

    // Lista de funcionários
    funcionarioItem: {
        backgroundColor: colors.white,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    funcionarioName: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.zinc,
        marginBottom: 5,
    },
    funcionarioDetail: {
        fontSize: 14,
        color: colors.zinc,
        marginBottom: 3,
    },

    // Perfil do usuário
    profileContainer: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    profileLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.zinc,
        marginBottom: 5,
    },
    profileValue: {
        fontSize: 16,
        color: colors.zinc,
        marginBottom: 15,
    },

    // Loading e mensagens
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.zinc,
    },

    // Menu lateral (Drawer)
    drawerButton: {
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 10,
    },
    drawerLabelStyle: {
        marginLeft: -5,
        fontSize: 16,
        fontWeight: "500",
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
        backgroundColor: "rgba(72, 187, 120, 0.1)",
    },
    drawerInactiveBackgroundColor: {
        backgroundColor: "transparent",
    },

    // Links e ícones
    textLink: {
        paddingTop: 8,
    },
    link: {
        color: colors.green,
    },
    menuButton: {
        backgroundColor: "rgba(255,255,255, 0.55)",
        borderRadius: 8,
        padding: 8,
    },
    menuButtonContainer: {
        marginLeft: 16,
    },

    // Imagens e logos
    imageContainer: {
        width: 35,
        height: 35,
        borderRadius: 50,
        overflow: "hidden",
        marginRight: 6,
    },
    logoImage: {
        width: "100%",
        height: "100%",
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    // Outros
    content: {
        marginTop: 20,
    },
    sceneContainerStyle: {
        backgroundColor: colors.zinc,
    },
    overlayColor: {
        backgroundColor: "transparent",
    },
});