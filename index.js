const Canvas = document.getElementById("mycanvas");
const ctx = Canvas.getContext("2d");
Canvas.width = 500;
Canvas.height = 500;
const cursor = document.getElementById("cursor");

animateloop = 0;
zoom = 120;
scale = 1 / zoom;
DetailItration = 25;
originR = 0;
originI = 0;

Colors4 = [];
ColorFlag = "M";

ColorSet = [];

Canvas.addEventListener("click", (e) => {
  console.log(e.offsetX, e.offsetY);

  let arr = ScreentoWorld(e.offsetX, e.offsetY);
  originI = arr[1];
  originR = arr[0];
  CoverCanvas();
});
window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  clearInterval(myinter);
});

function SetColorSet(colornum) {
  if (colornum == "Monochromatic") {
    ColorFlag = "M";
    $("#Scolor").fadeIn(200);
    Colors4 = getShadesOfColor($("#Scolor").val(), 66);
    ColorSet = Colors4;
  } else if (colornum == "differentiation") {
    ColorFlag = "D";
    $("#Scolor").fadeIn(200);
    Colors4 = colorWheel2($("#Scolor").val());
    ColorSet = Colors4;
  }
}

function SetStartColor(value) {
  if (ColorFlag == "D") {
    //diffrent color
    Colors4 = getColorWheel(value,720,0.2);
  } else {
    //colorFlag==M
    //chrom colors
    Colors4 = getShadesOfColor(value, 66);
  }

  ColorSet = Colors4;
}

function StartMandelBrot(x, y) {
  //normaleizer
  const C = ScreentoWorld(x, y);
  const Creal = C[0];
  const Cimg = C[1];

  let Zreal = 0;
  let Zimg = 0;

  for (let i = 0; i < DetailItration; i++) {
    const _Zreal = Zreal * Zreal - Zimg * Zimg + Creal;
    const _Zimg = 2 * Zreal * Zimg + Cimg;
    Zreal = _Zreal;
    Zimg = _Zimg;

    const dist = Math.sqrt(Zreal * Zreal + Zimg * Zimg);
    if (dist > 2) {
      const color = ColorSet[i % ColorSet.length];
      ctx.fillStyle = color;
      PointThis(x, y);
      return;
    }
  }

  ctx.fillStyle = "black";
  PointThis(x, y);
}

function CoverCanvas() {
  $("#DownloadBTN").fadeIn(250);
  if (ColorSet.length == 0) {
    ColorSet = Colors;
  }
  for (let x = 0; x < Canvas.width; x++) {
    for (let y = 0; y < Canvas.height; y++) {
      StartMandelBrot(x, y);
    }
  }
}

function PointThis(x, y) {
  ctx.beginPath();

  ctx.arc(x, y, 1, 0, Math.PI * 2);
  ctx.fill();
}

function ScreentoWorld(x, y) {
  const real = originR + (x - Canvas.width / 2) * scale;
  const imge = originI - (y - Canvas.height / 2) * scale;
  return [real, imge];
}
function ScreentoWorld2(x, y) {
  const real = originR + (x - Canvas.width / 2) * scale;
  const imge = originI - (y - Canvas.height / 2) * scale;
  return [real, imge];
}

function WorldtoScreen(real, imge) {
  const x = (real - originR) / scale + Canvas.width / 2;
  const y = -(imge - originI) / scale + Canvas.height / 2;
  return [x, y];
}

function Displaytool() {
  $("#ModalTool").fadeIn(500);
}
function CloseTool() {
  $("#ModalTool").fadeOut(250);
}

function SetMandelZoomin() {
  let Sharp = $("#SharpIN").val();
  let valuetozoom = $("#ZoomIN").val();
  let Zoom = 1;

  if (valuetozoom == "") {
    zoom = 120;
  } else {
    Zoom = parseFloat(valuetozoom);
  }

  if (Sharp == "") {
    Sharp = 100;
  }

  zoom = Zoom * zoom;
  if (zoom < 10) {
    zoom = 10;
  }

  if (Sharp > 5000) {
    Sharp = 5000;
  }
  DetailItration = Sharp;
  scale = 1 / zoom;

  console.log("zoom", zoom, "value", Zoom);
  document.getElementById("zoomTitle").innerHTML = `Current zoom: ${Math.round(
    zoom / 120
  )}X`;
  CoverCanvas();
}

function ResetCanvas() {
  zoom = 120;
  scale = 1 / zoom;
  CoverCanvas();
}

function DownloadIMG() {
  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(GEN.canvas.msSaveBlob(), "canvasGenrator.png");
  } else {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = Canvas.toDataURL();
    a.download = "MandelBrot_by_Gilad_Meirson.png";
    a.click();
    document.body.removeChild(a);
  }
}

function AnimateMandel() {
  animateloop = 0;
  zoom = 120;
  scale = 1 / zoom;
  originR = 0;
  originI = 0;
  myinter = setInterval(theInterVal, 1100);
}

function theInterVal() {
  animateloop++;
  if (animateloop > 25) {
    clearInterval(myinter);
  }
  DetailItration = animateloop;
  CoverCanvas();
}

function DisplayInfo() {
  $("#infoModal").fadeIn(500);
}
function CloseInfo() {
  $("#infoModal").fadeOut(250);
}

//////Colors ------------------------------------

//gpt

// function generateMonochromaticColors(color, numColors) {
//   // Parse the input color as an RGB value
//   const rgb = hexToRgb(color);

