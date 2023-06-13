import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React, { useState } from "react";
import { Dimensions, FlatList } from "react-native";
import styled from "styled-components/native";
import Swiper from "react-native-swiper";
import HMedia from "../components/HMedia";
import Slide from "../components/Slide";
import Loader from "../components/Loader";
import HList from "../components/HList";

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

const ComingSoonTitle = styled(ListTitle)`
  margin-bottom: 20px;
`;

const HSeparator = styled.View`
  width: 20px;
`;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Movies = () => {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const { data: nowPlayingData } = useQuery(["Moives", 1], () =>
    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1 
    }`,
      options
    ).then((response) => response.json())
  );

  const popularData = useInfiniteQuery(
    ["popular", 1],
    ({ pageParam }) =>
      fetch(
        `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${
          pageParam ?? 1
        }`,
        options
      ).then((response) => response.json()),
    {
      getNextPageParam: (CurrentPage) => {
        const nextPage = CurrentPage.page + 1;
        return nextPage > CurrentPage.total_pages ? null : nextPage;
      },
    }
  );

  const upcomingData = useInfiniteQuery(
    ["upcoming", 1],
    ({ pageParam }) =>
      fetch(
        `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${pageParam}`,
        options
      ).then((response) => response.json()),
    {
      getNextPageParam: (CurrentPage) => {
        const nextPage = CurrentPage.page + 1;
        return nextPage > CurrentPage.total_pages ? null : nextPage;
      },
    }
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["Moives"]);
    setRefreshing(false);
  };

  const MoreUpcomingMovies = () => {
    if (upcomingData.hasNextPage) {
      upcomingData.fetchNextPage();
    }
  };

  return nowPlayingData && upcomingData && popularData ? (
    <FlatList
      onEndReached={MoreUpcomingMovies}
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
            {nowPlayingData?.results
              ? nowPlayingData.results.map((movie) => (
                  <Slide
                    key={movie.id}
                    backdropPath={movie.backdrop_path || ""}
                    posterPath={movie.poster_path || ""}
                    originalTitle={movie.original_title}
                    voteAverage={movie.vote_average}
                    overview={movie.overview}
                    fullData={movie}
                  />
                ))
              : null}
          </Swiper>

          {popularData.data ? (
            <HList
              title="Popular Movies"
              data={popularData?.data?.pages
                ?.map((page) => page.results)
                .flat()}
            />
          ) : null}
          <ComingSoonTitle>Coming soon</ComingSoonTitle>
        </>
      }
      data={upcomingData?.data?.pages?.map((page) => page.results).flat()}
      keyExtractor={(item) => item.id + ""}
      ItemSeparatorComponent={HSeparator}
      renderItem={({ item }) => (
        <HMedia
          posterPath={item.poster_path || ""}
          originalTitle={item.original_title}
          overview={item.overview}
          releaseDate={item.release_date}
          fullData={item}
        />
      )}
    />
  ) : (
    <Loader />
  );
};

export default Movies;
