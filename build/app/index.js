"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Colors_1 = __importDefault(require("@/constants/Colors"));
var react_native_1 = require("react-native");
var styles_1 = __importDefault(require("@/assets/styles"));
function Index() {
    return (<react_native_1.View style={styles_1.default.container}>

            <react_native_1.ActivityIndicator size={88} color={Colors_1.default.green}/>

        </react_native_1.View>);
}
exports.default = Index;
