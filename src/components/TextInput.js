import { useFonts, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { StyleSheet, TextInput as ReactNativeTextInput, Keyboard, Platform } from "react-native"

// Accessible props: 
// value, placeholder, color, fontSize, onChangeText, onSubmitEditing, width, height, multiline
function TextInput(props) {

    let [fontsLoaded] = useFonts({ Inter_600SemiBold });
    const value = props.value ? props.value : "";
    const placeholder = props.placeholder ? props.placeholder : "";
    const color = props.color ? props.color : "white";
    const fontSize = props.fontSize ? props.fontSize : 12;
    const fontFamily = fontsLoaded ? "Inter_600SemiBold" : (Platform.OS === "ios" ? "AppleSDGothicNeo-Medium" : "sans-serif-medium");
  
    const onChangeText = props.onChangeText ? props.onChangeText : () => {};
    const onSubmitEditing = props.onSubmitEditing ? props.onSubmitEditing : () => {};
  
    // Restricts TextInput into a fixed rectangle defined by width and height
    const width = props.width ? props.width : "30%";
    const minWidth = width;
    const maxWidth = width;
    const height = props.height ? props.height : "5%";
    const minHeight = height;
    const maxHeight = height;
   
    // Used for responses that take up more than 1 line.
    // Users can type and have text wrapping continue on a new line.
    // Make sure to set appropriate height and width if using multiline
    const multiline = props.multiline ? props.multiline : false; 
  
    const styles = StyleSheet.create({
      textInput: {
        backgroundColor: "#5DB075",
        margin: "0%",
        minWidth: minWidth,
        minHeight: minHeight,
        maxWidth: maxWidth,
        maxHeight: maxHeight,
        borderRadius: "10%",
        paddingHorizontal: "3%",
        
        // Placeholder is top left of TextInput if multiline, else centered (single line)
        textAlignVertical: multiline ? "top" : "center",
        
        fontWeight: "bold",
        fontSize: fontSize,
        fontFamily: fontFamily,
        color: color,
      }
    });
  
    return (
      <ReactNativeTextInput 
        style={styles.textInput}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={"rgba(255, 255, 255, .8)"}
        autoCapitalize={false}
        value={value}
        multiline={multiline}
        blurOnSubmit={true}
        onSubmitEditing={(e) => {Keyboard.dismiss(); onSubmitEditing(e);} }
      >
      </ReactNativeTextInput>
    )
  }

  export default TextInput;