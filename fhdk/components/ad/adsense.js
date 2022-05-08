import React, { useEffect } from "react";

export default function AdBanner(props) {
  const { auto, width, height } = props;
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle adbanner-customize"
      style={{
        display: auto ? "block" : "inline-block",
        width: auto ? "auto" : width,
        height: auto ? "auto" : height,
      }}
      data-ad-format={auto ? "auto" : ""}
      data-full-width-responsive="true"
      data-ad-client="ca-pub-3163303127956008"
      data-ad-slot="9661520020"
    />
  );
}
