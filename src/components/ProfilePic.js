import { Image } from "react-native";
const ProfilePic = (props) => {
  return (
    <Image
      style={{
        backgroundColor: "#5DB075",
        borderWidth: 2,
        borderColor: "#5DB075",
        width: props.size ?? 60,
        height: props.size ?? 60,
        borderRadius: 30,
        marginRight: 10,
      }}
      source={props.uri ? { uri: props.uri } : require("../../assets/big_logo.png")}
    />
  );
};

export default ProfilePic;
