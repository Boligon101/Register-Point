import { StyleSheet } from "react-native";
import colors from "@/constants/colors";

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
        paddingLeft: 14,
        paddingRight: 14,
    },
    LogoText: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.white,
        marginBottom: 8,
        marginTop: 8,
    },
    greenText: {
        color: colors.green,
    },
    slogan: {
        fontSize: 36,
        color: colors.white,
        marginBottom: 34,
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
        alignItems: "center",
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
        backgroundColor: colors.zinc

    },
});