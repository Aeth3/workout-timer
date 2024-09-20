import { memo, useEffect, useReducer } from "react";
import clickSound from "./ClickSound.m4a";

function reducer(state, action) {
  const formula =
    (state.number * state.sets * state.speed) / 60 +
    (state.sets - 1) * state.durationBreak;
  switch (action.type) {
    case "Workout":
      return { ...state, number: action.payload, duration: formula };
    case "Sets":
      return { ...state, sets: action.payload, duration: formula };
    case "Speed":
      return { ...state, speed: action.payload, duration: formula };
    case "DurationBreak":
      return { ...state, durationBreak: action.payload, duration: formula };
    case "Inc":
      return { ...state, duration: Math.floor(state.duration) + 1 };
    case "Dec":
      return {
        ...state,
        duration:
          state.duration > 0 ? Math.ceil(state.duration) - 1 : state.duration,
      };
    default:
      throw new Error("Unknown Command");
  }
}
function Calculator({ workouts, allowSound, partOfDay }) {
  const initialState = {
    number: workouts.at(0).numExercises,
    sets: 3,
    speed: 90,
    durationBreak: 5,
    duration: Math.floor(
      (partOfDay === "AM" ? 9 : 8 * 3 * 90) / 60 + (3 - 1) * 5
    ),
  };

  const [state, dispath] = useReducer(reducer, initialState);
  const { number, sets, speed, durationBreak, duration } = state;

  // const duration = (number * sets * speed) / 60 + (sets - 1) * durationBreak;

  const mins = Math.floor(duration);
  const seconds = (duration - mins) * 60;

  function playSound() {
    if (!allowSound) return;
    const sound = new Audio(clickSound);
    sound.play();
  }

  function handleInc() {
    dispath({ type: "Inc" });
    playSound();
  }

  function handleDec() {
    dispath({ type: "Dec" });
    playSound();
  }

  useEffect(
    function () {
      document.title = `Your ${number}-exercise workout`;
    },
    [number]
  );
  return (
    <>
      <form>
        <div>
          <label>Type of workout</label>
          <select
            value={number}
            onChange={(e) => {
              dispath({ type: "Workout", payload: +e.target.value });
              console.log(e.target.value);
            }}
          >
            {workouts.map((workout) => (
              <option value={workout.numExercises} key={workout.name}>
                {workout.name} ({workout.numExercises} exercises)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>How many sets?</label>
          <input
            type="range"
            min="1"
            max="5"
            value={sets}
            onChange={(e) => {
              dispath({ type: "Sets", payload: e.target.value });
            }}
          />
          <span>{sets}</span>
        </div>
        <div>
          <label>How fast are you?</label>
          <input
            type="range"
            min="30"
            max="180"
            step="30"
            value={speed}
            onChange={(e) => {
              dispath({ type: "Speed", payload: e.target.value });
            }}
          />
          <span>{speed} sec/exercise</span>
        </div>
        <div>
          <label>Break length</label>
          <input
            type="range"
            min="1"
            max="10"
            value={durationBreak}
            onChange={(e) => {
              dispath({ type: "DurationBreak", payload: e.target.value });
            }}
          />
          <span>{durationBreak} minutes/break</span>
        </div>
      </form>
      <section>
        <button onClick={handleDec}>–</button>
        <p>
          {mins < 10 && "0"}
          {mins}:{seconds < 10 && "0"}
          {seconds}
        </p>
        <button onClick={handleInc}>+</button>
      </section>
    </>
  );
}

export default memo(Calculator);
