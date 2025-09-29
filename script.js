document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkInForm');
  const nameInput = document.getElementById('attendeeName');
  const teamSelect = document.getElementById('teamSelect');
  const totalEl = document.getElementById('attendeeCount');
  const greetingEl = document.getElementById('greeting');
  const celebrationEl = document.getElementById('celebration');
  const progressBar = document.getElementById('progressBar');
  const waterEl = document.getElementById('waterCount');
  const zeroEl = document.getElementById('zeroCount');
  const powerEl = document.getElementById('powerCount');
  const listEl = document.getElementById('attendeeList');
  const GOAL = 50;

  const getInt = (k, d=0) => {
    const n = parseInt(localStorage.getItem(k), 10);
    return Number.isFinite(n) ? n : d;
  };
  const getJSON = (k, d=[]) => {
    try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; }
  };

  let total = getInt('totalCount');
  let water = getInt('waterCount');
  let zero = getInt('zeroCount');
  let power = getInt('powerCount');
  let attendees = getJSON('attendees');

  const save = () => {
    localStorage.setItem('totalCount', total);
    localStorage.setItem('waterCount', water);
    localStorage.setItem('zeroCount', zero);
    localStorage.setItem('powerCount', power);
    localStorage.setItem('attendees', JSON.stringify(attendees));
  };

  const renderCounts = () => {
    if (totalEl) totalEl.textContent = total;
    if (waterEl) waterEl.textContent = water;
    if (zeroEl) zeroEl.textContent = zero;
    if (powerEl) powerEl.textContent = power;
  };

  const renderProgress = () => {
    const pct = Math.min(100, Math.round((total / GOAL) * 100));
    if (progressBar) progressBar.style.width = pct + '%';
  };

  const renderAttendees = () => {
    if (!listEl) return;
    listEl.innerHTML = '';
    attendees.forEach(({ name, teamName }) => {
      const li = document.createElement('li');
      li.textContent = name + ' (' + teamName + ')';
      listEl.appendChild(li);
    });
  };

  const celebrate = () => {
    if (!celebrationEl) return;
    if (total >= GOAL) {
      const max = Math.max(water, zero, power);
      const winners = [];
      if (water === max) winners.push('Team Water Wise');
      if (zero === max) winners.push('Team Net Zero');
      if (power === max) winners.push('Team Renewables');
      celebrationEl.textContent = winners.length > 1
        ? '🎉 Goal reached! Tie between ' + winners.join(' & ')
        : '🎉 Goal reached! Winner: ' + winners[0] + ' 🎉';
    } else {
      celebrationEl.textContent = '';
    }
  };

  const bumpTeam = (val, label) => {
    if (val === 'water' || /water\s*wise/i.test(label)) water += 1;
    else if (val === 'zero' || /net\s*zero/i.test(label)) zero += 1;
    else if (val === 'power' || /renewables/i.test(label)) power += 1;
  };

  renderCounts();
  renderProgress();
  renderAttendees();
  celebrate();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (nameInput.value || '').trim();
    if (!name) return;

    const teamVal = teamSelect.value;
    const teamLabel = teamSelect.selectedOptions[0]?.text || teamVal;

    total += 1;
    bumpTeam(teamVal, teamLabel);

    attendees.push({ name, teamValue: teamVal, teamName: teamLabel });
    greetingEl.textContent = 'Welcome, ' + name + ', from ' + teamLabel + '!';

    save();
    renderCounts();
    renderProgress();
    renderAttendees();
    celebrate();

    form.reset();
    nameInput.focus();
  });
});
