import MovieCard from "@/components/MovieCard";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants/icons";
import { getSavedMovies } from "@/services/appwrite";

const saved = () => {
  const [savedMovies, setSavedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = "test-user-id"; // Replace with your actual user ID

  useEffect(() => {
    const fetchSavedMovies = async () => {
      setLoading(true);
      const movies = await getSavedMovies(userId);
      setSavedMovies(movies);
      setLoading(false);
    };
    fetchSavedMovies();
  }, [userId]);

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1 px-10">
      <View className="flex flex-row items-center justify-start mt-5">
        <Image source={icons.save} className="size-8" tintColor="#fff" />
        <Text className="text-white font-bold text-2xl ml-3">Saved Movies</Text>
      </View>
      
      {savedMovies.length > 0 ? (
        <FlatList
          data={savedMovies}
          renderItem={({ item }) => (
            <MovieCard 
              id={item.movieId} 
              poster_path={item.poster_path} 
              title={item.title} 
              vote_average={item.vote_average} 
              release_date={item.release_date} 
            />
          )}
          keyExtractor={(item) => item.$id}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: 'flex-start',
            gap: 20,
            paddingRight: 5,
            marginBottom: 10
          }}
          className="mt-5 pb-32"
        />
      ) : (
        <View className="flex justify-center items-center flex-1 flex-col gap-5">
          <Image source={icons.save} className="size-10" tintColor="#fff" />
          <Text className="text-gray-500 text-base">No saved movies yet.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default saved;