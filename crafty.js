var RESIZE = 15; // Scale pattern canvas by this much

var out = document.getElementById('out');
var scaled = document.getElementById('scaled');

var img = null;
document.getElementById('file').onchange = function(e) {
  var files = e.target.files || e.dataTransfer.files;
  update(files[0]);
};

document.getElementById('bwpattern').onchange = function() {
  if (img == null) { return; }
  palettize();
};

document.getElementById('palette').onchange = function() {
  if (img == null) { return; }
  palettize();
};

var samples = document.getElementsByTagName('img');
for (var i = 0; i < samples.length; i++) {
  samples[i].onclick = function(e) {
    img = e.target;
    palettize();
  };
  samples[i].style.cursor = 'pointer';
}

function palettize() {
  var orig = document.createElement('canvas');
  var origCtx = orig.getContext('2d');
  orig.width = img.width;
  orig.height = img.height;
  origCtx.drawImage(img, 0, 0);
  document.getElementById('orig').src = orig.toDataURL();

  var outCtx = out.getContext('2d');
  out.width = img.width;
  out.height = img.height;

  // Apply palette to the image
  var imgd = origCtx.getImageData(0, 0, orig.width, orig.height);
  var palette = palettes[document.getElementById('palette').value];
  var pix = imgd.data;
  var map = {};
  closestMap = {};
  for (var i = 0, n = pix.length; i < n; i += 4) {
    var r = pix[i  ] * pix[i+3]/255;
    var g = pix[i+1] * pix[i+3]/255;
    var b = pix[i+2] * pix[i+3]/255;
    if (pix[i+3] == 0) {
      // transparent
      continue;
    }
    var cl = closest([r, g, b], palette.colors);
    if (cl in map) { map[cl]++; } else { map[cl] = 1; }
    pix[i  ] = cl[0];
    pix[i+1] = cl[1];
    pix[i+2] = cl[2];
  }
  outCtx.putImageData(imgd, 0, 0);
  out.onclick = function() { window.open(out.toDataURL()); };

  if (orig.width * orig.height < 1000000 ||
      !window.confirm('This is a large image, are you sure you want to generate the pattern? It may take a while...')) {
    drawCanvas(map);
  }

  document.getElementById('dimensions').innerText = (
    Math.round(out.width*palette.dimensions*100)/100 + '" wide, ' +
    Math.round(out.height*palette.dimensions*100)/100 + '" tall');
}

