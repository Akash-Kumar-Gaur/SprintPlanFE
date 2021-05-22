import React from "react";
import styles from "./index.module.scss";
import Lottie from "react-lottie";
import animationData from "../../Assets/Lottie/team.json";
import Popup from "reactjs-popup";
import CreatePollForm from "../../Components/CreatePoll";

function HomeScene() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className={styles.homeWrapper}>
      <div className={styles.homeBanner} />
      <div className={styles.centerContent}>
        <div className={styles.dataWrapper}>
          <div className={styles.textWrapper}>
            <div
              className={`${styles.lightText} animate__animated animate__fadeInUp`}
            >
              Sprintplan
            </div>
            <div
              className={`${styles.infoText} animate__animated animate__fadeInDown`}
            >
              Scrum Planning
            </div>
            <div className={styles.tagline}>
              Poker based app for streamline planning and development.
            </div>
            <Popup
              trigger={<div className={styles.playBtn}>Start Playing</div>}
              modal
              nested
            >
              {(close) => <CreatePollForm close={close} />}
            </Popup>
          </div>
          <div className={styles.animationFile}>
            <Lottie options={defaultOptions} height={"100%"} width={"100%"} />
          </div>
        </div>
      </div>
      <div>
        <svg
          height="100%"
          width="100%"
          id="svg"
          viewBox="0 0 1440 500"
          xmlns="http://www.w3.org/2000/svg"
          class="transition duration-300 ease-in-out delay-150"
        >
          <path
            d="M 0,500 C 0,500 0,166 0,166 C 78.19421944035346,161.10659057437408 156.38843888070693,156.21318114874816 205,152 C 253.61156111929307,147.78681885125184 272.6404639175258,144.25386597938146 328,147 C 383.3595360824742,149.74613402061854 475.0497054491899,158.77135493372606 536,178 C 596.9502945508101,197.22864506627394 627.1607142857142,226.6607142857143 687,210 C 746.8392857142858,193.3392857142857 836.3074374079531,130.58578792341677 910,124 C 983.6925625920469,117.41421207658321 1041.609536082474,166.99613402061854 1096,173 C 1150.390463917526,179.00386597938146 1201.2544182621505,141.429675994109 1258,133 C 1314.7455817378495,124.57032400589101 1377.3727908689248,145.2851620029455 1440,166 C 1440,166 1440,500 1440,500 Z"
            stroke="none"
            stroke-width="0"
            fill="#0693e388"
            class="transition-all duration-300 ease-in-out delay-150"
            transform="rotate(-180 720 250)"
          ></path>
          <path
            d="M 0,500 C 0,500 0,333 0,333 C 79.53700294550808,304.2998895434462 159.07400589101616,275.59977908689245 212,287 C 264.92599410898384,298.40022091310755 291.2409793814433,349.90077319587624 337,343 C 382.7590206185567,336.09922680412376 447.96207658321066,270.7971281296024 514,284 C 580.0379234167893,297.2028718703976 646.9107142857141,388.9107142857143 717,384 C 787.0892857142859,379.0892857142857 860.3950662739325,277.5600147275405 921,273 C 981.6049337260675,268.4399852724595 1029.5090206185564,360.84922680412376 1078,386 C 1126.4909793814436,411.15077319587624 1175.5688512518411,369.04307805596466 1236,349 C 1296.4311487481589,328.95692194403534 1368.2155743740796,330.9784609720177 1440,333 C 1440,333 1440,500 1440,500 Z"
            stroke="none"
            stroke-width="0"
            fill="#0693e3ff"
            class="transition-all duration-300 ease-in-out delay-150"
            transform="rotate(-180 720 250)"
          ></path>
        </svg>
      </div>
      <div className={styles.footerInfo}>
        Made with Node and React. &copy;{" "}
        <a href="https://github.com/Akash-Kumar-Gaur">Akash Kumar Gaur</a>
      </div>
    </div>
  );
}

export default HomeScene;
