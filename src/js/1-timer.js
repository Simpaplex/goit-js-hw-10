import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('button[data-start]');
const dateInput = document.querySelector('#datetime-picker');
const dateDisplay = document.querySelector('span[data-days]');
const hoursDisplay = document.querySelector('span[data-hours]');
const minutesDisplay = document.querySelector('span[data-minutes]');
const secondsDisplay = document.querySelector('span[data-seconds]');

let userSelectedDate = null;
let timerId = null;
startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate.getTime() <= Date.now()) {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'center',
      });
      startBtn.disabled = true;
      userSelectedDate = null;
    } else {
      userSelectedDate = selectedDate;
      startBtn.disabled = false;
    }
  },
};

flatpickr(dateInput, options);

startBtn.addEventListener('click', handleStart);

function handleStart() {
  if (!userSelectedDate) return;
  clearInterval(timerId);

  startBtn.disabled = true;
  dateInput.disabled = true;

  timerId = setInterval(() => {
    const currentDate = new Date();
    const delta = userSelectedDate - currentDate;

    if (delta <= 0) {
      clearInterval(timerId);
      updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      dateInput.disabled = false;
      startBtn.disabled = true;
      return;
    }

    const timerCount = convertMs(delta);
    updateTimer(timerCount);
  }, 1000);
}

function updateTimer({ days, hours, minutes, seconds }) {
  dateDisplay.textContent = addLeadingZero(days);
  hoursDisplay.textContent = addLeadingZero(hours);
  minutesDisplay.textContent = addLeadingZero(minutes);
  secondsDisplay.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
