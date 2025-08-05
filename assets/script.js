const entryField = document.getElementById("entry");
const status = document.getElementById("status");
const historyList = document.getElementById("history");
const dateDisplay = document.getElementById("current-date");

const today = new Date();
const todayKey = today.toISOString().split("T")[0]; // e.g., "2025-08-05"
const readableDate = today.toDateString(); // e.g., "Tue Aug 5 2025"

dateDisplay.textContent = readableDate;

// Load today's entry if it exists
const savedEntry = localStorage.getItem(`entry-${todayKey}`);
if (savedEntry) {
  entryField.value = savedEntry;
  status.textContent = "Saved ✅";
}

// Save on input
entryField.addEventListener("input", () => {
  const text = entryField.value.trim();
  if (text) {
    localStorage.setItem(`entry-${todayKey}`, text);
    status.textContent = "Saved ✅";
    loadHistory();
  } else {
    localStorage.removeItem(`entry-${todayKey}`);
    status.textContent = "Not saved ❌";
  }
});

// Load all entries
function loadHistory() {
  historyList.innerHTML = "";
  const keys = Object.keys(localStorage).filter(key => key.startsWith("entry-"));
  const entries = keys.map(key => {
    return {
      date: key.replace("entry-", ""),
      text: localStorage.getItem(key)
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first

  entries.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${formatDate(entry.date)} — ${entry.text}`;
    historyList.appendChild(li);
  });
}

function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toDateString();
}

loadHistory();

// Dark mode toggle
const toggleThemeBtn = document.getElementById('toggle-theme');
toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const darkMode = document.body.classList.contains('dark');
  toggleThemeBtn.textContent = darkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('darkMode', darkMode);
});

// Persist dark mode on reload
window.addEventListener('DOMContentLoaded', () => {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.body.classList.add('dark');
    toggleThemeBtn.textContent = '☀️ Light Mode';
  }
});

// Download entries as .txt
document.getElementById('download').addEventListener('click', () => {
  const entries = JSON.parse(localStorage.getItem('entries')) || [];
  if (entries.length === 0) return alert('No entries to download.');
  const text = entries.map(e => `${e.date}:\n${e.text}\n`).join('\n---\n\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'one-thing-a-day.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});
