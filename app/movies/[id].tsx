import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import { getSavedMovie, toggleSave } from "@/services/appwrite"; // Import new functions
import useFetch from "@/services/useFetch";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );

  // Use state to track the save status and to manage a loading state for the save button
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // This is a placeholder for the current user's ID. You would replace this
  // with the actual user ID from your authentication system.
  const userId = "test-user-id"; 

  // Check the save status of the movie when the component mounts or when movie data is available
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (movie) {
        const savedMovie = await getSavedMovie(movie.id.toString(), userId);
        setIsSaved(!!savedMovie); // Set to true if a saved movie is found
      }
    };
    checkSavedStatus();
  }, [movie, userId]);

  const handleToggleSave = async () => {
    if (!movie || saveLoading) return;

    setSaveLoading(true);
    try {
      await toggleSave(movie, userId);
      setIsSaved(!isSaved); // Optimistically update the UI
    } catch (error) {
      console.error("Failed to toggle save status:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />

          <TouchableOpacity className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center">
            <Image
              source={icons.play}
              className="w-6 h-7 ml-1"
              resizeMode="stretch"
            />
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />

            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>

            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>
          
          {/* Add the Save/Unsave Button */}
          <TouchableOpacity 
            className="mt-5 px-5 py-3 rounded-lg flex flex-row items-center justify-center" 
            style={{ backgroundColor: isSaved ? '#AB8BFF' : '#575757' }}
            onPress={handleToggleSave}
            disabled={saveLoading}
          >
            {saveLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Image 
                  source={icons.save} 
                  className="size-5 mr-2" 
                  tintColor="#fff" 
                />
                <Text className="text-white font-semibold text-base">
                  {isSaved ? "Unsave" : "Save"}
                </Text>
              </>
            )}
          </TouchableOpacity>
          
          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movie?.revenue ?? 0) / 1_000_000
              )} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;