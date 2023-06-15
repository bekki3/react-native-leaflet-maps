import React, { useState } from "react";
import { View, Button } from "react-native";
import { WebView } from "react-native-webview";
import { Asset } from "expo-asset";
import { useAssets } from "expo-asset";
import { readAsStringAsync } from 'expo-file-system';


const Map = () => {
    //const [location, setLocation] = useState(null);
    const [index, indexLoadingError] = useAssets(require("./assets/map.html"));
    const mapHtml = Asset.fromModule(require("./assets/map.html")).uri;
    const [html, setHtml] = useState("");

    if (index) {
        readAsStringAsync(index[0].localUri).then((data) => {
            setHtml(data);
        });
    }

    const onMessage = (payload) => {

        let dataPayload;
        try {
          dataPayload = JSON.parse(payload.nativeEvent.data);
        } catch (e) {}
      
        if (dataPayload) {
          if (dataPayload.type === 'Console') {
            console.log(`[Console] ${JSON.stringify(dataPayload.data)}`);
          } else {
            //setLocation(dataPayload);
            //console.log(dataPayload);
          }
        }
      };
    
    return (
        <View style={{ flex: 1 }}>

            <WebView
                style={{marginTop: 26}}
                onLoad={() => {}}
                source={{ html }}
                onMessage={onMessage}
            />
        </View>
    );
}

export default Map;
