import React from "react";
interface MonthPickerProps {
    visible: boolean;
    onClose: () => void;
    onSelectMonth: (monthIndex: number) => void;
}
declare const MonthPicker: React.FC<MonthPickerProps>;
export default MonthPicker;
