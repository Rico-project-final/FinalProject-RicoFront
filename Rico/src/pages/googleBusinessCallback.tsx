import { useEffect } from "react";

const GoogleBusinessCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      // שלח את הקוד בחזרה לחלון הראשי
      window.opener?.postMessage({ type: "google-oauth-code", code }, window.origin);
      window.close();
    }
  }, []);

  return <p>מתחבר לעסק...</p>;
};

export default GoogleBusinessCallback;