//   // Calculate the HSL values of the input color
//   const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
//   const hue = hsl.h;
//   const saturation = hsl.s;
//   const lightness = hsl.l;

//   // Create an array to store the monochromatic colors
//   const monochromaticColors = [];

//   // Calculate the step size between each color
//   const stepSize = (1 - lightness) / (numColors - 1);

//   // Generate the monochromatic colors
//   for (let i = 0; i < numColors; i++) {
//     // Calculate the lightness of the current color
//     const currentLightness = lightness + i * stepSize;

//     // Convert the HSL values back to RGB
//     const currentRgb = hslToRgb(hue, saturation, currentLightness);

//     // Convert the RGB value to a hex string
//     const currentColor = rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b);

//     // Add the color to the array
//     monochromaticColors.push(currentColor);
//   }

//   // Return the array of monochromatic colors
//   return monochromaticColors;
// }

// Helper functions

function hexToRgb(hex) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return { r, g, b };
}

function rgbToHsl(r, g, b) {
  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h, s, l };
}

function hslToRgb(h, s, l) {
  let r, g, b;
  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function rgbToHex(r, g, b) {
  const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };
  const hexR = componentToHex(r);
  const hexG = componentToHex(g);
  const hexB = componentToHex(b);
  return "#" + hexR + hexG + hexB;
}

function getMonochromaticColors(startColor, numColors) {
  const rgbColor = hexToRgb(startColor);
  const hslColor = rgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b);
  const h = hslColor.h;
  const s = hslColor.s;
  const l = hslColor.l;

  const step = 360 / numColors;
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const h1 = (h + i * step) % 360;
    const rgbColor = hslToRgb(h1 / 360, s, l);
    const hexColor = rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b);
    colors.push(hexColor);
  }
  return colors;
}
function colorWheel2(startColor) {
  // Convert the starting color to an RGB value
  let color = hexToRgb(startColor);
  // Convert the starting color to an HSV value
  let hsv = rgbToHsv(color.r, color.g, color.b);
  // Initialize an empty array to store the colors
  let colors = [];
  // Add the starting color to the array
  colors.push(rgbToHex(color.r, color.g, color.b));

  // Loop through the hue values (0-360 degrees)
  for (let hue = hsv.h*360; hue <= 360; hue += 1) {
    // Convert the hue to an RGB value
    hsv.h = hue / 360;
    hsv.v = 0.5 + 0.5 * Math.sin((hue * Math.PI) / 180);
    color = hsvToRgb(hsv.h, hsv.s, hsv.v);
    // Add the color to the array
    colors.push(rgbToHex(color.r, color.g, color.b));
    if (hue == 360) {
      hue = 1;
    }
    // If the color matches the starting color, exit the loop
    if (rgbToHex(color.r, color.g, color.b) === startColor) {
      break;
    }
  }

  // Return the array of colors
  return colors;
}

function getColorWheel(color, steps, variation) {
  // Convert the input color to HSL format
  let hsl = tinycolor(color).toHsl();

  // Calculate the step size for the hue angle
  let hueStep = 360 / steps;

  let colors = [];

  for (let i = 0; i < steps; i++) {
    // Calculate the hue angle for this step
    let hue = (hsl.h + i * hueStep) % 360;

    // Calculate the saturation and lightness for this step
    let sat = Math.min(Math.max(hsl.s + (Math.random() - 0.5) * variation, 0), 1);
    let light = Math.min(Math.max(hsl.l + (Math.random() - 0.5) * variation, 0), 1);

    // Convert the HSL color back to hex format
    let color = tinycolor({h: hue, s: sat, l: light}).toHexString();

    colors.push(color);
  }

  return colors;
}


// Function to convert an RGB color value to an HSV color value
function rgbToHsv(r, g, b) {
  (r /= 255), (g /= 255), (b /= 255);

  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    v = max;

  let d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h, s, v };
}

// Function to convert an HSV color value to an RGB color value
function hsvToRgb(h, s, v) {
  let r, g, b;
  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function getShadesOfColor(hexColor, val) {
  // Remove the '#' character from the hex color string
  hexColor = hexColor.replace("#", "");

  // Split the hex color string into three substrings for the red, green, and blue values
  let red = parseInt(hexColor.substring(0, 2), 16);
  let green = parseInt(hexColor.substring(2, 4), 16);
  let blue = parseInt(hexColor.substring(4, 6), 16);

  // Determine the minimum and maximum value for the RGB components
  let minRGB = Math.min(red, green, blue);
  let maxRGB = Math.max(red, green, blue);

  // Calculate the difference between the maximum and minimum values
  let diff = maxRGB - minRGB;

  // Initialize an empty array for the output colors
  let outputColors = [];

  // Generate colors with varying shades
  for (let i = 0; i <= 255; i++) {
    let r = red + (i - 128) * (diff / 256) + (-val + Math.random() * val * 2);
    let g = green + (i - 128) * (diff / 256) + (-val + Math.random() * val * 2);
    let b = blue + (i - 128) * (diff / 256) + (-val + Math.random() * val * 2);

    // Ensure that RGB values are within the valid range (0-255)
    r = Math.max(0, Math.min(255, Math.round(r)));
    g = Math.max(0, Math.min(255, Math.round(g)));
    b = Math.max(0, Math.min(255, Math.round(b)));

    // Convert the RGB values to a hex color string and add it to the output array
    let hex =
      "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    outputColors.push(hex);
  }

  // Return the array of output colors
  return outputColors;
}
