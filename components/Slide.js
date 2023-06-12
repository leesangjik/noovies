import React from "react";
import styled from "styled-components/native";
import { makeImgPath } from "../utils";
import Poster from "./Poster";
import { TouchableWithoutFeedback, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const BgImg = styled.Image``;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: white;
`;

const Wrapper = styled.View`
  flex-direction: row;
  height: 100%;
  width: 90%;
  margin: 0 auto;
  justify-content: space-around;
  align-items: center;
`;

const Column = styled.View`
  width: 60%;
`;

const Overview = styled.Text`
  margin-top: 10px;
  color: white;
`;

const Votes = styled(Overview)`
  font-size: 12px;
`;

const Slide = ({
  backdropPath,
  posterPath,
  originalTitle,
  voteAverage,
  overview,
  fullData,
}) => {
  const navigation = useNavigation();
  const goToDetail = () => {
    navigation.navigate("Stack", {
      screen: "Detail",
      params: {
        ...fullData,
      },
    });
  };
  return (
    <TouchableWithoutFeedback onPress={goToDetail}>
      <View style={{ flex: 1 }}>
        <BgImg
          style={StyleSheet.absoluteFill}
          source={{ uri: makeImgPath(backdropPath) }}
        />

        <Wrapper>
          <Poster path={posterPath} />
          <Column>
            <Title>{originalTitle}</Title>
            {voteAverage > 0 ? <Votes>⭐️ {voteAverage}/10</Votes> : null}
            <Overview>{overview.slice(0, 100)}...</Overview>
          </Column>
        </Wrapper>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Slide;
