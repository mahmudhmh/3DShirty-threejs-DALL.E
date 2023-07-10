/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";
import config from "../config/config";
import state from "../store";
import { download } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import {
  AIPicker,
  ColorPicker,
  FilePicker,
  Tab,
  CustomButton,
} from "../components";

const Customizer = () => {
  const snap = useSnapshot(state);
  const [file, setfile] = useState("");
  const [prompt, setprompt] = useState("");
  const [generatingImg, setgeneratingImg] = useState(false);
  const [activeEditor, setactiveEditor] = useState("");
  const [activeFilter, setactiveFilter] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  //show tab contents
  const generateContentOfTab = () => {
    switch (activeEditor) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setfile={setfile} readfile={readfile} />;
      case "aipicker":
        return (
          <AIPicker
            prompt={prompt}
            setprompt={setprompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (type) => {
    if (!prompt) return alert("Please Enter a Prompt!");
    try {
      //Backend DALL.E
      setgeneratingImg(true);

      const response = await fetch(`http://localhost:5000/api/v1/dalle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();

      handleDecals(type, `data:image/png;base64,${data.photo}`);
    } catch (error) {
      alert(error);
    } finally {
      setgeneratingImg(false);
      setactiveEditor("");
    }
  };

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;

    if (!activeFilter[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilter[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilter[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }
    //set active filter tab to be updated
    setactiveFilter((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName],
      };
    });
  };

  const readfile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result);
      setactiveEditor("");
    });
  };
  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setactiveEditor(tab.name)}
                  />
                ))}
                {generateContentOfTab()}
              </div>
            </div>
          </motion.div>
          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>
          <motion.div
            className="filtertabs-container"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilter[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}
            <button className="download-btn" onClick={downloadCanvasToImage}>
              <img
                src={download}
                alt="download_image"
                className="w-3/5 h-3/5 object-contain"
              />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
