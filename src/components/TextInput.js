import { useFonts, Inter_600SemiBold, Inter_400Regular } from "@expo-google-fonts/inter";
import { StyleSheet, TextInput as ReactNativeTextInput, Keyboard, Platform, View, TouchableOpacity } from "react-native"
import { Ionicons, FontAwesome } from "@expo/vector-icons";

function TextInput(props) {
    
    // Destructure all props and set default values
    const {
        
        // Affects the TextInput
        bold = false,
        value = "",
        color = "black",
        fontSize = 15,
        placeholder = "",
        secureTextEntry = false,
        autoComplete="off",
        autoCorrect=false,
        editable=true,
        keyboardType="default",
        scrollEnabled = true,
        
        textInputStyle = {},
        textInputProps={},
        onEndEditing = () => {},
        onChangeText = () => {},
        onSubmitEditing = () => {},
        onBlur = () => {},
        onFocus = () => {},
        
        
        // Affects the container
        backgroundColor = "white",
        borderColor = "lightgrey",
        borderWidth = 1,
        height = 40,
        width = "30%",
        marginTop = "0%",
        marginBottom = "0%",
        marginRight = "0%",
        marginLeft = "0%",
        multiline = false,
        mainContainerStyle = {},
        
        // Affects icons
        iconRightType = "Ionicons",
        iconLeftType = "Ionicons",
        iconFontSize = fontSize,
        iconLeft = "",
        iconRight = "",
        displayLeftIcon = iconLeft !== "" ? "flex" : "none",
        displayRightIcon = iconRight !== "" ? "flex" : "none",
        iconRightOnPress = () => {},        
        leftContainerStyle = {},
        rightContainerStyle = {},

        ...restOfProps
    } = props;
    

    // Loads appropriate font
    let [fontsLoaded] = useFonts({ Inter_600SemiBold, Inter_400Regular });
    const fontFamily = fontsLoaded ? (bold ? "Inter_600SemiBold" : "Inter_400Regular") : (Platform.OS === "ios" ? "AppleSDGothicNeo-Medium" : "sans-serif-medium");

    const styles = StyleSheet.create({
        textInput: {
            flex: 1,
            margin: "0%",
            paddingHorizontal: "3%",

            textAlignVertical: "center",
            
            fontSize: fontSize,
            fontFamily: fontFamily,
            color: color,

            ...textInputStyle,
      },
        mainContainer: {
            flexDirection: 'row',
            height: height,
            width: width, 
            backgroundColor: backgroundColor,
            borderRadius: 10,
            borderColor: borderColor,
            borderWidth: borderWidth,
            marginTop: marginTop,
            marginRight: marginRight,
            marginLeft: marginLeft,
            marginBottom: marginBottom,
            alignItems: "center",

            ...mainContainerStyle
      }, 
        leftContainer: {
            display: displayLeftIcon,
            marginLeft: "3%",
            justifyContent: "center",
            ...leftContainerStyle
      }, 
        rightContainer: {
            display: displayRightIcon,
            marginRight: "3%",
            justifyContent: "center",
            ...rightContainerStyle
      },
    });
  
    return (
        <View style={styles.mainContainer}>
            <View style={styles.leftContainer}>
                {iconLeftType === "Ionicons" && <Ionicons size={iconFontSize} name={iconLeft} />}
                {iconLeftType === "FontAwesome" && <FontAwesome size={iconFontSize} name={iconLeft} />}
            </View>
            <ReactNativeTextInput 
                style={styles.textInput}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={"darkgrey"}
                autoCapitalize={false}
                autoComplete={autoComplete}
                autoCorrect={autoCorrect}
                value={value}
                multiline={multiline}
                onSubmitEditing={onSubmitEditing}
                secureTextEntry={secureTextEntry}
                editable={editable}
                keyboardType={keyboardType}
                scrollEnabled={scrollEnabled}
                onBlur={onBlur}
                onEndEditing={onEndEditing}
                onFocus={onFocus}

                {...textInputProps}
            />
            <TouchableOpacity onPress={iconRightOnPress} style={styles.rightContainer}>
                {iconRightType === "Ionicons" && <Ionicons size={iconFontSize} name={iconRight} />}
                {iconRightType === "FontAwesome" && <FontAwesome size={iconFontSize} name={iconRight} />}
            </TouchableOpacity>
        </View>
    );
  }

  export default TextInput;