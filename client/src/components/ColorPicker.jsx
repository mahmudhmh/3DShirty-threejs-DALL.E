/* eslint-disable no-unused-vars */
import React from "react";
import { SketchPicker } from "react-color";
import { useSnapshot } from "valtio";
import state from "../store";

const ColorPicker = () => {
  const snap = useSnapshot(state);
  return (
    <div className="absolute left-full ml-3">
      <SketchPicker
        color={snap.color}
        disableAlpha
        presetColors={[
          "#FF6900",
          "#ae8fde",
          "#001734",
          "#1f34fd",
          "#ff0000",
          "#6ef796",
          "#6faff9",
          "#eef611",
          "#14263d",
          "#c63636",
          "#ae8dfe",
          "#a5efff",
        ]}
        onChange={(color) => (state.color = color.hex)}
      />
    </div>
  );
};

export default ColorPicker;
