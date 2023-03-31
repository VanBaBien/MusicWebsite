const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const volume = $('#volume');
const volumeIcon = $('.volume-icon');
const muteVolume = $('.mute-volume');


volumeIcon.onclick = function () {
  if (audio.muted == false) {
      audio.muted = true;
      volumeIcon.classList.remove('fa-volume-high');
      volumeIcon.classList.add('fa-volume-xmark');
      volume.value = 0;
  } else {
      audio.muted = false;
      volumeIcon.classList.remove('fa-volume-xmark');
      volumeIcon.classList.add('fa-volume-high');
      volume.value = Math.floor(audio.volume * 100);

  }
}
