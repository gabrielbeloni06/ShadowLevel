import { FilesetResolver, HandLandmarker } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

let handLandmarker = undefined;
let runningMode = "VIDEO";
let lastVideoTime = -1;
let gestureCooldown = false;
const video = document.createElement("video");
video.autoplay = true;
video.playsInline = true;
video.style.position = "fixed";
video.style.top = "10px";
video.style.left = "10px";
video.style.width = "200px";
video.style.height = "150px";
video.style.zIndex = "9999";
video.style.transform = "scaleX(-1)";
video.style.opacity = "0.8";
video.style.borderRadius = "8px";
video.style.border = "2px solid #86e8ff";
document.body.appendChild(video);

const debugText = document.createElement("div");
debugText.style.position = "fixed";
debugText.style.top = "10px";
debugText.style.left = "10px";
debugText.style.width = "200px";
debugText.style.color = "#00ff00";
debugText.style.fontSize = "16px";
debugText.style.fontWeight = "bold";
debugText.style.textShadow = "1px 1px 2px black";
debugText.style.zIndex = "10000";
debugText.style.textAlign = "center";
debugText.innerText = "Carregando IA...";
document.body.appendChild(debugText);

const createHandLandmarker = async () => {
  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate: "GPU"
      },
      runningMode: runningMode,
      numHands: 1
    });
    debugText.innerText = "IA Pronta! Aguardando Webcam...";
    startWebcam();
  } catch (error) {
    console.error("Erro ao carregar MediaPipe:", error);
    debugText.innerText = "Erro IA (Ver Console)";
  }
};

const startWebcam = () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.warn("Navegador não suporta webcam.");
    return;
  }
  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream;
    video.addEventListener("loadeddata", () => {
      debugText.innerText = "Detectando...";
      predictWebcam();
    });
  });
};

async function predictWebcam() {
  if (!handLandmarker) return;

  const isDuelPage = window.location.pathname.includes("duelo.html");

  let startTimeMs = performance.now();
  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    const results = handLandmarker.detectForVideo(video, startTimeMs);

    if (results.landmarks.length > 0) {
      const landmarks = results.landmarks[0];
      const gesture = analyzeGesture(landmarks);
      
      debugText.innerText = gesture; 

      if (gesture !== "UNKNOWN") {
        if (isDuelPage) {
            triggerAction(gesture);
        } 
        else if (!gestureCooldown) {
            triggerAction(gesture);
            gestureCooldown = true;
            setTimeout(() => { gestureCooldown = false; }, 700); 
        }
      }
    } else {
      debugText.innerText = "Nenhuma mão";
    }
  }
  window.requestAnimationFrame(predictWebcam);
}

function analyzeGesture(landmarks) {
  const isIndexOpen = landmarks[8].y < landmarks[6].y;
  const isMiddleOpen = landmarks[12].y < landmarks[10].y;
  const isRingOpen = landmarks[16].y < landmarks[14].y;
  const isPinkyOpen = landmarks[20].y < landmarks[18].y;
  const isThumbOpen = landmarks[4].y < landmarks[3].y;
  
  let fingersUp = 0;
  if (isIndexOpen) fingersUp++;
  if (isMiddleOpen) fingersUp++;
  if (isRingOpen) fingersUp++;
  if (isPinkyOpen) fingersUp++;
  if (fingersUp === 0) return "CLOSED_FIST";
  if (fingersUp === 4) return "OPEN_PALM";
  if (isIndexOpen && !isMiddleOpen && !isRingOpen && !isPinkyOpen) return "POINTING_UP";
  if (isIndexOpen && isMiddleOpen && !isRingOpen && !isPinkyOpen) return "VICTORY";
  if (isThumbOpen && isPinkyOpen && !isIndexOpen && !isMiddleOpen && !isRingOpen) {
      return "CALL_ME";
  }

  return "UNKNOWN";
}

function triggerAction(gesture) {
  console.log(`>>> AÇÃO DISPARADA: ${gesture}`);
  const page = window.location.pathname;
  if (page.includes("powers.html")) {
    if (gesture === "CLOSED_FIST") clickButton("sombras"); 
    if (gesture === "OPEN_PALM") clickButton("dominio");   
    if (gesture === "POINTING_UP") clickButton("habilidades"); 
    if (gesture === "VICTORY") clickButton("mana"); 
    if (gesture === "CALL_ME") clickButton("inventario");
  }
  if (page.includes("music.html")) {
    if (gesture === "OPEN_PALM") tryClick('playPauseBtn');
    if (gesture === "POINTING_UP") tryClick('nextBtn');
    if (gesture === "CLOSED_FIST") tryClick('prevBtn');
  }
  if (page.includes("duelo.html")) {
    if (window.handleDuelInput) {
        if (gesture === "OPEN_PALM") window.handleDuelInput('a');
        if (gesture === "POINTING_UP") window.handleDuelInput('s');
        if (gesture === "CLOSED_FIST") window.handleDuelInput('d');
        if (gesture === "VICTORY") window.handleDuelInput('w');
    }
  }
}

function clickButton(datasetId) {
  const btn = document.querySelector(`[data-window="${datasetId}"]`);
  if (btn) {
    console.log(`Clicando em botão: ${datasetId}`);
    btn.click();
  } else {
    console.log(`Botão ${datasetId} não encontrado.`);
  }
}

function tryClick(id) {
  const el = document.getElementById(id);
  if (el) {
    console.log(`Clicando em ID: ${id}`);
    el.click();
  }
}

createHandLandmarker();