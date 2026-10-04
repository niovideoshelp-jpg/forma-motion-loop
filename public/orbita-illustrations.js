// Authored vector miniatures. All geometry is evaluated only from the supplied p.
const P = {
  paper: "#fffef9",
  ink: "#102b39",
  sea: "#93b5ba",
  orange: "#ff8953",
  sand: "#e4ddce",
};
const unit = (n) => Math.max(0, Math.min(1, n));
const ease = (p) => 1 - (1 - unit(p)) ** 3;
const path = (c, d, color, width = 0) => {
  const shape = new Path2D(d);
  if (width) {
    c.strokeStyle = color;
    c.lineWidth = width;
    c.stroke(shape);
  } else {
    c.fillStyle = color;
    c.fill(shape);
  }
};
function ellipse(c, x, y, rx, ry, color) {
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  c.fillStyle = color;
  c.fill();
}
function layer(c, p, distance, draw) {
  c.save();
  c.translate(0, (1 - ease(p)) * distance);
  draw();
  c.restore();
}

function mountain(c, p) {
  c.fillStyle = P.sand;
  c.fillRect(0, 0, 190, 132);
  ellipse(c, 147, 29, 14, 14, P.orange);
  // Air and distant contours are deliberately broad so the landscape reads at 170px.
  path(
    c,
    "M17 27 C20 23 24 24 27 26 C28 19 38 19 40 26 C45 23 51 26 51 30 L17 30 Z",
    P.paper,
  );
  layer(c, p, 12, () => {
    path(
      c,
      "M-8 102 L17 71 L33 76 L70 26 L85 43 L104 35 L147 86 L169 65 L202 100 L202 145 L-8 145 Z",
      P.sea,
    );
    path(c, "M70 26 L85 43 L104 35 L85 65 L78 55 L67 62 L58 46 Z", P.paper);
    path(c, "M70 26 L58 46 L67 62 L45 87 L33 76 Z", "#b8cbca");
  });
  layer(c, (p - 0.08) / 0.92, 20, () => {
    path(
      c,
      "M-12 143 L-12 115 L16 88 L37 99 L100 50 L125 79 L142 70 L201 126 L201 143 Z",
      P.ink,
    );
    path(
      c,
      "M100 50 L93 75 L80 85 L79 111 L51 133 L111 132 L123 108 L111 88 L125 79 Z",
      "#315361",
    );
    path(c, "M100 50 L125 79 L111 75 L107 81 L97 70 L90 77 Z", P.sand);
  });
  // A single climbing path is the construction gesture.
  c.save();
  c.beginPath();
  c.rect(0, 132 - 70 * ease((p - 0.15) / 0.85), 190, 80);
  c.clip();
  path(
    c,
    "M66 138 C86 127 90 120 84 115 C75 108 119 108 113 97 C109 91 122 87 132 84",
    P.orange,
    2.2,
  );
  c.restore();
  path(c, "M-5 128 C14 122 30 128 40 139 L-5 140 Z", P.orange);
}

function waves(c, p) {
  c.fillStyle = P.sand;
  c.fillRect(0, 0, 190, 132);
  c.fillStyle = P.sea;
  c.fillRect(0, 34, 190, 100);
  ellipse(c, 147, 22, 10, 10, P.orange);
  path(c, "M0 35 L190 35", P.paper, 1.3);
  path(
    c,
    "M13 48 C28 43 40 52 54 47 M75 46 C88 41 104 49 116 44 M139 49 C154 44 166 51 184 47",
    P.paper,
    1.3,
  );
  layer(c, p, 9, () => {
    path(
      c,
      "M-8 69 L13 61 L24 72 L42 68 L56 80 L82 76 L99 83 L119 70 L144 72 L162 57 L176 66 L198 64 L198 139 L-8 139 Z",
      P.ink,
    );
    path(
      c,
      "M-8 83 L12 77 L26 87 L39 81 L50 87 L42 94 L23 94 L13 103 L-8 100 Z",
      "#315361",
    );
    path(c, "M152 70 L164 60 L175 67 L183 67 L172 82 L158 82 Z", "#315361");
    // An irregular natural pool has a pale stone lip and two water tones.
    path(
      c,
      "M38 92 C47 81 68 87 81 88 C99 90 109 79 124 83 C140 87 152 91 149 103 C148 115 118 122 96 119 C75 121 60 114 43 114 C30 113 27 102 38 92 Z",
      P.sand,
    );
    path(
      c,
      "M41 94 C54 86 70 94 82 94 C96 96 111 84 124 89 C139 93 146 97 140 104 C132 112 117 117 97 114 C76 116 66 107 48 109 C36 109 31 102 41 94 Z",
      P.sea,
    );
    path(
      c,
      "M39 98 C53 94 65 105 80 102 C97 100 99 94 112 96 C104 106 92 108 80 108 C64 108 49 102 39 104 Z",
      "#b8cbca",
    );
  });
  c.save();
  c.globalAlpha *= ease((p - 0.12) / 0.88);
  path(
    c,
    "M48 97 C59 96 63 101 75 99 M94 106 C107 110 121 103 127 102",
    P.paper,
    1.5,
  );
  c.restore();
  path(
    c,
    "M2 117 L15 106 L30 111 L35 132 L0 132 Z M153 115 L170 101 L187 108 L196 132 L151 132 Z",
    "#315361",
  );
  path(c, "M174 106 L186 109 L190 120 M8 118 L16 111 L25 114", P.sea, 1.1);
}

