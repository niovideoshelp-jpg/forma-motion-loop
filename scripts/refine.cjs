const fs = require("fs");
let s = fs.readFileSync("public/engine.js", "utf8");
s = s.replace(
  "c.save();c.globalAlpha=back(t,i?3.75:2.95)*(1-back(t,4.8));text(c,str.slice(0,n)",
  "c.save();c.beginPath();c.roundRect(dx[i]-w/2,dy[i]-h/2,w,h,mix(23,40,p));c.clip();c.globalAlpha=back(t,i?3.75:2.95)*(1-back(t,4.8));text(c,str.slice(0,n)",
);
s = s.replace(
  "if(out>.3)gooDots([{x:dx[0],y:dy[0],r:23},{x:0,y:0,r:mix(23,50,out)},{x:dx[1],y:dy[1],r:23}]);",
  "c.save();c.globalAlpha=E(t,4.8);gooDots([{x:dx[0],y:dy[0],r:23},{x:0,y:0,r:mix(23,50,out)},{x:dx[1],y:dy[1],r:23}]);c.restore();",
);
s = s.replace(
  "thin>.99?C.orange:C.ink",
  "`rgb(${Math.round(mix(17,212,thin))},${Math.round(mix(18,119,thin))},${Math.round(mix(17,85,thin))})`",
);
s = s.replace(
  "rr(c,-w/2,-h/2,w,h,h/2,C.ink);c.restore();c.save();c.globalAlpha=back(t,20.4)",
  "rr(c,-w/2,-h/2,w,h,h/2,`rgb(${Math.round(mix(212,17,gen))},${Math.round(mix(119,18,gen))},${Math.round(mix(85,17,gen))})`);c.restore();c.save();c.globalAlpha=back(t,20.4)",
);
fs.writeFileSync("public/engine.js", s);