// TODO: unicode symbols?
var ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=_+,./\][{}:"<>?'.split('');

function drawCanvas(map) {
  var imgd = out.getContext('2d').getImageData(0, 0, out.width, out.height);
  var scaledCtx = scaled.getContext('2d');
  scaled.width = out.width * RESIZE;
  scaled.height = out.height * RESIZE;
  var symbols = {}, a = 0;
  for (var x = 0; x < orig.width; x++) {
    for (var y = 0; y < orig.height; y++) {
      var idx = y*out.width*4 + x*4;
      var p = imgd.data.subarray(idx, idx+4);
      if (p[3] != 0) {
        var c = hex(p);

        if (document.getElementById('bwpattern').checked) {
          if (!symbols[c]) {
            symbols[c] = ALPHABET[a++];
          }
          var s = symbols[c];
          scaledCtx.font = '12px Arial';
          scaledCtx.strokeText(s, x*RESIZE+RESIZE/3, y*RESIZE+RESIZE*2/3, RESIZE);
        } else {
          scaledCtx.fillStyle = c;
          scaledCtx.fillRect(x*RESIZE, y*RESIZE, RESIZE-1, RESIZE-1);
        }
      }
      scaledCtx.strokeRect(x*RESIZE, y*RESIZE, RESIZE-1, RESIZE-1);
    }
  }

  var s = document.getElementById('selected');
  var st = document.getElementById('selected-text');
  var sc = document.getElementById('selected-color');
  var palette = palettes[document.getElementById('palette').value];
  scaled.onmousemove = function(e) {
    var x = Math.floor(e.offsetX / RESIZE);
    var y = Math.floor(e.offsetY / RESIZE);
    var idx = y*out.width*4 + x*4;
    var p = imgd.data.subarray(idx, idx+4);
    s.style.display = (p[3] == 0) ? 'none': '';
    if (p[3] == 0) {
      return;
    }
    s.style.position = 'absolute';
    s.style.top = e.pageY + 20;
    s.style.left = e.pageX + 20;
    for (var i = 0; i < palette.colors.length; i++) {
      var c = palette.colors[i];
      var hc = hex(c);
      if (hc == hex(p)) { // HACK
        st.innerText = c[3] + ' @ (' + x + ','+ y + ')';
        if (hc in symbols) {
          st.innerText = '(' + symbols[hc] + ') ' + st.innerText;
        }
        sc.style.backgroundColor = hc;
        break;
      }
    }
  };
  scaled.onmouseout = function() { s.style.display = 'none'; };

  printMap(map, symbols);
}

function update(file) {
  var reader = new FileReader();
  reader.onload = function(e){
    img = new Image();
    img.src = e.target.result;
    palettize();
  };
  reader.readAsDataURL(file);
};

// color is a three-element array
var closestMap = {};
function closest(color, palette) {
  if (color in closestMap) { return closestMap[color]; }
  var closest = null;
  var dist = Infinity;
  for (var i = 0; i < palette.length; i++) {
    var c = palette[i];
    if (color == c) { return c; }
    var d = distance(c, color);
    if (closest == null || d < dist) {
      closest = c;
      dist = d;
    }
  }
  closestMap[color] = closest;
  return closest;
}

function distance(a, b) {
  return Math.pow(Math.abs(a[0]-b[0]), 2) +
      Math.pow(Math.abs(a[1]-b[1]), 2) +
      Math.pow(Math.abs(a[2]-b[2]), 2);
}

function hex(color) {
  var r = parseInt(color[0]).toString(16); if (r.length == 1) { r = '0' + r; }
  var g = parseInt(color[1]).toString(16); if (g.length == 1) { g = '0' + g; }
  var b = parseInt(color[2]).toString(16); if (b.length == 1) { b = '0' + b; }
  return '#' + r + g + b;
}

function printMap(map, symbols) {
  document.getElementById('table').style.display = '';
  // Sort map by color count
  var arr = [];
  for (k in map) {
    arr.push({'count': map[k], 'color': k.split(',')});
  }
  arr.sort(function(a, b) {
    if (a.count == b.count) { return 0; }
    if (a.count < b.count) { return 1; }
    return -1;
  });

  // Clear the table
  var table = document.getElementById('counts');
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }

  for (var i = 0; i < arr.length; i++) {
    var c = hex(arr[i].color);
    var tr = document.createElement('tr');
    var c0 = document.createElement('td');
    if (c in symbols) {
      c0.innerText = '(' + symbols[c] + ') ';
    }
    var c1 = document.createElement('td');
    c1.innerText = arr[i].color[3];
    var c2 = document.createElement('td');
    c2.innerText = arr[i].count;
    var c3 = document.createElement('td');
    c3.style.backgroundColor = c;
    c3.style.width = '100px';

    tr.appendChild(c0);
    tr.appendChild(c1);
    tr.appendChild(c2);
    tr.appendChild(c3);
    table.appendChild(tr);
  }
}

