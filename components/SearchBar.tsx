// SearchBar.tsx
import { icons } from "@/constants/icons";
import { Image, NativeSyntheticEvent, TextInput, TextInputSubmitEditingEventData, View } from "react-native";

interface Props {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  // Add onSubmitEditing to the interface
  onSubmitEditing?: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
}

const SearchBar = ({
  placeholder,
  value,
  onChangeText,
  onPress,
  onSubmitEditing // Destructure the new prop
}: Props) => {
  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <Image
        source={icons.search}
        className="w-5 h-5"
        resizeMode="contain"
        tintColor="#AB8BFF"
      />
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        // Pass onSubmitEditing to the TextInput
        onSubmitEditing={onSubmitEditing}
        className="flex-1 ml-2 text-white"
        placeholderTextColor="#A8B5DB"
      />
    </View>
  );
};

export default SearchBar;