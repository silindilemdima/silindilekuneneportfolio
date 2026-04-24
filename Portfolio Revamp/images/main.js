// TEXT + FONT SWITCH (UPDATED FOR TYPEFACE ROTATION)

const words = ["Design", "Creative", "Ideas", "Thinking"];

/*
  Font equivalents used:
  - "Luke 400" → closest clean serif style (Playfair Display)
  - "Clash Display" → strong modern sans (Montserrat bold feel)
  - "Horizon" → futuristic display style (Oswald / condensed bold feel)
  - "Inter" → clean UI default
*/

const fonts = [
  "'Playfair Display', serif",   // Luke 400 (approx)
  "'Montserrat', sans-serif",    // Clash Display (approx)
  "'Oswald', sans-serif",        // Horizon (approx)
  "'Inter', sans-serif"          // Clean fallback
];

let i = 0;

setInterval(() => {
  i = (i + 1) % words.length;

  const el = document.getElementById("changing-text");

  if (!el) return;

  el.textContent = words[i];
  el.style.fontFamily = fonts[i];

}, 3000);