var palettes = {
  'dmc': {'dimensions': 1.0 / 14, 'colors': [ // 14-count
    [255, 255, 255, "000-blancWhite"],
    [148, 91, 128,  "208-Lavender-VYDK"],
    [206, 148, 186, "209-Lavender-DK"],
    [236, 207, 225, "210-Lavender-MD"],
    [243, 218, 228, "211-Lavender-LT"],
    [156, 41, 74,   "221-ShellPink-VYDK"],
    [219, 128, 115, "223-ShellPink-LT"],
    [255, 199, 176, "224-ShellPink-VYLT"],
    [255, 240, 228, "225-ShellPink-ULTVYL"],
    [143, 57, 38,   "300-Mahogany-VYDK"],
    [209, 102, 84,  "301-Mahogany-MD"],
    [188, 0, 97,    "304-ChristmasRed-MD"],
    [255, 231, 109, "307-Lemon"],
    [214, 43, 91,   "309-Rose-DP"],
    [0, 0, 0,       "310-Black"],
    [0, 79, 97,     "311-NavyBlue-MD"],
    [58, 84, 103,   "312-NavyBlue-LT"],
    [163, 90, 91,   "315-AntiqueMauve-VYDK"],
    [220, 141, 141, "316-AntiqueMauve-MD"],
    [167, 139, 136, "317-PewterGrey"],
    [197, 198, 190, "318-SteelGrey-LT"],
    [85, 95, 82,    "319-PistachioGrn-VYDK"],
    [138, 153, 120, "320-PistachioGreen-MD"],
    [231, 18, 97,   "321-ChristmasRed"],
    [81, 109, 135,  "322-NavyBlue-VYLT"],
    [188, 22, 65,   "326-Rose-VYDP"],
    [61, 0, 103,    "327-Violet-DK"],
    [127, 84, 130,  "333-BlueViolet-VYDK"],
    [115, 140, 170, "334-BabyBlue-MD"],
    [219, 36, 79,   "335-Rose"],
    [36, 73, 103,   "336-NavyBlue"],
    [162, 121, 164, "340-BlueViolet-MD"],
    [145, 180, 197, "341-BlueViolet-LT"],
    [194, 36, 67,   "347-Salmon-VYDK"],
    [220, 61, 91,   "349-Coral-DK"],
    [237, 69, 90,   "350-Coral-MD"],
    [255, 128, 135, "351-Coral"],
    [255, 157, 144, "352-Coral-LT"],
    [255, 196, 184, "353-PeachFlesh"],
    [189, 73, 47,   "355-TerraCotta-DK"],
    [226, 114, 91,  "356-TerraCotta-MD"],
    [95, 112, 91,   "367-PistachioGreen-DK"],
    [181, 206, 162, "368-PistachioGreen-LT"],
    [243, 250, 209, "369-PistachioGrn-VYLT"],
    [184, 138, 87,  "370-Mustard-MD"],
    [196, 155, 100, "371-Mustard"],
    [203, 162, 107, "372-Mustard-LT"],
    [157, 60, 39,   "400-Mahogany-DK"],
    [255, 190, 164, "402-Mahogany-VYLT"],
    [194, 101, 76,  "407-SportsmanFlsh-VYD"],
    [109, 95, 95,   "413-PewterGrey-DK"],
    [167, 139, 136, "414-SteelGrey-DK"],
    [221, 221, 218, "415-PearlGrey"],
    [140, 91, 43,   "420-HazelNutBrown-DK"],
    [237, 172, 123, "422-HazelNutBrown-LT"],
    [151, 84, 20,   "433-Brown-MD"],
    [178, 103, 70,  "434-Brown-LT"],
    [187, 107, 57,  "435-Brown-VYLT"],
    [231, 152, 115, "436-Tan"],
    [238, 171, 121, "437-Tan-LT"],
    [255, 176, 0,   "444-Lemon-DK"],
    [255, 255, 190, "445-Lemon-LT"],
    [179, 151, 143, "451-ShellGrey-DK"],
    [210, 185, 175, "452-ShellGrey-MD"],
    [235, 207, 185, "453-ShellGrey-LT"],
    [116, 114, 92,  "469-AvocadoGreen"],
    [133, 143, 108, "470-AvocadoGreen-LT"],
    [176, 187, 140, "471-AvocadoGreen-VYLT"],
    [238, 255, 182, "472-AvocadoGreen-ULTL"],
    [187, 0, 97,    "498-ChristmasRed-LT"],
    [43, 57, 41,    "500-BlueGreen-VYDK"],
    [67, 85, 73,    "501-BlueGreen-DK"],
    [134, 158, 134, "502-BlueGreen"],
    [195, 206, 183, "503-BlueGreen-MD"],
    [206, 221, 193, "504-BlueGreen-LT"],
    [16, 127, 135,  "517-Wedgewood-MD"],
    [102, 148, 154, "518-Wedgewood-LT"],
    [194, 209, 207, "519-SkyBlue"],
    [55, 73, 18,    "520-FernGreen-DK"],
    [159, 169, 142, "522-FernGreen"],
    [172, 183, 142, "523-FernGreen-LT"],
    [205, 182, 158, "524-FernGreen-VYLT"],
    [85, 85, 89,    "535-AshGrey-VYLT"],
    [239, 214, 188, "543-BeigeBrown-ULVYL"],
    [109, 18, 97,   "550-Violet-VYLT"],
    [146, 85, 130,  "552-Violet-MD"],
    [160, 100, 146, "553-Violet"],
    [243, 206, 225, "554-Violet-LT"],
    [59, 96, 76,    "561-Jade-VYDK"],
    [97, 134, 97,   "562-Jade-MD"],
    [182, 212, 180, "563-Jade-LT"],
    [214, 230, 204, "564-Jade-VYLT"],
    [0, 103, 0,     "580-MossGreen-DK"],
    [151, 152, 49,  "581-MossGreen"],
    [128, 151, 132, "597-Turquoise"],
    [208, 223, 205, "598-Turquoise-LT"],
    [208, 57, 106,  "600-Cranberry-VYDK"],
    [222, 57, 105,  "601-Cranberry-DK"],
    [231, 84, 122,  "602-Cranberry-MD"],
    [255, 115, 140, "603-Cranberry"],
    [255, 189, 202, "604-Cranberry-LT"],
    [255, 207, 214, "605-Cranberry-VYLT"],
    [255, 0, 0,     "606-BrightOrange-Red"],
    [255, 91, 0,    "608-BrightOrange"],
    [151, 104, 84,  "610-DrabBrown-VYDK"],
    [158, 109, 91,  "611-DrabBrown-DK"],
    [203, 152, 103, "612-DrabBrown-MD"],
    [219, 176, 122, "613-DrabBrown-LT"],
    [162, 77, 52,   "632-NegroFlesh-MD"],
    [163, 163, 157, "640-BeigeGrey-VYDK"],
    [174, 176, 170, "642-BeigeGrey-DK"],
    [224, 224, 215, "644-BeigeGrey-MD"],
    [113, 113, 113, "645-BeaverGrey-VYDK"],
    [121, 121, 121, "646-BeaverGrey-DK"],
    [190, 190, 185, "647-BeaverGrey-MD"],
    [202, 202, 202, "648-BeaverGrey-LT"],
    [213, 39, 86,   "666-ChristmasRed-LT"],
    [255, 206, 158, "676-OldGold-LT"],
    [255, 231, 182, "677-OldGold-VYLT"],
    [209, 140, 103, "680-OldGold-DK"],
    [0, 91, 6,      "699-ChirstmasGreen"],
    [0, 96, 47,     "700-ChristmasGreen-BRT"],
    [79, 108, 69,   "701-ChristmasGreen-LT"],
    [79, 121, 66,   "702-KellyGreen"],
    [121, 144, 76,  "703-Chartreuse"],
    [165, 164, 103, "704-Chartreuse-BRT"],
    [245, 240, 219, "712-Cream"],
    [219, 55, 121,  "718-Plum"],
    [200, 36, 43,   "720-OrangeSpice-DK"],
    [255, 115, 97,  "721-OrangeSpice-MD"],
    [255, 146, 109, "722-OrangeSpice-LT"],
    [255, 200, 124, "725-Topaz"],
    [255, 224, 128, "726-Topaz-LT"],
    [255, 235, 168, "727-Topaz-VYLT"],
    [243, 176, 128, "729-OldGold-MD"],
    [132, 102, 0,   "730-OliveGreen-VYDK"],
    [140, 103, 0,   "731-OliveGreen-DK"],
    [145, 104, 0,   "732-OliveGreen"],
    [206, 155, 97,  "733-OliveGreen-MD"],
    [221, 166, 107, "734-OliveGreen-LT"],
    [244, 195, 139, "738-Tan-VYLT"],
    [244, 233, 202, "739-Tan-ULTVYLT"],
    [255, 131, 19,  "740-Tangerine"],
    [255, 142, 4,   "741-Tangerine-MD"],
    [255, 183, 85,  "742-Tangerine-LT"],
    [255, 230, 146, "743-Yellow-MD"],
    [255, 239, 170, "744-Yellow-PALE"],
    [255, 240, 197, "745-Yellow-LTPALE"],
    [246, 234, 219, "746-OffWhite"],
    [240, 247, 239, "747-SkyBlue-VYLT"],
    [251, 227, 209, "754-PeachFlesh-LT"],
    [255, 177, 147, "758-TerraCotta-VYLT"],
    [249, 160, 146, "760-Salmon"],
    [255, 201, 188, "761-Salmon-LT"],
    [232, 232, 229, "762-PearlGrey-VYLT"],
    [231, 249, 203, "772-PineGreen--LT"],
    [247, 246, 248, "775-BabyBlue-VYLT"],
    [255, 177, 174, "776-Pink-MD"],
    [255, 199, 184, "778-AntiqueMauve-VYLT"],
    [181, 98, 46,   "780-Topaz-ULTVYDK"],
    [181, 107, 56,  "781-Topaz-VYDK"],
    [204, 119, 66,  "782-Topaz-DK"],
    [225, 146, 85,  "783-Topaz-MD"],
    [71, 55, 93,    "791-CornflowerBlue-VYD"],
    [97, 97, 128,   "792-CornflowerBlue-DK"],
    [147, 139, 164, "793-CornflowerBlue-MD"],
    [187, 208, 218, "794-CornflowerBlue-LT"],
    [30, 58, 95,    "796-RoyalBlue-DK"],
    [30, 66, 99,    "797-RoyalBlue"],
    [103, 115, 141, "798-Delft-DK"],
    [132, 156, 182, "799-Delft-MD"],
    [233, 238, 233, "800-Delft-PALE"],
    [123, 71, 20,   "801-CoffeeBrown-DK"],
    [30, 130, 133,  "806-PeacockBlue-DK"],
    [128, 167, 160, "807-PeacockBlue"],
    [190, 193, 205, "809-Delft"],
    [175, 195, 205, "813-Blue-LT"],
    [162, 0, 88,    "814-Garnet-DK"],
    [166, 0, 91,    "815-Garnet-MD"],
    [179, 0, 91,    "816-Garnet"],
    [219, 24, 85,   "817-CoralRed-VYDK"],
    [255, 234, 235, "818-BabyPink"],
    [248, 247, 221, "819-BabyPink-LT"],
    [30, 54, 85,    "820-RoyalBlue-VYDK"],
    [242, 234, 219, "822-BeigeGrey-LT"],
    [0, 0, 73,      "823-NavyBlue-DK"],
    [71, 97, 116,   "824-Blue-VYDK"],
    [85, 108, 128,  "825-Blue-DK"],
    [115, 138, 153, "826-Blue-MD"],
    [213, 231, 232, "827-Blue-VYLT"],
    [237, 247, 238, "828-Blue-ULTVYLT"],
    [130, 90, 8,    "829-GoldenOlive-VYDK"],
    [136, 95, 18,   "830-GoldenOlive-DK"],
    [144, 103, 18,  "831-GoldenOlive-MD"],
    [178, 119, 55,  "832-GoldenOlive"],
    [219, 182, 128, "833-GoldenOlive-LT"],
    [242, 209, 142, "834-GoldenOlive-VYLT"],
    [94, 56, 27,    "838-BeigeBrown-VYDK"],
    [109, 66, 39,   "839-BeigeBrown-DK"],
    [128, 85, 30,   "840-BeigeBrown-MD"],
    [188, 134, 107, "841-BeigeBrown-LT"],
    [219, 194, 164, "842-BeigeBrown-VYLT"],
    [107, 103, 102, "844-BeaverBrown-ULTD"],
    [153, 92, 48,   "868-HazelNutBrown-VYD"],
    [153, 92, 48,   "869-HazelNutBrn-VYDK"],
    [79, 86, 76,    "890-PistachioGrn-ULTD"],
    [241, 49, 84,   "891-Carnation-DK"],
    [249, 90, 97,   "892-Carnation-MD"],
    [243, 149, 157, "893-Carnation-LT"],
    [255, 194, 191, "894-Carnation-VYLT"],
    [89, 92, 78,    "895-HunterGreen-VYDK"],
    [118, 55, 19,   "898-CoffeeBrown-VYDK"],
    [233, 109, 115, "899-Rose-MD"],
    [206, 43, 0,    "900-BurntOrange-DK"],
    [138, 24, 77,   "902-Granet-VYDK"],
    [78, 95, 57,    "904-ParrotGreen-VYDK"],
    [98, 119, 57,   "905-ParrotGreen-DK"],
    [143, 163, 89,  "906-ParrotGreen-MD"],
    [185, 200, 102, "907-ParrotGreen-LT"],
    [49, 105, 85,   "909-EmeraldGreen-VYDK"],
    [48, 116, 91,   "910-EmeraldGreen-DK"],
    [49, 128, 97,   "911-EmeraldGreen-MD"],
    [115, 158, 115, "912-EmeraldGreen-LT"],
    [153, 188, 149, "913-NileGreen-MD"],
    [170, 24, 91,   "915-Plum-DK"],
    [171, 22, 95,   "917-Plum-MD"],
    [168, 68, 76,   "918-RedCopper-DK"],
    [180, 75, 82,   "919-RedCopper"],
    [197, 94, 88,   "920-Copper-MD"],
    [206, 103, 91,  "921-Copper"],
    [237, 134, 115, "922-Copper-LT"],
    [86, 99, 100,   "924-GreyGreen--VYDK"],
    [96, 116, 115,  "926-GreyGreen-LT"],
    [200, 198, 194, "927-GreyGreen-LT"],
    [225, 224, 216, "928-GreyGreen--VYLT"],
    [102, 122, 140, "930-AntiqueBlue-DK"],
    [124, 135, 145, "931-AntiqueBlue-MD"],
    [182, 186, 194, "932-AntiqueBlue-LT"],
    [62, 59, 40,    "934-BlackAvocadoGreen"],
    [67, 63, 47,    "935-AvocadoGreen-DK"],
    [69, 69, 49,    "936-AvocadoGreen--VYD"],
    [73, 86, 55,    "937-AvocadoGreen-MD"],
    [99, 39, 16,    "938-CoffeeBrown-ULTDK"],
    [0, 0, 49,      "939-NavyBlue-VyDK"],
    [0, 162, 117,   "943-Aquamarine-MD"],
    [255, 206, 164, "945-Flesh-MD"],
    [244, 73, 0,    "946-BurntOrange-MD"],
    [255, 91, 0,    "947-BurntOrange"],
    [255, 243, 231, "948-PeachFlesh-VYLT"],
    [239, 162, 127, "950-SportsmanFlesh"],
    [255, 229, 188, "951-Flesh"],
    [170, 213, 164, "954-NileGreen"],
    [214, 230, 204, "955-NileGreen-LT"],
    [255, 109, 115, "956-Geranium"],
    [255, 204, 208, "957-Gernanium-PALE"],
    [0, 160, 130,   "958-SeaGreen-DK"],
    [171, 206, 177, "959-SeaGreen-MD"],
    [243, 108, 123, "961-DustyRose-DK"],
    [253, 134, 141, "962-DustyRose-MD"],
    [208, 224, 210, "964-SeaGreen-LT"],
    [206, 213, 176, "966-BabyGreen-MD"],
    [255, 117, 24,  "970-Pumpkin-LT"],
    [255, 106, 0,   "971-Pumpkin"],
    [255, 146, 0,   "972-Canary-DP"],
    [255, 194, 67,  "973-Canary-BRT"],
    [158, 67, 18,   "975-GoldenBrown-DK"],
    [246, 141, 57,  "976-GoldenBrown-MD"],
    [255, 164, 73,  "977-GoldenBrown-LT"],
    [58, 82, 65,    "986-ForestGreen-VYDK"],
    [83, 97, 73,    "987-ForestGreen-DK"],
    [134, 145, 110, "988-ForestGreen-MD"],
    [134, 153, 110, "989-ForestGreen"],
    [47, 91, 73,    "991-Aquamarine-DK"],
    [146, 183, 165, "992-Aquamarine"],
    [192, 224, 200, "993-Aquamarine-LT"],
    [0, 123, 134,   "995-ElectricBlue-DK"],
    [170, 222, 225, "996-ElectricBlue-MD"],
    [123, 91, 64,   "3011-KhakiGreen-DK"],
    [170, 134, 103, "3012-KhakiGreen-MD"],
    [208, 195, 164, "3013-KhakiGreen-LT"],
    [115, 91, 93,   "3021-BrownGrey-VYDK"],
    [172, 172, 170, "3022-BrownGrey-MD"],
    [198, 190, 173, "3023-BrownGrey-LT"],
    [210, 208, 205, "3024-BrownGrey-VYLT"],
    [84, 56, 23,    "3031-MochaBrown-VYDK"],
    [188, 156, 120, "3032-MochaBrown-MD"],
    [239, 219, 190, "3033-MochaBrown-VYLT"],
    [190, 155, 167, "3041-AntiqueViolet-MD"],
    [225, 205, 200, "3042-AntiqueViolet-LT"],
    [216, 151, 105, "3045-YellowBeige-DK"],
    [229, 193, 139, "3046-YellowBeige-MD"],
    [255, 236, 211, "3047-YellowBeige-LT"],
    [85, 73, 0,     "3051-GreenGrey-DK"],
    [137, 141, 114, "3052-GreenGrey--MD"],
    [187, 179, 148, "3053-GreenGrey"],
    [194, 101, 76,  "3064-SportsmanFlsh-VYD"],
    [233, 233, 223, "3072-BeaverGrey-VYLT"],
    [255, 255, 220, "3078-GoldenYellow-VYLT"],
    [202, 226, 229, "3325-BabyBlue-LT"],
    [255, 157, 150, "3326-Rose-LT"],
    [188, 64, 85,   "3328-Salmon-DK"],
    [255, 123, 103, "3340-Apricot-MD"],
    [255, 172, 162, "3341-Apricot"],
    [97, 100, 82,   "3345-HunterGreen-DK"],
    [120, 134, 107, "3346-HunterGreen"],
    [128, 152, 115, "3347-YellowGreen-MD"],
    [225, 249, 190, "3348-YellowGreen-LT"],
    [201, 79, 91,   "3350-DustyRose-ULTDK"],
    [255, 214, 209, "3354-DustyRose-LT"],
    [96, 95, 84,    "3362-PineGreen-DK"],
    [116, 127, 96,  "3363-PineGreen-MD"],
    [161, 167, 135, "3364-PineGreen"],
    [83, 37, 16,    "3371-BlackBrown"],
    [231, 79, 134,  "3607-Plum-LT"],
    [247, 152, 182, "3608-Plum-VYLT"],
    [255, 214, 229, "3609-Plum-ULTLT"],
    [161, 53, 79,   "3685-Mauve-DK"],
    [203, 78, 97,   "3687-Mauve"],
    [250, 151, 144, "3688-Mauve-MD"],
    [255, 213, 216, "3689-Mauve-LT"],
    [255, 85, 91,   "3705-Melon-DK"],
    [255, 128, 109, "3706-Melon-MD"],
    [254, 212, 219, "3708-Melon-LT"],
    [230, 101, 107, "3712-Salmon-MD"],
    [253, 229, 217, "3713-Salmon-VYLT"],
    [255, 211, 212, "3716-DustyRose-VYLT"],
    [184, 75, 77,   "3721-ShellPink-DK"],
    [184, 89, 88,   "3722-ShellPink-MD"],
    [195, 118, 123, "3726-AntiqueMauve-DK"],
    [255, 199, 196, "3727-AntiqueMauve-LT"],
    [209, 93, 103,  "3731-DustyRose-VYDK"],
    [255, 154, 148, "3733-DustyRose"],
    [156, 125, 133, "3740-AntiqueViolet-DK"],
    [235, 235, 231, "3743-AntiqueViolet-VYL"],
    [149, 102, 162, "3746-BlueViolet-DK"],
    [230, 236, 232, "3747-BlueViolet-VYLT"],
    [12, 91, 108,   "3750-AntiqueBlue-VYDK"],
    [194, 209, 206, "3752-AntiqueBlue-VYLT"],
    [237, 247, 247, "3753-Ant.Blue-ULTVYLT"],
    [158, 176, 206, "3755-BabyBlue"],
    [248, 248, 252, "3756-BabyBlue-ULTVYLT"],
    [102, 142, 152, "3760-Wedgewood"],
    [227, 234, 230, "3761-SkyBlue-LT"],
    [24, 128, 134,  "3765-PeacockBlue-VYDK"],
    [24, 101, 111,  "3766-PeacockBlue-LT"],
    [92, 110, 108,  "3768-GreyGreen-DK"],
    [255, 250, 224, "3770-Flesh-VYLT"],
    [173, 83, 62,   "3772-NegroFlesh"],
    [231, 134, 103, "3773-SportsmanFlsh-MD"],
    [255, 220, 193, "3774-SportsmanFlsh-VYL"],
    [221, 109, 91,  "3776-Mahogony-LT"],
    [191, 64, 36,   "3777-TerraCotta-VYDK"],
    [237, 122, 100, "3778-TerraCotta-LT"],
    [255, 177, 152, "3779-Ter.Cotta-ULTVYL"],
    [113, 71, 42,   "3781-MochaBrown-DK"],
    [206, 175, 144, "3782-MochoBrown-LT"],
    [139, 109, 115, "3787-BrownGrey-DK"],
    [140, 117, 109, "3790-BeigeGrey-ULTDK"],
    [81, 76, 83,    "3799-PewterGrey-VYDK"]
  ]},
  'perler': {'dimensions': 0.181102362, colors: [
    // Perler bead colors
    [255, 255, 255, "P01-WHITE"],
    [240, 230, 195, "P02-CREAM"],
    [255, 235, 55,  "P03-YELLOW"],
    [255, 115, 80,  "P04-ORANGE"],
    [205, 70, 90,   "P05-RED"],
    [240, 130, 175, "P06-BUBBLE-GUM"],
    [120, 95, 155,  "P07-PURPLE"],
    [35, 80, 145,   "P08-DARK-BLUE"],
    [45, 130, 200,  "P09-LIGHT-BLUE"],
    [40, 140, 100,  "P10-DARK-GREEN"],
    [75, 195, 180,  "P11-LIGHT-GREEN"],
    [110, 90, 85,   "P12-BROWN"],
    [150, 155, 160, "P17-GREY"],
    [0, 0, 0,       "P18-BLACK"],
    [165, 90, 90,   "P20-RUST"],
    [160, 130, 95,  "P21-LIGHT-BROWN"],
    [250, 205, 195, "P33-PEACH"],
    [205, 165, 135, "P35-TAN"],
    [255, 60, 130,  "P38-MAGENTA"],
    [90, 160, 205,  "P52-PASTEL-BLUE"],
    [135, 210, 145, "P53-PASTEL-GREEN"],
    [155, 135, 205, "P54-PASTEL-LAVENDER"],
    [215, 155, 200, "P55-PASTEL-PINK"],
    [245, 240, 155, "P56-PASTEL-YELLOW"],
    [250, 200, 85,  "P57-CHEDDAR"],
    [160, 215, 225, "P58-TOOTHPASTE"],
    [255, 90, 115,  "P59-HOT-CORAL"],
    [175, 90, 160,  "P60-PLUM"],
    [125, 210, 80,  "P61-KIWI-LIME"],
    [5, 150, 205,   "P62-TURQUOISE"],
    [255, 150, 160, "P63-BLUSH"],
    [85, 125, 185,  "P70-PERIWINKLE"],
    [245, 200, 230, "P79-LIGHT-PINK"],
    [115, 185, 115, "P80-BRIGHT-GREEN"],
    [240, 95, 165,  "P83-PINK"],
    [190, 70, 115,  "P88-RASPBERRY"],
    [240, 150, 110, "P90-BUTTERSCOTCH"],
    [0, 150, 165,   "P91-PARROT-GREEN"],
    [95, 100, 100,  "P92-DARK-GREY"],

    // Hama bead colors
    [250, 240, 195, "H02-CREAM"],
    [255, 215, 90,  "H03-YELLOW"],
    [240, 105, 95,  "H04-ORANGE"],
    [245, 155, 175, "H06-PINK"],
    [35, 85, 160,   "H08-BLUE"],
    [120, 90, 145,  "H07-PURPLE"],
    [25, 105, 180,  "H09-LIGHT-BLUE"],
    [35, 125, 95,   "H10-GREEN"],
    [70, 195, 165,  "H11-LIGHT-GREEN"],
    [100, 75, 80,   "H12-BROWN"],
    [145, 150, 155, "H17-GREY"],
    [170, 85, 80,   "H20-BROWN"],
    [190, 130, 100, "H21-LIGHT-BROWN"],
    [175, 75, 85,   "H22-DARK-RED"],
    [240, 170, 165, "H26-FLESH"],
    [225, 185, 150, "H27-BEIGE"],
    [70, 85, 90,    "H28-DARK-GREEN"],
    [195, 80, 115,  "H29-RASPBERRY"],
    [115, 75, 85,   "H30-BURGUNDY"],
    [105, 160, 175, "H31-TURQUOISE"],
    [255, 95, 200,  "H32-FUCHSIA"],
    [245, 240, 125, "H43-PASTEL-YELLOW"],
    [255, 120, 140, "H44-PASTEL-CORAL"],
    [165, 140, 205, "H45-PASTEL-PURPLE"],
    [80, 170, 225,  "H46-PASTEL-BLUE"],
    [150, 230, 160, "H47-PASTEL-GREEN"],
    [230, 135, 200, "H48-PASTEL-PINK"],
    [240, 175, 95,  "H60-TEDDY-BEAR"],

    // Nabbi bead colors
    [90, 85, 80,    "N02-DARK-BROWN"],
    [105, 75, 80,   "N03-BROWN-MEDIUM"],
    [150, 85, 100,  "N04-WINE-RED"],
    [190, 125, 85,  "N05-BUTTERSCOTCH"],
    [185, 160, 145, "N06-BEIGE"],
    [240, 195, 150, "N07-SKIN"],
    [160, 160, 155, "N08-ASH-GREY"],
    [70, 100, 90,   "N09-DARK-GREEN"],
    [230, 225, 225, "N10-LIGHT-GREY"],
    [115, 90, 155,  "N11-PURPLE"],
    [245, 225, 215, "N12-IVORY"],
    [255, 210, 75,  "N14-YELLOW"],
    [50, 145, 100,  "N16-GREEN"],
    [0, 120, 210,   "N17-BLUE"],
    [245, 200, 190, "N18-LIGHT-PINK"],
    [215, 65, 85,   "N19-LIGHT-RED"],
    [210, 155, 125, "N20-LIGHT-BROWN"],
    [255, 245, 175, "N21-LIGHT-YELLOW"],
    [55, 170, 100,  "N22-PEARL-GREEN"],
    [90, 170, 235,  "N23-PASTEL-BLUE"],
    [200, 185, 240, "N24-LILAC"],
    [255, 120, 165, "N25-OLD-ROSE"],
    [255, 185, 150, "N26-LIGHT-ORANGE"],
    [145, 105, 100, "N27-BROWN"],
    [160, 205, 245, "N28-LIGHT-BLUE"],
    [225, 160, 85,  "N29-PEARL-ORANGE"],
    [200, 200, 120, "N30-OLIVE"]
  ]},
  'simple': {'dimensions': 0, 'colors': [
    [0, 0, 0,       "Black"],
    [255, 255, 255, "White"],
    [255, 0, 0,     "Red"],
    [0, 255, 0,     "Blue"],
    [0, 0, 255,     "Green"]
  ]}
};