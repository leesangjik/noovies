import React from "react";
import styled from "styled-components/native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import Loader from "../components/Loader";
import VMedia from "../components/VMedia";
import { useQueries } from "@tanstack/react-query";

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

const Tv = () => {
  const Items = ["on_the_air", "popular", "top_rated"];
  const Results = useQueries({
    queries: Items.map((item) => {
      return {
        queryKey: ["Tv", item],
        queryFn: () =>
          fetch(
            `https://api.themoviedb.org/3/tv/${item}?language=en-US&page=1`,
            options
          ).then((response) => response.json()),
      };
    }),
  });
  return Results[0]?.data ? (
    <ScrollView>
      <FlatList
        data={Results[0]?.data?.results}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <VMedia
            posterPath={item.poster_path}
            originalTitle={item.original_name}
            voteAverage={item.vote_average}
          />
        )}
      />
      <FlatList
        data={Results[1]?.data?.results}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <VMedia
            posterPath={item.poster_path}
            originalTitle={item.original_name}
            voteAverage={item.vote_average}
          />
        )}
      />
      <FlatList
        data={Results[2]?.data?.results}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <VMedia
            posterPath={item.poster_path}
            originalTitle={item.original_name}
            voteAverage={item.vote_average}
          />
        )}
      />
    </ScrollView>
  ) : (
    <Loader />
  );
};

export default Tv;
