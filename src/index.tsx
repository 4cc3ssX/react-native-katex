import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { WebView, WebViewProps } from "react-native-webview";

import katexStyle from "./katex-style";
import katexScript from "./katex-script";
import type { KatexOptions, TrustContext } from "katex";

export interface ContentOptions extends KatexOptions {
  inlineStyle?: string;
  expression?: string;
}

export function getKatexContent({ inlineStyle, expression, ...options }: ContentOptions) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width user-scalable=no" />
      <style>
        ${katexStyle}
        ${inlineStyle}
      </style>
      <script>
        window.onerror = e => document.write(e);
        window.onload = () => katex.render(${JSON.stringify(
          expression
        )}, document.body, ${JSON.stringify(options)});
        ${katexScript}
      </script>
    </head>
    <body></body>
  </html>  
`;
}

const defaultStyle = StyleSheet.create({
  root: {
    height: 40,
  },
});

const defaultInlineStyle = `
body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 0;
  padding: 0;
}
.katex {
  margin: 0;
  display: flex;
}
`;

export interface KatexProps extends ContentOptions {
  style: StyleProp<ViewStyle>;
  onLoad?: WebViewProps["onLoad"];
  onError?: WebViewProps["onError"];
  webviewProps?: WebViewProps;
}

export default function Katex({
  style,
  onLoad,
  onError,
  webviewProps,
  ...options
}: KatexProps) {
  return (
    <WebView
      style={style}
      source={{ html: getKatexContent(options) }}
      onLoad={onLoad}
      onError={onError}
      {...webviewProps}
    />
  );
}

Katex.defaultProps = {
  expression: "",
  displayMode: false,
  throwOnError: false,
  errorColor: "#f00",
  inlineStyle: defaultInlineStyle,
  style: defaultStyle,
  macros: {},
  colorIsTextColor: false,
};

export { KatexOptions, TrustContext };
