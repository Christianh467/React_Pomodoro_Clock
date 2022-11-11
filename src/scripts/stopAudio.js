import $ from 'jquery'



document.getElementById('reset').addEventListener('click', () => {
    document.querySelector('audio').forEach(audio => audio.pause());n
  });