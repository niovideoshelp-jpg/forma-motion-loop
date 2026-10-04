import fs from "node:fs";
import { geoMercator, geoPath, geoGraticule } from "d3-geo";
import { feature, mesh } from "topojson-client";
const folder = "public/assets/orbita-vectors";
fs.mkdirSync(folder, { recursive: true });
const names = [
  "search",
  "arrow-up-right",
  "arrow-right",
  "plane",
  "map-pin",
  "calendar-days",
  "clock-3",
  "luggage",
  "check",
  "compass",
  "mountain",
  "waves",
  "utensils",
  "sun",
  "chevron-right",
  "ticket",
  "navigation",
  "sparkles",
];
const icons = {};
for (const name of names) {
  const svg = fs.readFileSync(
    `node_modules/lucide-static/icons/${name}.svg`,
    "utf8",
  );
  fs.writeFileSync(`${folder}/${name}.svg`, svg);
  icons[name] = svg;
}
const atlas = JSON.parse(
  fs.readFileSync("node_modules/world-atlas/countries-50m.json", "utf8"),
);
const projection = geoMercator()
  .center([-12.5, 36.2])
  .scale(3300)
  .translate([0, 0])
  .clipExtent([
    [-580, -490],
    [580, 490],
  ]);
const path = geoPath(projection).digits(2);
const countries = feature(atlas, atlas.objects.countries);
const land = path(countries),
  borders = path(mesh(atlas, atlas.objects.countries, (a, b) => a !== b));
const grid = path(geoGraticule().step([2, 2])());
const lis = projection([-9.1393, 38.7223]),
  fnc = projection([-16.9241, 32.6669]);
const data = { icons, land, borders, grid, lis, fnc };
fs.writeFileSync(`${folder}/vectors.json`, JSON.stringify(data));
fs.writeFileSync(
  `${folder}/atlantic-map.svg`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-580 -490 1160 980"><rect x="-580" y="-490" width="1160" height="980" fill="#102e3c"/><path d="${grid}" fill="none" stroke="#284654"/><path d="${land}" fill="#325564" stroke="#587783"/><path d="${borders}" fill="none" stroke="#587783"/></svg>`,
);
// UMD uses top-level `this`; ES modules expose globalThis instead.
fs.writeFileSync(
  `${folder}/flubber.min.js`,
  fs
    .readFileSync("node_modules/flubber/build/flubber.min.js", "utf8")
    .replace("}(this,function", "}(globalThis,function"),
);
for (const [pkg, file] of [
  ["lucide-static", "LICENSE"],
  ["d3-geo", "LICENSE"],
  ["topojson-client", "LICENSE"],
  ["world-atlas", "LICENSE"],
  ["flubber", "LICENSE"],
]) {
  if (fs.existsSync(`node_modules/${pkg}/${file}`))
    fs.copyFileSync(
      `node_modules/${pkg}/${file}`,
      `${folder}/${pkg}-LICENSE.txt`,
    );
}
console.log("Vector assets built", names.length, "icons", { lis, fnc });
