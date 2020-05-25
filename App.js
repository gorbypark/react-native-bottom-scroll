import "react-native-gesture-handler";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import ScrollBottomSheet from "react-native-scroll-bottom-sheet";
import { FlatList } from "react-native-gesture-handler";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
import Store from "./Store";

const windowHeight = Dimensions.get("window").height;

MapboxGL.setAccessToken(
  "pk.eyJ1IjoibWlrZWhhbWlsdG9uMDAiLCJhIjoiNDVjS2puUSJ9.aLvWM5BnllUGJ0e6nwMSEg"
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    paddingBottom: 68,
  },
  contentContainerStyle: {
    padding: 16,
    backgroundColor: "#F3F4F9",
  },
  header: {
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  panelHandle: {
    width: 40,
    height: 2,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 4,
  },
  item: {
    padding: 20,
    justifyContent: "center",
    backgroundColor: "white",
    alignItems: "center",
    marginVertical: 10,
  },
  actionButtonIcon: {
    fontSize: 25,
    height: 25,
    opacity: 0.8,
    color: "black",
  },
});

// Home screen component
const Home = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>This is the home screen.</Text>
      <OpenDrawerButton />
    </View>
  );
};

// Map component
const Map = () => {
  useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);
  }, []);

  const mapRef = useRef();

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map} ref={mapRef} />
      <Fab />
      <BottomBar />
    </View>
  );
};

// Open Drawer button component
const OpenDrawerButton = () => {
  const navigation = useNavigation();
  return <Button title="open" onPress={() => navigation.openDrawer()} />;
};

// BottomBar component
const BottomBar = () => {
  const navigation = useNavigation();
  const bottomBarRef = useRef();

  // bottomBarSnapIndex([newVal, oldVal])
  const [bottomBarSnapIndex, setBottomBarSnapIndex] = useState([2, 2]);

  // Handler when bottom bar header is clicked
  const handleBottomBarClick = () => {
    // If current snap index is 0 or 1 (0 = open full, 1 = open half)
    if (bottomBarSnapIndex[0] <= 1) {
      // Snap close (2 = closed)
      bottomBarRef.current.snapTo(2);
    } else {
      // Snap half way (1 = halfway)
      bottomBarRef.current.snapTo(1);
    }
  };

  // Fake bottombar list data
  const scrollListData = [
    { name: "Lifts" },
    { name: "Food and Beverage" },
    { name: "Washrooms" },
    { name: "First-Aid" },
    { name: "Mike3" },
    { name: "Eva3" },
    { name: "Mike4" },
    { name: "Eva4" },
    { name: "Mike5" },
    { name: "Eva5" },
    { name: "Mike6" },
    { name: "Eva6" },
    { name: "Mike7" },
    { name: "Eva7" },
  ];

  // Fade in animation
  const FadeInView = (props) => {
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

    React.useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: Number(props.duration),
      }).start();
    }, []);

    return (
      <Animated.View
        style={{
          ...props.style,
          opacity: fadeAnim, // Bind opacity to animated value
        }}
      >
        {props.children}
      </Animated.View>
    );
  };

  // Fade out animation (with height scaling)
  const FadeOutView = (props) => {
    const fadeAnim = useRef(new Animated.Value(1)).current; // Initial value for opacity: 0
    React.useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: Number(props.duration),
      }).start();
    }, []);

    return (
      <Animated.View // Special animatable View
        style={{
          ...props.style,
          opacity: fadeAnim, // Bind opacity to animated value
          transform: [
            {
              scale: fadeAnim,
            },
          ],
          // interpolate 0..1 into 0..50
          height: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 50],
          }),
        }}
      >
        {props.children}
      </Animated.View>
    );
  };

  return (
    <ScrollBottomSheet
      ref={bottomBarRef}
      componentType="FlatList"
      snapPoints={[128, "50%", windowHeight - 75]}
      initialSnapIndex={2}
      onSettle={(snapIndex) =>
        setBottomBarSnapIndex([snapIndex, bottomBarSnapIndex[0]])
      }
      renderHandle={() => (
        <TouchableWithoutFeedback onPress={() => handleBottomBarClick()}>
          <View style={styles.header}>
            <View style={styles.panelHandle} />
            {bottomBarSnapIndex[0] === 2 && (
              <FadeInView duration="100">
                <View style={{ height: 50 }}>
                  <Text style={{ fontSize: 18, paddingTop: 15 }}>
                    Where do you want to go?
                  </Text>
                </View>
              </FadeInView>
            )}
            {bottomBarSnapIndex[0] >= 1 && bottomBarSnapIndex[1] === 2 && (
              <FadeOutView duration="1000">
                <View style={{ height: 50 }}>
                  <Text style={{ fontSize: 18, paddingTop: 15 }}>
                    Where do you want to go?
                  </Text>
                </View>
              </FadeOutView>
            )}
          </View>
        </TouchableWithoutFeedback>
      )}
      data={scrollListData.map((item, i) => String(item.name))}
      keyExtractor={(it) => it}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Button
            onPress={() => mapRef.current.camera.flyTo([-122.9, 50.1])}
            title={item}
          />
        </View>
      )}
      contentContainerStyle={styles.contentContainerStyle}
    />
  );
};

// Hamburger FAB component
const Fab = () => {
  const navigation = useNavigation();
  return (
    <ActionButton
      elevation={0}
      buttonColor="rgba(255,255,255,1)"
      position="left"
      offsetY={windowHeight - (windowHeight - 40)}
      offsetX={15}
      onPress={() => navigation.openDrawer()}
      verticalOrientation="down"
      renderIcon={() => (
        <Icon name="ios-menu" style={styles.actionButtonIcon} />
      )}
    ></ActionButton>
  );
};

// Drawer
const Drawer = createDrawerNavigator();
const App = () => {
  return (
    <Store>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={Home} />
          <Drawer.Screen name="Map" component={Map} />
          <Drawer.Screen name="Settings" component={Map} />
          <Drawer.Screen name="Info" component={Map} />
        </Drawer.Navigator>
      </NavigationContainer>
    </Store>
  );
};

export default App;
