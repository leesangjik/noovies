import { useQueries, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import styled from "styled-components/native";
import HList from "../components/HList";
import Loader from "../components/Loader";

const Container = styled.ScrollView``;

const SearchBar = styled.TextInput`
  background-color: white;
  padding: 10px 15px;
  border-radius: 15px;
  width: 90%;
  margin: 10px auto;
  margin-bottom: 40px;
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

const Search = () => {
  const [query, setQuery] = useState("");
  const onChangeText = (text) => setQuery(text);

  const Items = ["movie", "tv"];
  const Results = useQueries({
    queries: Items.map((item) => {
      return {
        queryKey: ["Search", query],
        queryFn: ({ queryKey }) => {
          const [_, content] = queryKey;
          return fetch(
            `https://api.themoviedb.org/3/search/${item}?&language=en-US&page=1&query=${content}`,
            options
          ).then((response) => response.json());
        },
        enabled: false,
      };
    }),
  });
  const onSubmit = () => {
    if (query === "") {
      return;
    }
    Results[0].refetch();
    Results[1].refetch();
  };
  return (
    <Container>
      <SearchBar
        placeholder="Search for Movie or TV Show"
        placeholderTextColor="grey"
        returnKeyType="search"
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
      />
      {Results[0]?.isFetching && Results[1]?.isFetching ? <Loader /> : null}
      {Results[0]?.data ? (
        <HList title="Movie Results" data={Results[0]?.data.results} />
      ) : null}
      {Results[1]?.data ? (
        <HList title="TV Results" data={Results[1]?.data.results} />
      ) : null}
    </Container>
  );
};

export default Search;
