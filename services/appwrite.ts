import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
// Add your new collection ID for saved movies. Make sure to add this to your .env file
const SAVE_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVE_COLLECTION_ID!; 

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: any) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

// New function to check if a movie is already saved
export const getSavedMovie = async (movieId: string, userId: string) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, SAVE_COLLECTION_ID, [
      Query.equal("movieId", movieId),
      Query.equal("userId", userId),
    ]);
    // Return the first document if found, otherwise null
    return result.documents.length > 0 ? result.documents[0] : null;
  } catch (error) {
    console.error("Error checking saved movie:", error);
    return null;
  }
};

// New function to save or unsave a movie
export const toggleSave = async (movie: any, userId: string) => {
  try {
    // Check if the movie is already saved
    const existingSave = await getSavedMovie(movie.id.toString(), userId);

    if (existingSave) {
      // Movie is already saved, so unsave it (delete the document)
      await database.deleteDocument(DATABASE_ID, SAVE_COLLECTION_ID, existingSave.$id);
      return { action: 'unsaved', success: true };
    } else {
      // Movie is not saved, so save it (create a new document)
      await database.createDocument(DATABASE_ID, SAVE_COLLECTION_ID, ID.unique(), {
        userId,
        movieId: movie.id.toString(),
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date
      });
      return { action: 'saved', success: true };
    }
  } catch (error) {
    console.error("Error toggling save status:", error);
    throw error;
  }
};

// New function to fetch all saved movies for a specific user
export const getSavedMovies = async (userId: string) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, SAVE_COLLECTION_ID, [
      Query.equal("userId", userId),
      Query.orderDesc("$createdAt"), // Order by creation date to show recent saves first
    ]);
    return result.documents;
  } catch (error) {
    console.error("Error fetching saved movies:", error);
    return [];
  }
};