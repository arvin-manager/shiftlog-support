const form = document.querySelector('#rotation-form');
const dateInput = document.querySelector('#rotation-date');
const result = document.querySelector('#rotation-result');
const title = document.querySelector('#rotation-result-title');
const summary = document.querySelector('#rotation-summary');
const days = document.querySelector('#rotation-days');
const copyButton = document.querySelector('#rotation-copy');
const status = document.querySelector('#rotation-status');
const fallback = document.querySelector('#rotation-link-fallback');
const linkInput = document.querySelector('#rotation-link');
const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
const taipeiCalendar = new Intl.DateTimeFormat('en', {
  timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit',
});

function taipeiToday() {
  const parts = Object.fromEntries(
    taipeiCalendar.formatToParts(new Date()).map(({ type, value }) => [type, value]),
  );
  return [parts.year, parts.month, parts.day].join('-');
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  if (value < dateInput.min || value > dateInput.max) return false;
  const date = new Date(value + 'T00:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().startsWith(value);
}

function render(date, phase, moveFocus) {
  const day = new Date(date + 'T00:00:00Z');
  const list = document.createDocumentFragment();
  let workdays = 0;
  let lastDate;
  // Calendar dates run in UTC so crossing daylight-saving time never skips a day.
  for (let offset = 0; offset < 30; offset++) {
    const working = (phase - 1 + offset) % 4 < 2;
    const item = document.createElement('li');
    if (working) {
      item.className = 'working';
      workdays++;
    }
    const time = document.createElement('time');
    lastDate = day.toISOString().slice(0, 10);
    time.dateTime = lastDate;
    time.textContent = `${day.getUTCMonth() + 1}/${day.getUTCDate()}（${weekdays[day.getUTCDay()]}）`;
    const state = document.createElement('span');
    state.textContent = working ? '上班' : '休息';
    item.append(time, state);
    list.append(item);
    day.setUTCDate(day.getUTCDate() + 1);
  }
  days.replaceChildren(list);
  summary.textContent = `${date} 至 ${lastDate}，上班 ${workdays} 天、休息 ${30 - workdays} 天。`;
  const shareLink = new URL(location.href);
  shareLink.search = '';
  shareLink.hash = new URLSearchParams({ date, day: phase }).toString();
  linkInput.value = shareLink.href;
  copyButton.hidden = false;
  fallback.hidden = true;
  status.textContent = '';
  result.hidden = false;
  if (moveFocus) title.focus();
}

function readLink() {
  const params = new URLSearchParams(location.hash.slice(1));
  const date = params.get('date') ?? '';
  const day = params.get('day') ?? '';
  if (!validDate(date) || !/^[1-4]$/.test(day)) return false;
  dateInput.value = date;
  form.elements.phase.value = day;
  render(date, Number(day), false);
  return true;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const date = dateInput.value;
  if (validDate(date)) render(date, Number(form.elements.phase.value), true);
});

form.addEventListener('change', () => {
  if (result.hidden) return;
  copyButton.hidden = true;
  fallback.hidden = true;
  status.textContent = '已變更日期或週期。重新產生後即可分享新班表。';
});

copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(linkInput.value);
    if (!copyButton.hidden) status.textContent = '已複製班表連結。';
  } catch {
    if (copyButton.hidden) return;
    fallback.hidden = false;
    linkInput.focus();
    linkInput.select();
  }
});

dateInput.value = taipeiToday();
readLink();
form.hidden = false;
