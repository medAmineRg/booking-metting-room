import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Video() {
  let { id } = useParams();

  useEffect(() => {
    const domain = "https://go-video-chat.daily.co/";

    axios
      .get(`http://localhost:5000/video-call/${id}`)
      .then((res) => {
        if (res.status === 200) {
          const script = document.createElement("script");
          script.innerHTML = `window.DailyIframe.createFrame({
            iframeStyle: {
              position: "absolute",
              top: "0",
              width: "100%",
              height: "120%",
              border: "0",
              zIndex: 9999,
            },
            showLeaveButton: true,
            showFullscreenButton: true,
          }).join({
            url: "${domain}${id}",
          });`;

          document.body.appendChild(script);
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  return <div></div>;
}
