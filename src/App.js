import "./App.css";
import React, { useState, useEffect, useReducer, useRef } from "react";
import { FaStar } from "react-icons/fa";
import { useInput } from "./useInput.js";
import { useTrees } from "./";
import { useFetch } from "./useFetch.js";

function Star({ selected = false, onSelect }) {
  return <FaStar color={selected ? "red" : "gray"} onClick={onSelect} />;
}

function StarRating({ totalStars = 5 }) {
  const createArray = (length) => [...Array(length)];
  const [selectedStars, setSelectedStars] = useState(0);
  return (
    <div>
      {createArray(totalStars).map((n, i) => (
        <Star
          key={i}
          selected={selectedStars > i}
          onSelect={() => setSelectedStars(i + 1)}
        />
      ))}
    </div>
  );
}

function UseReducerCheckbox() {
  const [checked, toggle] = useReducer((checked) => !checked, false);
  return (
    <div>
      <input type="checkbox" value={checked} onChange={toggle} />
      <p>{checked ? "checked" : "notChecked"}</p>
    </div>
  );
}

function Checkbox() {
  const [checked, setChecked] = useState(false);
  return (
    <div>
      <input
        type="checkbox"
        value={checked}
        onChange={() => setChecked((checked) => !checked)}
      />
      <p>{checked ? "checked" : "notChecked"}</p>
    </div>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case "yell":
      return { message: `HEY! I just said ${state.message}` };
    case "whisper":
      return { message: `excuse me, I just said ${state.message}` };
    default:
      return state;
  }
}

function App({ login }) {
  const sound = useRef();
  const colour = useRef();

  const [soundState, setSoundState] = useState("");
  const [colourState, setColourState] = useState("#000000");

  const [soundProps, soundReset] = useInput("");
  const [colourProps, colourReset] = useInput("#000000");

  const initialState = { message: "hi" };
  const [state, dispatch] = useReducer(reducer, initialState);

  const [name, setName] = useState("jen");

  const [data, setData] = useState([]);

  const { trees } = useTrees();

  const { loading, response, error } = useFetch(
    `https://api.github.com/users/${login}`
  );

  const submit = (e) => {
    e.preventDefault();
    const soundVal = sound.current.value;
    const colourVal = colour.current.value;
    alert(`${soundVal} sounds like ${colourVal}`);
    sound.current.value = "";
    colour.current.value = "#000000";
  };

  const submitWithState = (e) => {
    e.preventDefault();
    alert(`${soundState} sounds like ${colourState}`);
    setSoundState("");
    setColourState("#000000");
  };

  const submitWithCustomHook = (e) => {
    e.preventDefault();
    alert(`${soundProps.value} sounds like ${colourProps.value}`);
    soundReset();
    colourReset();
  };

  useEffect(() => {
    document.title = name;
  }, [name]);

  useEffect(() => {
    fetch("https://api.github.com/users")
      .then((response) => response.json())
      .then(setData);
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="App">
      <form onSubmit={submit}>
        <input ref={sound} type="text" placeholder="sound" />
        <input ref={colour} type="color" />
        <button type="submit">SubmitWithRef</button>
      </form>
      <form onSubmit={submitWithState}>
        <input
          value={soundState}
          type="text"
          placeholder="sound"
          onChange={(e) => setSoundState(e.target.value)}
        />
        <input
          value={colourState}
          type="color"
          onChange={(e) => setColourState(e.target.value)}
        />
        <button type="submit">SubmitWithState</button>
      </form>
      <form onSubmit={submitWithCustomHook}>
        <input {...soundProps} type="text" placeholder="sound" />
        <input {...colourProps} type="color" />
        <button type="submit">SubmitWithCustomHook</button>
      </form>
      <h1>{state.message}</h1>
      <button onClick={() => dispatch({ type: "yell" })}>Yell</button>
      <button onClick={() => dispatch({ type: "whisper" })}>whisper</button>
      <Checkbox />
      <UseReducerCheckbox />
      <StarRating totalStars={10} />
      <button onClick={() => setName("Will")}>{name}</button>
      <button onClick={() => setData([])}>Remove all items</button>
      {data.map((item) => (
        <p key={item.id}>{item.login}</p>
      ))}
      <ul>
        {trees.map((tree) => (
          <li key={tree.id}>{tree.type}</li>
        ))}
      </ul>
      {loading && <h1>loading....</h1>}
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      {response && (
        <div>
          <img src={response.avatar_url} alt={response.login} />
          <div>
            <h1>{response.login}</h1>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
