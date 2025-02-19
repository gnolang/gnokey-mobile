import { Spacer, Text } from "../../modules/ui-components";
import Icons from "components/icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-components";

export type Props = {
  subtitle?: string;
  title?: string;
  color?: string;
  onClose?: () => void;
  iconType?: "close" | "arrowLeft";
};

export function ModalHeaderTitle(props: Props) {
  return (
    <View style={{ alignSelf: "center" }}>
      <Text.H2 style={{ color: props.color }}>{props.title}</Text.H2>
      <Spacer />
    </View>
  )
}

function ModalHeader(props: Props) {
  const { title, subtitle, iconType = "close", onClose } = props;

  const saveAndClose = () => {
    onClose && onClose();
  };

  return (
    <Content>
      <TouchableStyled onPress={saveAndClose}>
        {iconType === "close" ? <Icons.Close color="#667386" /> : <Icons.ArrowLeft />}
      </TouchableStyled>
      <View>
        <Text.H1>{title}</Text.H1>
        <Text.H2>{subtitle}</Text.H2>
      </View>
    </Content>
  );
}

const Content = styled(View)`
  height: 76px;
  padding-top: 18px;
`;

const TouchableStyled = styled(TouchableOpacity)`
  position: absolute;
  padding-top: 18px;
  padding-left: 12px;
  z-index: 1;
`;

export default ModalHeader;
