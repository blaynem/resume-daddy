import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    console.log("content view loaded", document);
  }, []);

  // return <div className="content-view text-lime-400">content view</div>;
  return <></>;
}
