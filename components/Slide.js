import React from "react";
import styled from "styled-components/native";
import { makeImgPath } from "../utils";
import Poster from "./Poster";
import { View } from "react-native";
import { StyleSheet } from "react-native";

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

const OverView = styled.Text`
  margin-top: 10px;
  color: white;
`;

const Vote = styled(OverView)`
  font-size: 12px;
`;

const Slide = ({
  backdropPath,
  posterPath,
  originalTitle,
  voteAverage,
  overview,
}) => {
  return (
    <View style={{ flex: 1 }}>
      <BgImg
        source={{ uri: makeImgPath(backdropPath) }}
        style={StyleSheet.absoluteFill}
        blurRadius={80}
      />
      <Wrapper>
        <Poster path={posterPath} />
        <Column>
          <Title>{originalTitle}</Title>
          {voteAverage > 0 ? <Vote>👍{voteAverage}/10</Vote> : null}
          <OverView>{overview.slice(0, 100)}...</OverView>
        </Column>
      </Wrapper>
    </View>
  );
};

export default Slide;
