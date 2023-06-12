import React from "react";
import { FlatList, ScrollView, RefreshControl } from "react-native";
import Loader from "../components/Loader";
import VMedia from "../components/VMedia";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import HList from "../components/HList";

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
  const queryClient = useQueryClient();
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
  const refreshing =
    Results[0].isRefetching ||
    Results[1].isRefetching ||
    Results[2].isRefetching;

  const onRefresh = () => {
    queryClient.refetchQueries(["Tv"]);
  };
  return !Results[0]?.data ? (
    <Loader />
  ) : (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingVertical: 30 }}
    >
      <HList title="On The Air" data={Results[0]?.data.results} />
      <HList title="Popular TV" data={Results[1]?.data.results} />
      <HList title="Top Rated TV" data={Results[2]?.data.results} />
    </ScrollView>
  );
};

export default Tv;
