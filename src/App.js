import logo from "./logo.svg";
import "./App.css";
import { Unity, useUnityContext } from "react-unity-webgl";
import { Fragment, useEffect, useState, useCallback } from "react";

function App() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [userName, setUserName] = useState();
  const [score, setScore] = useState();

  const {
    unityProvider,
    sendMessage,
    isLoaded,
    addEventListener,
    removeEventListener,
  } = useUnityContext({
    loaderUrl: "games/Hillclimbracing/Hillclimbracing.loader.js",
    dataUrl: "games/Hillclimbracing/Hillclimbracing.data",
    frameworkUrl: "games/Hillclimbracing/Hillclimbracing.framework.js",
    codeUrl: "games/Hillclimbracing/Hillclimbracing.wasm",
  });

  // Changes Scene
  function loadScene() {
    sendMessage("LoadLevelManager", "LoadLevel", 0);
  }

  // Game Over Handler
  const handleGameOver = useCallback((score) => {
    setIsGameOver(true);
    setScore(score);
  }, []);

  const handleQuitGame = useCallback(async (score) => {
    console.log("Score 2", score);
    sendMessage("LoadLevelManager", "LoadLevel", 0);
    setScore(score);
  });

  useEffect(() => {
    loadScene();
  }, [isLoaded]);

  useEffect(() => {
    addEventListener("GameOver", handleGameOver);
    addEventListener("QuitGame", handleQuitGame);
    return () => {
      removeEventListener("GameOver", handleGameOver);
    };
  }, [addEventListener, removeEventListener, handleGameOver]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw",
        flexDirection: "column-reverse"
      }}
    >
      <Fragment>
        <Unity
          style={{
            width: 1600,
            height: 900,
            visibility: isLoaded ? "visible" : "hidden",
          }}
          unityProvider={unityProvider}
        />
        <div>
          {isGameOver === true && <p>{`You've scored ${score} points.`}</p>}
        </div>
      </Fragment>
    </div>
  );
}

export default App;
