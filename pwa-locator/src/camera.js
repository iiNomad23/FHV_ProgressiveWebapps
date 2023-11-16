import pauseBtnURL from './pause-btn.svg';
import playBtnURL from './play-btn.svg';
import saveBtnURL from './save.svg';
import cancelBtnURL from './x-circle.svg';

const OUTLET_ID = 'outlet'
const PLAY_PAUSE_BTN_ID = 'play-pause';
const CANCEL_BTN_ID = 'cancel';
const SAVE_BTN_ID = 'save';

const LS_LAST_COORDS_KEY = 'lastCoordinates';
const LS_IMAGES = 'images';

let outletDiv;
let video;
let photoImg;
let pausePlayButton;
let saveButton;
let cancelButton;
let canvasImgBlob;

function backToLocator() {
    window.location.href = '/index.html';
}

function saveAndExit() {
    const coordinateArr = JSON.parse(localStorage.getItem(LS_LAST_COORDS_KEY));

    let images = localStorage.getItem(LS_IMAGES);
    if (images == null) {
        images = JSON.stringify({});
    }
    images = JSON.parse(images);

    const reader = new FileReader();
    reader.onloadend = function () {
        images[`${coordinateArr[0]}x${coordinateArr[1]}`] = reader.result;
        localStorage.setItem(LS_IMAGES, JSON.stringify(images));
        backToLocator();
    };
    reader.readAsDataURL(canvasImgBlob);
}

function takePicture() {
    pausePlayButton.src = playBtnURL;
    pausePlayButton.onclick = restartVideo;

    saveButton.disabled = false;

    const width = video.offsetWidth;
    const height = video.offsetHeight;

    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);

    // draw text into image
    const coordinateArr = JSON.parse(localStorage.getItem(LS_LAST_COORDS_KEY));
    const coordinateText = `${coordinateArr[0]} x ${coordinateArr[1]}`;
    const textWidth = context.measureText(coordinateText).width;
    const wHalf = width / 2;

    // transparent background
    context.fillStyle = 'rgba(255, 255, 29, 0.5)';
    context.fillRect(wHalf - textWidth, height - 22, textWidth * 2, 22);

    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.font = '12pt consolas';
    context.fillText(coordinateText, wHalf, height - 4, textWidth * 2);

    canvas.convertToBlob({type: 'image/jpeg'}).then(
        (blob) => {
            const imageData = URL.createObjectURL(blob);
            photoImg.width = width;
            photoImg.height = height;
            photoImg.src = imageData;

            canvasImgBlob = blob;

            //put image on page
            outletDiv.removeChild(video);
            outletDiv.appendChild(photoImg);
        }
    );
}

function startVideoPlayback() {
    pausePlayButton.src = pauseBtnURL;
    pausePlayButton.disabled = true;
    pausePlayButton.onclick = takePicture;

    saveButton.disabled = true;

    // initiate video playback
    navigator.mediaDevices
        .getUserMedia({
            video: {facingMode: "environment"},
            audio: false
        })
        .then((stream) => {
            video.srcObject = stream;
            video.play();
        })
        .catch((err) => {
            console.error(`An error occurred: ${err}`);
        });
}

function videoIsPlaying(event) {
    pausePlayButton.disabled = false;
}

function restartVideo() {
    // put video on page
    outletDiv.removeChild(photoImg);
    outletDiv.appendChild(video);

    startVideoPlayback();
}

window.onload = () => {
    // init global element references
    outletDiv = document.getElementById(OUTLET_ID);
    pausePlayButton = document.getElementById(PLAY_PAUSE_BTN_ID);
    saveButton = document.getElementById(SAVE_BTN_ID);
    cancelButton = document.getElementById(CANCEL_BTN_ID);

    // create video element
    video = document.createElement('video');
    video.textContent = 'Video stream not available.';
    video.setAttribute('muted', true);
    video.setAttribute('autoplay', true);
    video.setAttribute('playsinline', true);
    video.oncanplay = videoIsPlaying;

    outletDiv.appendChild(video);

    // create image element
    photoImg = document.createElement('img');

    // setup other UI elements
    saveButton.src = saveBtnURL;
    saveButton.onclick = saveAndExit;
    cancelButton.src = cancelBtnURL;
    cancelButton.onclick = backToLocator;

    startVideoPlayback();
}
