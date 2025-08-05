// app/(tabs)/search.tsx
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import MovieDisplayCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { fetchMovies, Movie } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";

// Define a stable empty array reference to prevent new array creations
const EMPTY_MOVIE_ARRAY: Movie[] = [];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const {
    data, // Raw data from useFetch
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch<Movie[] | null>(() => fetchMovies({ query: searchQuery }), false);

  // Ensure fetchedMovies is always an array, using a stable empty array reference
  // if `data` from useFetch is null or undefined.
  const fetchedMovies = data === null || data === undefined ? EMPTY_MOVIE_ARRAY : data;

  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);

  // Ref to store the last search query that successfully fetched movies (used for logging Appwrite)
  const lastSuccessfulFetchQuery = useRef<string | null>(null);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Debounced effect for triggering movie search (only fetches, does not update Appwrite)
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        loadMovies(); 
      } else {
        reset(); 
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery, loadMovies, reset]);

  // Effect to sync 'fetchedMovies' to 'displayedMovies'
  useEffect(() => {
    // Only update displayedMovies if fetchedMovies is different from displayedMovies by reference
    // OR if there's an error and displayedMovies isn't already empty.
    if (!loading && !error) {
      if (displayedMovies !== fetchedMovies) { // Check if the array reference has changed
        setDisplayedMovies(fetchedMovies);
        // If a successful fetch happened, update the ref for logging on submit
        if (fetchedMovies.length > 0) {
          lastSuccessfulFetchQuery.current = searchQuery;
        } else {
          lastSuccessfulFetchQuery.current = null; // Clear if no results
        }
      }
    } else if (error) {
      // If there's an error, clear displayedMovies only if it's not already empty
      if (displayedMovies.length > 0) {
        setDisplayedMovies(EMPTY_MOVIE_ARRAY); // Use stable empty array
      }
      lastSuccessfulFetchQuery.current = null; // Clear on error
    }
  }, [fetchedMovies, loading, error, displayedMovies, searchQuery]);

  // Function to handle explicit search submission (e.g., pressing Enter)
  const handleSearchSubmit = async () => {
    if (searchQuery.trim()) {
      try {
        const submittedMovies = await fetchMovies({ query: searchQuery });
        
        if (submittedMovies && submittedMovies.length > 0) {
          await updateSearchCount(searchQuery, submittedMovies[0]);
          setDisplayedMovies(submittedMovies);
          lastSuccessfulFetchQuery.current = searchQuery; // Update ref on successful submit fetch
        } else {
          setDisplayedMovies(EMPTY_MOVIE_ARRAY);
          lastSuccessfulFetchQuery.current = null; // Clear on no results
        }
      } catch (e: any) {
        console.error("Error fetching or updating search count on submit:", e.message);
        setDisplayedMovies(EMPTY_MOVIE_ARRAY);
        lastSuccessfulFetchQuery.current = null; // Clear on error
      }
    } else {
      reset(); 
      setDisplayedMovies(EMPTY_MOVIE_ARRAY);
      lastSuccessfulFetchQuery.current = null;
    }
  };

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        className="px-5"
        data={displayedMovies} 
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieDisplayCard {...item} />}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search for a movie"
                value={searchQuery}
                onChangeText={handleSearch}
                onSubmitEditing={handleSearchSubmit} 
              />
            </View>

            {loading && ( 
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {error && ( 
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}

            {!loading &&
              !error &&
              searchQuery.trim() &&
              displayedMovies.length > 0 && ( 
                <Text className="text-xl text-white font-bold">
                  Search Results for{" "}
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !loading && !error && displayedMovies.length === 0 && searchQuery.trim() ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                No movies found
              </Text>
            </View>
          ) : !loading && !error && !searchQuery.trim() ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                Start typing to search for movies
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;