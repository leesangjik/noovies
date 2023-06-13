import React, { useCallback, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Linking,
  Button,
  Alert,
  Share,
  Platform,
} from "react-native";
import styled from "styled-components/native";
import Poster from "../components/Poster";
import { makeImgPath } from "../utils";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/Loader";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { TouchableOpacity } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Container = styled.ScrollView``;

const Header = styled.View`
  height: ${SCREEN_HEIGHT / 4}px;
  justify-content: flex-end;
  padding: 0px 20px;
`;

const Column = styled.View`
  flex-direction: row;
  width: 80%;
`;
const Title = styled.Text`
  color: white;
  font-size: 30px;
  align-self: flex-end;
  margin-left: 15px;
  font-weight: 500;
`;

const Overview = styled.Text`
  color: black;

  margin: 20px 0;
`;

const VideoBtn = styled.TouchableOpacity`
  flex-direction: row;
`;
const BtnText = styled.Text`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 5px;
  line-height: 24px;
  margin-left: 5px;
`;

const Data = styled.View`
  padding: 0px 20px;
`;

const Background = styled.Image``;

//---------------------------
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZWYxZTkzMjFkMTViNjk5YWFiYzEwOWUxYjlhN2MxNyIsInN1YiI6IjY0ODJmZGM1ZTM3NWMwMDEzOWJmNWEyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mwkDD_hF52XP3hV_f975Yrwq2k7sqMp9dtVrJh-U7QI",
  },
};
//---------------------------

const OpenURLButton = ({ url, name, content }) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await WebBrowser.openBrowserAsync(url);
    } else {
      await WebBrowser.openBrowserAsync(
        `https://www.google.com/search?q=${content}`
      );
      // console.log(supported, url, " //Key is", content);
      // Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return <Button title={name} onPress={handlePress} />;
};

const Detail = ({ navigation: { setOptions }, route: { params } }) => {
  const isMovie = "original_title" in params;
  const Results = useQuery({
    queryKey: [isMovie ? "movie" : "tv", params.id],
    queryFn: ({ queryKey }) => {
      const [_, id] = queryKey;
      return fetch(
        `https://api.themoviedb.org/3/${
          isMovie ? "movie" : "tv"
        }/${id}?append_to_response=videos,images`,
        options
      ).then((response) => response.json());
    },
  });

  const shareMedia = async () => {
    const isAndroid = Platform.OS === "android";
    const homepage = isMovie
      ? `https://www.imdb.com/title/${Results.data.imdb_id}`
      : Results.data.homepage;
    if (isAndroid) {
      await Share.share({
        message: `${params.overview}\n Check it out: ${homepage}`,
        title:
          "original_title" in params
            ? params.original_title
            : params.original_name,
      });
    }
    await Share.share({
      url: homepage,
      title:
        "original_title" in params
          ? params.original_title
          : params.original_name,
    });
  };
  const ShareButton = () => (
    <TouchableOpacity onPress={shareMedia}>
      <Ionicons name="share-outline" size={20} />
    </TouchableOpacity>
  );

  useEffect(() => {
    setOptions({
      title: "original_title" in params ? "Movie" : "TV Show",
    });
  }, []);

  useEffect(() => {
    if (Results.data) {
      setOptions({
        headerRight: () => <ShareButton />,
      });
    }
  }, []);

  return (
    <Container>
      <Header>
        <Background
          style={StyleSheet.absoluteFill}
          source={{ uri: makeImgPath(params.backdrop_path) || "" }}
        />
        <LinearGradient
          // Background Linear Gradient
          colors={["rgba(0,0,0,0.8)", "transparent"]}
          style={StyleSheet.absoluteFill}
        />
        <Column>
          <Poster path={params.poster_path || ""} />
          <Title>
            {"original_title" in params
              ? params.original_title
              : params.original_name}
          </Title>
        </Column>
      </Header>
      <Data>
        <Overview>{params.overview ? params.overview : "No overview"}</Overview>
        {Results.isInitialLoading ? <Loader /> : null}
        {Results?.data?.videos?.results?.map((video) => (
          // <VideoBtn key={video.key} onpress={() => openYTLink(video.key)}>
          //   <Ionicons name="logo-youtube" size={24} />
          //   <BtnText>{video.name}</BtnText>
          // </VideoBtn>
          <OpenURLButton
            key={video.id}
            content={video.key}
            name={video.name}
            url={`https://youtu.be/${video.key}`}
          ></OpenURLButton>
        ))}
      </Data>
    </Container>
  );
};

export default Detail;
