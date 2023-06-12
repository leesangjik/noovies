import { useQueries, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Dimensions, FlatList } from "react-native";
import styled from "styled-components/native";
import Swiper from "react-native-swiper";
import HMedia from "../components/HMedia";
import VMedia from "../components/VMedia";
import Slide from "../components/Slide";
import Loader from "../components/Loader";

const ListTitle = styled.Text`
  color: black;
  font-size: 18px;
  font-weight: 600;
  margin-left: 30px;
`;

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

const ListContainer = styled.View`
  margin-bottom: 40px;
`;

const ComingSoonTitle = styled(ListTitle)`
  margin-bottom: 20px;
`;

const VSeparator = styled.View`
  width: 20px;
`;
const HSeparator = styled.View`
  width: 20px;
`;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Movies = () => {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const Items = ["now_playing", "popular", "upcoming"];
  const Results = useQueries({
    queries: Items.map((item) => {
      return {
        queryKey: ["Moives", item],
        queryFn: () =>
          fetch(
            `https://api.themoviedb.org/3/movie/${item}?language=en-US&page=1`,
            options
          ).then((response) => response.json()),
      };
    }),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["Moives"]);
    setRefreshing(false);
  };

  return Results[0]?.data ? (
    <FlatList
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListHeaderComponent={
        <>
          <Swiper
            horizontal
            loop
            autoplay
            autoplayTimeout={3.5}
            showsButtons={false}
            showsPagination={false}
            containerStyle={{
              marginBottom: 40,
              width: "100%",
              height: SCREEN_HEIGHT / 4,
            }}
          >
            {Results[0]?.data?.results.map((movie) => (
              <Slide
                key={movie.id}
                backdropPath={movie.backdrop_path || ""}
                posterPath={movie.poster_path || ""}
                originalTitle={movie.original_title}
                voteAverage={movie.vote_average}
                overview={movie.overview}
              />
            ))}
          </Swiper>
          <ListContainer>
            <ListTitle>Popular Movies</ListTitle>
            {Results[1]?.data?.results ? (
              <FlatList
                style={{ marginTop: 20 }}
                horizontal
                data={Results[1]?.data.results}
                keyExtractor={(item) => item.id + ""}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 30 }}
                ItemSeparatorComponent={VSeparator}
                renderItem={({ item }) => (
                  <VMedia
                    posterPath={item.poster_path || ""}
                    originalTitle={item.original_title}
                    voteAverage={item.vote_average}
                  />
                )}
              />
            ) : null}
          </ListContainer>
          <ComingSoonTitle>Coming soon</ComingSoonTitle>
        </>
      }
      data={Results[2]?.data?.results}
      keyExtractor={(item) => item.id + ""}
      ItemSeparatorComponent={HSeparator}
      renderItem={({ item }) => (
        <HMedia
          posterPath={item.poster_path || ""}
          originalTitle={item.original_title}
          overview={item.overview}
          releaseDate={item.release_date}
        />
      )}
    />
  ) : (
    <Loader />
  );
};

export default Movies;
