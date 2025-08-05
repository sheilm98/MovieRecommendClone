### Project Readme

# Movie Discovery App

Welcome to my Movie Discovery App\! This project was built using Expo and React Native, with a focus on modern development practices and integrating a robust backend using Appwrite.

This project is based on the following YouTube tutorial: [https://www.youtube.com/watch?v=6](https://youtu.be/f8Z9JyB2EIE?si=J01FnwhL0p14dcig)

### My Contributions and Future Plans

While I used the video course as a guide to learn the fundamentals of React Native, I have extended the project to include new features and functionality.

**Key Features & My Enhancements:**

  * **Movie Saving Functionality:** I implemented a complete save/unsave system using Appwrite. This allows users to save their favorite movies to a dedicated list, which persists across sessions.
  * **Future Feature Exploration (Profiles):** I am planning to explore adding user profile functionality in the future to further personalize the app experience.

### Technical Details

  * **Backend:** This app uses Appwrite, a self-hosted or cloud-based backend-as-a-service, for a variety of functions, including data storage and user authentication.
  * **Database Limitations:** It's worth noting that the free tier of Appwrite Cloud limits users to a single database per project. This is why all of the app's data, including search counts and saved movies, are managed within separate collections inside a single database. This was a key learning experience in how to structure data efficiently under a single-database constraint.

-----

### Get started

1.  Install dependencies

    ```bash
    npm install
    ```

2.  Start the app

    ```bash
    npx expo start
    ```

In the output, you'll find options to open the app in a

  - [development build](https://docs.expo.dev/develop/development-builds/introduction/)
  - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
  - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
  - [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

  - [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
  - [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

  - [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
  - [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.