import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { WebView } from 'react-native-webview';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Web View Interaction",
      content: "",
      loadingProgress: "Currently loading WebView, please wait ..",
      webUrl: "https://marengga.com/reactnative-webview-interaction.html"
    };
    this.onWebViewMessage = this.onWebViewMessage.bind(this);
  }

  handleDataReceived(msgData) {
    this.setState({
      content: `Message from WebView: ${msgData.data}`
    });
    msgData.isSuccessfull = true;
    msgData.args = [msgData.data % 2 ? "odd" : "even"];
    this.myWebView.injectJavaScript(`window.postMessage('${JSON.stringify(msgData)}', '*');`);
  }

  onWebViewMessage(event) {
    console.log("Message received from webview");

    let msgData;
    try {
      msgData = JSON.parse(event.nativeEvent.data);
    } catch (err) {
      console.warn(err);
      return;
    }

    switch (msgData.targetFunc) {
      case "handleDataReceived":
        this[msgData.targetFunc].apply(this, [msgData]);
        break;
    }
  }

  startLoading() {
    this.setState({ loadingProgress: "Currently loading WebView, please wait .." });
  }

  finishLoading() {
    this.setState({ loadingProgress: "WebView loaded" });
  }

  sendDataToWebView() {
    // msgData.isSuccessfull = true;
    msgData.args = "green";
    this.myWebView.injectJavaScript(`window.postMessage('${JSON.stringify(msgData)}', '*');`);
  }

  render() {
    // const webUrl = "https://marengga.com/reactnative-webview-interaction.html";

    return (
      <View style={styles.container}>
        <View style={styles.appContainer}>
          <Text style={styles.title}>{this.state.title}</Text>
          <Text style={styles.content}>{this.state.loadingProgress}</Text>
          <Text style={styles.content}>{this.state.content}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
            <Button
              title="Change to other url"
              onPress={() => this.setState({ webUrl: "https://www.bmw.com.au/en/index.html" })} />
            <Button
              title="Back to our url"
              onPress={() => this.setState({ webUrl: "https://marengga.com/reactnative-webview-interaction.html" })} />
          </View>
        </View>
        <View style={styles.webViewContainer}>
          <WebView
            ref={webview => {
              this.myWebView = webview;
            }}
            scrollEnabled={false}
            source={{ uri: this.state.webUrl }}
            onMessage={this.onWebViewMessage}
            onLoadStart={() => this.startLoading()}
            onLoad={() => this.finishLoading()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  appContainer: {
    flex: 1,
    backgroundColor: "#555"
  },
  webViewContainer: {
    flex: 2,
    marginBottom: 0
  },
  title: {
    paddingVertical: 20,
    fontSize: 20,
    textAlign: "center",
    color: "white"
  },
  content: {
    paddingVertical: 5,
    textAlign: "center",
    backgroundColor: "#555",
    color: "white"
  }
});

export default App;
