"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var styles_1 = __importDefault(require("@/assets/styles"));
// Lista de meses
var months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];
// Componente MonthPicker
var MonthPicker = function (_a) {
    var visible = _a.visible, onClose = _a.onClose, onSelectMonth = _a.onSelectMonth;
    return (<react_native_1.Modal transparent={true} visible={visible} animationType="slide" onRequestClose={onClose}>
            <react_native_1.View style={styles_1.default.modalOverlay}>
                <react_native_1.View style={styles_1.default.modalContent}>
                    <react_native_1.Text style={styles_1.default.modalTitle}>Selecione o Mês</react_native_1.Text>
                    {months.map(function (month, index) { return (<react_native_1.Pressable key={index} style={styles_1.default.monthItem} onPress={function () { return onSelectMonth(index); }}>
                            <react_native_1.Text style={styles_1.default.monthText}>{month}</react_native_1.Text>
                        </react_native_1.Pressable>); })}
                    <react_native_1.Pressable style={styles_1.default.closeButton} onPress={onClose}>
                        <react_native_1.Text style={styles_1.default.closeButtonText}>Fechar</react_native_1.Text>
                    </react_native_1.Pressable>
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.Modal>);
};
exports.default = MonthPicker;
