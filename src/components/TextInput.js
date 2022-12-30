import { useFonts, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { StyleSheet, TextInput as ReactNativeTextInput, Keyboard, Platform, View, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons";

// Accessible props: 
// value, placeholder, color, fontSize, onChangeText, onSubmitEditing, width, height, multiline
function TextInput(props) {

    // Affects the TextInput
    let [fontsLoaded] = useFonts({ Inter_600SemiBold });
    const value = props.value ? props.value : "";
    const placeholder = props.placeholder ? props.placeholder : "";
    const color = props.color ? props.color : "white";
    const fontSize = props.fontSize ? props.fontSize : 17;
    const fontFamily = fontsLoaded ? "Inter_600SemiBold" : (Platform.OS === "ios" ? "AppleSDGothicNeo-Medium" : "sans-serif-medium");

    const onChangeText = props.onChangeText ? props.onChangeText : () => {};
    const onSubmitEditing = props.onSubmitEditing ? props.onSubmitEditing : () => {};
  
    // Affects the container
    // Restricts TextInput into a fixed rectangle defined by width and height
    const backgroundColor = props.backgroundColor ? props.backgroundColor : "#5DB075";
    const width = props.width ? props.width : "30%";
    const minWidth = width;
    const maxWidth = width;
    const height = props.height ? props.height : "5%";
    const minHeight = height;
    const maxHeight = height;
   
    const multiline = props.multiline ? props.multiline : false;
    

    // Affects icons
    const displayLeftIcon = multiline ? "none" : "flex";
    const displayRightIcon = displayLeftIcon;
    const iconLeft = props.iconLeft ? props.iconLeft : "";
    const iconLeftFontSize = props.iconLeftFontSize ? iconLeftFontSize : fontSize;
    const iconRight = props.iconRight ? props.iconRight : "";
    const iconRightFontSize = props.iconRightFontSize ? iconRightFontSize : fontSize;
    const iconRightOnPress = props.iconRightOnPress ? props.iconRightOnPress : () => {};

    const styles = StyleSheet.create({
      textInput: {
        flex: 1,
        margin: "0%",
        paddingHorizontal: "3%",
        
        // Placeholder is top left of TextInput if multiline, else centered (single line)
        textAlignVertical: multiline ? "top" : "center",
        
        fontWeight: "bold",
        fontSize: fontSize,
        fontFamily: fontFamily,
        color: color,
      },
      mainContainer: {
        flexDirection: 'row', 
        minWidth: minWidth,
        minHeight: minHeight,
        maxWidth: maxWidth,
        maxHeight: maxHeight,
        backgroundColor: backgroundColor,
        borderRadius: "10%",
        borderColor: ""
      }, leftContainer: {
        display: displayLeftIcon,
        fontSize: iconLeftFontSize,
        marginLeft: "3%",
        justifyContent: "center",
      }, rightContainer: {
            display: displayRightIcon,
            fontSize: iconRightFontSize,
            marginRight: "3%",
            justifyContent: "center",
      },
    });
  
    return (
    <View style={styles.mainContainer}>
        <View style={styles.leftContainer}>
            <Ionicons name={iconLeft} />
        </View>
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
        <TouchableOpacity onPress={iconRightOnPress} style={styles.rightContainer}>
            <Ionicons name={iconRight} />
        </TouchableOpacity>
    </View>
    )
  }

  export default TextInput;