function utensils(c, p) {
  c.fillStyle = P.sand;
  c.fillRect(0, 0, 190, 132);
  // A folded linen corner gives the still life an editorial composition.
  path(c, "M109 -7 L169 0 L185 139 L120 139 Z", P.paper);
  path(c, "M119 -4 L133 137 M157 -4 L172 136", "#d8d6ca", 1);
  layer(c, p, 7, () => {
    ellipse(c, 82, 72, 45, 43, "#cdcbbc");
    ellipse(c, 81, 68, 44, 43, P.paper);
    c.beginPath();
    c.ellipse(81, 68, 37, 36, 0, 0, Math.PI * 2);
    c.strokeStyle = P.ink;
    c.lineWidth = 1.5;
    c.stroke();
    c.beginPath();
    c.ellipse(81, 68, 31, 30, 0, 0, Math.PI * 2);
    c.strokeStyle = P.sea;
    c.lineWidth = 1;
    c.stroke();
    // Ceramic rim marks remain quiet, with just enough craft at small scale.
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      path(
        c,
        `M${81 + Math.cos(a) * 39} ${68 + Math.sin(a) * 38} L${81 + Math.cos(a) * 41} ${68 + Math.sin(a) * 40}`,
        P.sea,
        0.8,
      );
    }
    // Citrus wedge with segmented pulp.
    c.save();
    c.translate(78, 67);
    c.rotate(-0.44);
    path(c, "M-21 -7 L21 -7 C19 20 -17 20 -21 -7 Z", P.orange);
    path(c, "M-17 -4 L17 -4 C14 16 -14 16 -17 -4 Z", "#f5be86");
    path(c, "M0 -4 L0 11 M0 -4 L11 7 M0 -4 L-11 7", P.paper, 1.5);
    c.restore();
  });
  // Slim conventional fork and knife, drawn as clean closed silhouettes.
  path(
    c,
    "M24 35 L26 35 L26 47 L28 47 L28 35 L30 35 L30 47 L32 47 L32 35 L34 35 L34 51 Q34 56 31 58 L31 99 Q31 102 29 102 Q27 102 27 99 L27 58 Q24 56 24 51 Z",
    P.ink,
  );
  path(
    c,
    "M139 34 C133 41 132 52 133 64 L138 65 L138 100 Q138 102 141 102 L142 34 Z",
    P.ink,
  );
  // One herb unfurls from its stem as p arrives, no independent clock.
  c.save();
  c.translate(160, 102);
  c.rotate((1 - ease(p)) * 0.2);
  path(c, "M0 0 C-2 -18 -13 -37 -7 -63", P.ink, 1.5);
  const leaves = [
    ["M-2 -12 C-17 -10 -20 -19 -17 -25 C-10 -25 -4 -21 -2 -12 Z", 0.1],
    ["M-6 -25 C5 -34 12 -32 13 -25 C9 -18 1 -17 -6 -25 Z", 0.2],
    ["M-9 -35 C-22 -34 -25 -42 -21 -48 C-14 -47 -9 -44 -9 -35 Z", 0.3],
    ["M-10 -47 C-1 -56 7 -54 8 -48 C3 -40 -4 -39 -10 -47 Z", 0.4],
    ["M-8 -57 C-16 -62 -15 -70 -8 -73 C-1 -70 -2 -63 -8 -57 Z", 0.5],
  ];
  for (const [d, delay] of leaves) {
    c.save();
    c.globalAlpha *= ease((p - delay * 0.3) / (1 - delay * 0.3));
    path(c, d, P.sea);
    c.restore();
  }
  c.restore();
}

/** Draw a centered, clipped miniature; type is mountain, waves, or utensils. */
export function drawMiniature(c, type, x, y, width, height, p = 1) {
  if (!(width > 0 && height > 0)) return;
  c.save();
  c.translate(x - width / 2, y - height / 2);
  c.beginPath();
  c.roundRect(0, 0, width, height, Math.min(18, width / 2, height / 2));
  c.clip();
  c.scale(width / 190, height / 132);
  c.lineCap = "round";
  c.lineJoin = "round";
  (type === "waves" ? waves : type === "utensils" ? utensils : mountain)(
    c,
    unit(p),
  );
  c.restore();
}
