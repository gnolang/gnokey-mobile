import { formatDistanceToNow } from "date-fns";
import Text from "../text";
import { colors } from "@/assets/styles/colors";

function TimeStampLabel({ timestamp }: { timestamp: string }) {
  return (
    <Text.Caption1 style={{ color: colors.text.secondary }}>
      {formatDistanceToNow(new Date(timestamp), { addSuffix: false })}
    </Text.Caption1>
  );
}

export default TimeStampLabel;
