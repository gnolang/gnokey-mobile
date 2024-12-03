import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import * as Clipboard from "expo-clipboard";

interface Props {
    text?: string;
    style?: StyleProp<ViewStyle> | undefined;
    children?: React.ReactNode;
}

const TextCopy = ({ text, style, children }: Props) => {

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(text || "");
    };

    return (
        <TouchableOpacity onPress={copyToClipboard} style={style}>
            {children}
        </TouchableOpacity>
    );
}

export default TextCopy;