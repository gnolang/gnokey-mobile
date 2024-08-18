import { StyleProp, TextStyle, TouchableOpacity } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import Text from "../text";
import { Post } from "@/types";
import { colors } from "@/assets/styles/colors";

interface Props {
  style?: StyleProp<TextStyle> | undefined;
  onPressRepost: (post: Post) => void;
  post: Post;
}

function RepostButton({ style, onPressRepost, post }: Props) {
  const onPress = () => {
    if (post.repost_parent) {
      onPressRepost(post.repost_parent);
    } else {
      onPressRepost(post);
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={[style, { flexDirection: "row", paddingHorizontal: 12, alignItems: "center" }]}>
      <MaterialCommunityIcons name="arrow-u-left-top" size={16} color={colors.text.secondary} />
      <Text.Caption1 style={{ color: colors.text.secondary }}>Repost</Text.Caption1>
    </TouchableOpacity>
  );
}

export default RepostButton;
