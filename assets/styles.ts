import { Dimensions, StyleSheet } from "react-native";
import colors from "@/constants/Colors";
import Colors from "@/constants/Colors";

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
    perfil_input: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 8,
        paddingVertical: 14,
        color: colors.white,
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
        margin: 3,
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
        color: colors.white,
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

    funcionarioDetail: {
        fontSize: 14,
        color: colors.zinc,
        marginBottom: 3,
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
    infoBox: {
        backgroundColor: '#f0f0f0', 
        borderRadius: 8, 
        padding: 16, 
        marginVertical: 10, 
        borderWidth: 1, 
        borderColor: '#ccc', 
    },
    mapContainer: {
        height: 200, 
        width: '100%', 
        marginVertical: 10,
        borderRadius: 8,
        overflow: 'hidden', 
    },

    map: {
        width: Dimensions.get("window").width - 50000,
        height: 200, 
        marginVertical: 10, 
    },
    
    relogio: {
        fontSize: 48,
        fontWeight: "bold",
        color: colors.white,
        marginBottom: 40,
    },
    funcionarioCard: {
        width: "100%",
        padding: 20,
        backgroundColor: Colors.gray,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
    },
    buttonStart: {
        backgroundColor: "#00A86B",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10
    },
    buttonEnd: {
        backgroundColor: "#FF3B30",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10
    },

    pontoContainer: {
        backgroundColor: Colors.white,
        padding: 10,
        borderRadius: 8,
        marginVertical: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    // Estilo do botão de seleção de mês
    monthButton: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 20,
        backgroundColor: colors.white,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    monthButtonText: {
        fontSize: 16,
        color: colors.zinc,
        marginLeft: 8,
        fontWeight: "bold",
        textTransform: "uppercase",
    },

    // Estilo do cabeçalho da lista (quando expandido)
    dateHeader: {
        backgroundColor: colors.green,
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },



    // Estilo do container principal
    ponto_container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.zinc, // Fundo escuro
    },

    // Estilo do formulário (área branca)
    ponto_form: {
        backgroundColor: '#f3f5f6',
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        flex: 1,
    },

    
    // Estilos do MonthPicker
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: colors.zinc, // Fundo escuro
        borderRadius: 16,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.white, // Texto branco
        marginBottom: 10,
        textAlign: "center",
    },
    monthItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray, // Linha cinza
    },
    monthText: {
        fontSize: 16,
        color: colors.white, // Texto branco
        textAlign: "center",
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: colors.green, // Botão verde
        borderRadius: 8,
        alignItems: "center",
    },
    closeButtonText: {
        fontSize: 16,
        color: colors.white, // Texto branco
        fontWeight: "bold",
    },

    dateHeaderText: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.white,
        textTransform: "capitalize", // Primeira letra de cada palavra em maiúscula
    },

    // Estilo do item da lista (fechado)
    funcionarioItemClosed: {
        backgroundColor: colors.white, // Cinza bem clarinho
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },

    // Estilo do item da lista (expandido)
    funcionarioItemExpanded: {
        backgroundColor: colors.white,
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    profileImage: {
        width: 100,  // ou qualquer valor que você queira
        height: 100, // ou qualquer valor que você queira
        borderRadius: 50, // para fazer a imagem ficar redonda
        marginBottom: 10, // opcional: para dar um espaço abaixo da imagem
        alignSelf: 'center' // opcional: para centralizar a imagem
      },
      imageContainerPerfil: {
        marginBottom: 20,
        justifyContent: "center",
        alignItems: "center",
      },
      image: {
        width: 300,
        height: 300,
        borderRadius: 150, // Tornando a imagem circular
        borderWidth: 5,
        borderColor: "#ccc",
        backgroundColor: "#eee",
        padding: 10,
        marginTop: "10%",
      },

      // Container do perfil
    profileContainer: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },


    // Seção do perfil
    profileSection: {
        marginBottom: 20,
    },

    listSubTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.zinc,
        marginBottom: 4,
        marginLeft: 30,

    },

    // Label dos dados
    profileLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.zinc,
        marginBottom: 4,
    },

    // Valor dos dados
    profileValue: {
        fontSize: 16,
        color: colors.zinc,
        marginBottom: 12,
    },

    // Container da senha
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },


    // Texto do botão de mostrar/ocultar senha
    passwordToggleText: {
        fontSize: 14,
        color: colors.darckgreen,
        fontWeight: "bold",
    },

    // Mensagem de erro
    errorText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", 
        padding: 20,
    },
    cancelText: {
        color: "red",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
    },
    logoutButton: {
        backgroundColor: "#FF3B30",
    },
    changePhotoText: {
        marginTop: 10,
        color: "#00A86B",
        fontWeight: "bold",
    },
    
    // Cabeçalho com informações
    headerInfo: {
        alignItems: 'center',
        marginBottom: 30,
    },
    
    
    // Relógio em tempo real
    clockContainer: {
        alignItems: 'center',
        marginVertical: 30,
    },

    
    // Botão de ponto redondo
    roundButtonContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    
    
    roundButtonPressed: {
        transform: [{ scale: 0.95 }],
        backgroundColor: '#00C853',
    },
    

    
    // Rodapé com informações adicionais
    footerInfo: {
        alignItems: 'center',
    },
    
    infoText: {
        fontSize: 14,
        color: colors.white,
        marginBottom: 5,
    },
    
    
    // Container das informações
    infoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    
    
    // Container do botão de ponto
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    

    // ========================================================
    // Novo container principal
    pontoScreenContainer: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
    },
    
    // Relógio no topo com sombra
    clockHeader: {
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    
    timeText: {
        fontSize: 72,
        fontWeight: 'semibold',
        color: colors.white,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    
    dateText: {
        fontSize: 20,
        color: colors.white,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    
    // Container das informações (empresa, funcionário e tempo trabalhado)
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    
    infoColumn: {
        flex: 1,
    },
    
    empresaName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.green,
        marginBottom: 5,
    },
    
    funcionarioName: {
        fontSize: 18,
        color: colors.white,
    },

    funcionarioNameList: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.green,
    },
    
    timeWorkedContainer: {
        alignItems: 'flex-end',
    },
    
    timeWorkedText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.green,
        marginBottom: 5,
        marginTop: 10,
    },
    
    timeWorkedValue: {
        fontSize: 24,
        color: colors.white,
    },
    
    // Container central do botão
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    
    // Botão com área de toque aumentada
    buttonWrapper: {
        position: 'relative',
    },
    
    buttonTouchArea: {
        position: 'absolute',
        top: -30,
        left: -30,
        right: -30,
        bottom: -30,
        zIndex: 1,
    },
    
    roundButton: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.green,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    
    roundButtonDisabled: {
        backgroundColor: '#6b7280',
    },
    
    roundButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
    },
    
    // Efeito de pulso quando ativo
    pulseEffect: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(0, 168, 107, 0.3)',
    },
    
    // Status na parte inferior
    statusContainer: {
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    
    statusText: {
        fontSize: 16,
        color: colors.white,
        textAlign: 'center',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
        overflow: 'hidden',
    },
    picker: {
    width: '100%',
    height: 50,
    backgroundColor: '#f9f9f9',
    },

    subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: Colors.darckgreen,
    },

    modal_subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 10,
    color: Colors.green,
    },


    // ========================================================
    // ESTILOS ESPECÍFICOS DA PÁGINA DE ESTATÍSTICAS
    // (usar prefixo "stats_" para evitar conflitos)
    // ========================================================

    // Container principal
    stats_container: {
        flex: 1,
        padding: 20,
        paddingBottom: 40,
        backgroundColor: colors.zinc,
    },

    // Cabeçalho
    stats_header: {
        marginBottom: 20
    },

    // Seletor de período
    stats_periodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    stats_periodButton: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: colors.lightGray,
        alignItems: 'center'
    },
    stats_periodButtonActive: {
        backgroundColor: colors.green
    },
    stats_periodButtonText: {
        color: colors.dark
    },
    stats_periodButtonTextActive: {
        color: colors.white
    },

    // Containers de gráficos
    stats_chartContainer: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    stats_chartTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.dark,
        marginBottom: 10,
        textAlign: 'center'
    },
    stats_chart: {
        borderRadius: 8,
        marginTop: 10
    },

    // Legenda
    stats_legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 10
    },
    stats_legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5
    },
    stats_legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 5
    },
    stats_legendText: {
        fontSize: 12,
        color: colors.dark
    },

    // Cards de resumo
    stats_cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    stats_card: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 15,
        marginHorizontal: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    stats_cardTitle: {
        fontSize: 14,
        color: colors.dark,
        marginBottom: 5
    },
    stats_cardValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.green
    },

    chartScrollContainer: {
        height: 250, // Altura fixa para o container
        marginBottom: 20,
      },
      
      // Estilo para o gráfico dentro do scroll
      chartInScroll: {
        paddingRight: 20, // Espaço no final para não cortar
      },

    // ========================================================
    // MEDIDAS RESPONSIVAS
    // ========================================================
    
    chartWidth: {
        width: Dimensions.get("window").width - 40
    },
    chartHeight: {
        height: 200
    },


    fieldContainer: {
        marginBottom: 15,
    },

    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressInput: {
        flex: 1,
        marginRight: 10,
    },
    locationButton: {
        padding: 10,
    },
    descriptionInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },

    photoSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    uploadingText: {
        color: '#00A86B',
        marginTop: 5,
        fontSize: 12,
    },
    coordinatesText: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
        fontStyle: 'italic',
    },
    selectedChip: {
        backgroundColor: Colors.lightGray,
        borderRadius: 15,
        padding: 8,
        margin: 4,
        flexDirection: 'row',
        alignItems: 'center'
    },
    removeButton: {
        marginLeft: 8
    },
    cancelButton: {
        backgroundColor: Colors.darkZinc,
        marginRight: 12,
        width: 100,
    },
    saveButton: {
        backgroundColor: Colors.green,
        width: 100,
    },
    modalSubtitle: {
        fontSize: 18,
        color: Colors.gray,
        marginBottom: 20,
        marginTop: 15,
    },
    funcionarioItemLast: {
        marginBottom: 0, // Remove a margem inferior do último item
    },

    inputError: {
        borderColor: Colors.red,
        borderWidth: 1,
    },


});

