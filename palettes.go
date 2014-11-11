package paletteize

import "image/color"

var palettes = map[string]struct {
	size   float64
	colors map[color.Color]string
}{
	"perler": {
		size:   0.181102362, // Inches width of a Perler bead
		colors: perlerMap,
	},
	"dmc": {
		size:   1.0 / 14, // 14-count
		colors: dmcMap,
	},
	"lego": {
		size:   0.307087, // Inches width of a LEGO brick
		colors: legoMap,
	},
}

// Map of available Perler bead colors to their name
// From https://sites.google.com/site/degenatrons/other-stuff/bead-pattern-generator
var perlerMap = map[color.Color]string{
	// Perler bead colors
	col(255, 255, 255): "P01-WHITE",
	col(240, 230, 195): "P02-CREAM",
	col(255, 235, 55):  "P03-YELLOW",
	col(255, 115, 80):  "P04-ORANGE",
	col(205, 70, 90):   "P05-RED",
	col(240, 130, 175): "P06-BUBBLE-GUM",
	col(120, 95, 155):  "P07-PURPLE",
	col(35, 80, 145):   "P08-DARK-BLUE",
	col(45, 130, 200):  "P09-LIGHT-BLUE",
	col(40, 140, 100):  "P10-DARK-GREEN",
	col(75, 195, 180):  "P11-LIGHT-GREEN",
	col(110, 90, 85):   "P12-BROWN",
	col(150, 155, 160): "P17-GREY",
	col(0, 0, 0):       "P18-BLACK",
	col(165, 90, 90):   "P20-RUST",
	col(160, 130, 95):  "P21-LIGHT-BROWN",
	col(250, 205, 195): "P33-PEACH",
	col(205, 165, 135): "P35-TAN",
	col(255, 60, 130):  "P38-MAGENTA",
	col(90, 160, 205):  "P52-PASTEL-BLUE",
	col(135, 210, 145): "P53-PASTEL-GREEN",
	col(155, 135, 205): "P54-PASTEL-LAVENDER",
	col(215, 155, 200): "P55-PASTEL-PINK",
	col(245, 240, 155): "P56-PASTEL-YELLOW",
	col(250, 200, 85):  "P57-CHEDDAR",
	col(160, 215, 225): "P58-TOOTHPASTE",
	col(255, 90, 115):  "P59-HOT-CORAL",
	col(175, 90, 160):  "P60-PLUM",
	col(125, 210, 80):  "P61-KIWI-LIME",
	col(5, 150, 205):   "P62-TURQUOISE",
	col(255, 150, 160): "P63-BLUSH",
	col(85, 125, 185):  "P70-PERIWINKLE",
	col(245, 200, 230): "P79-LIGHT-PINK",
	col(115, 185, 115): "P80-BRIGHT-GREEN",
	col(240, 95, 165):  "P83-PINK",
	col(190, 70, 115):  "P88-RASPBERRY",
	col(240, 150, 110): "P90-BUTTERSCOTCH",
	col(0, 150, 165):   "P91-PARROT-GREEN",
	col(95, 100, 100):  "P92-DARK-GREY",

	// Hama bead colors
	col(250, 240, 195): "H02-CREAM",
	col(255, 215, 90):  "H03-YELLOW",
	col(240, 105, 95):  "H04-ORANGE",
	col(245, 155, 175): "H06-PINK",
	col(35, 85, 160):   "H08-BLUE",
	col(120, 90, 145):  "H07-PURPLE",
	col(25, 105, 180):  "H09-LIGHT-BLUE",
	col(35, 125, 95):   "H10-GREEN",
	col(70, 195, 165):  "H11-LIGHT-GREEN",
	col(100, 75, 80):   "H12-BROWN",
	col(145, 150, 155): "H17-GREY",
	col(170, 85, 80):   "H20-BROWN",
	col(190, 130, 100): "H21-LIGHT-BROWN",
	col(175, 75, 85):   "H22-DARK-RED",
	col(240, 170, 165): "H26-FLESH",
	col(225, 185, 150): "H27-BEIGE",
	col(70, 85, 90):    "H28-DARK-GREEN",
	col(195, 80, 115):  "H29-RASPBERRY",
	col(115, 75, 85):   "H30-BURGUNDY",
	col(105, 160, 175): "H31-TURQUOISE",
	col(255, 95, 200):  "H32-FUCHSIA",
	col(245, 240, 125): "H43-PASTEL-YELLOW",
	col(255, 120, 140): "H44-PASTEL-CORAL",
	col(165, 140, 205): "H45-PASTEL-PURPLE",
	col(80, 170, 225):  "H46-PASTEL-BLUE",
	col(150, 230, 160): "H47-PASTEL-GREEN",
	col(230, 135, 200): "H48-PASTEL-PINK",
	col(240, 175, 95):  "H60-TEDDY-BEAR",

	// Nabbi bead colors
	col(90, 85, 80):    "N02-DARK-BROWN",
	col(105, 75, 80):   "N03-BROWN-MEDIUM",
	col(150, 85, 100):  "N04-WINE-RED",
	col(190, 125, 85):  "N05-BUTTERSCOTCH",
	col(185, 160, 145): "N06-BEIGE",
	col(240, 195, 150): "N07-SKIN",
	col(160, 160, 155): "N08-ASH-GREY",
	col(70, 100, 90):   "N09-DARK-GREEN",
	col(230, 225, 225): "N10-LIGHT-GREY",
	col(115, 90, 155):  "N11-PURPLE",
	col(245, 225, 215): "N12-IVORY",
	col(255, 210, 75):  "N14-YELLOW",
	col(50, 145, 100):  "N16-GREEN",
	col(0, 120, 210):   "N17-BLUE",
	col(245, 200, 190): "N18-LIGHT-PINK",
	col(215, 65, 85):   "N19-LIGHT-RED",
	col(210, 155, 125): "N20-LIGHT-BROWN",
	col(255, 245, 175): "N21-LIGHT-YELLOW",
	col(55, 170, 100):  "N22-PEARL-GREEN",
	col(90, 170, 235):  "N23-PASTEL-BLUE",
	col(200, 185, 240): "N24-LILAC",
	col(255, 120, 165): "N25-OLD-ROSE",
	col(255, 185, 150): "N26-LIGHT-ORANGE",
	col(145, 105, 100): "N27-BROWN",
	col(160, 205, 245): "N28-LIGHT-BLUE",
	col(225, 160, 85):  "N29-PEARL-ORANGE",
	col(200, 200, 120): "N30-OLIVE",
}

// Map of available DMC thread colors to their name
// From http://www.csh.rit.edu/~vance/pages/color.html
var dmcMap = map[color.Color]string{
	col(255, 255, 255): "000-blancWhite",
	col(148, 91, 128):  "208-Lavender-VYDK",
	col(206, 148, 186): "209-Lavender-DK",
	col(236, 207, 225): "210-Lavender-MD",
	col(243, 218, 228): "211-Lavender-LT",
	col(156, 41, 74):   "221-ShellPink-VYDK",
	col(219, 128, 115): "223-ShellPink-LT",
	col(255, 199, 176): "224-ShellPink-VYLT",
	col(255, 240, 228): "225-ShellPink-ULTVYL",
	col(143, 57, 38):   "300-Mahogany-VYDK",
	col(209, 102, 84):  "301-Mahogany-MD",
	col(188, 0, 97):    "304-ChristmasRed-MD",
	col(255, 231, 109): "307-Lemon",
	col(214, 43, 91):   "309-Rose-DP",
	col(0, 0, 0):       "310-Black",
	col(0, 79, 97):     "311-NavyBlue-MD",
	col(58, 84, 103):   "312-NavyBlue-LT",
	col(163, 90, 91):   "315-AntiqueMauve-VYDK",
	col(220, 141, 141): "316-AntiqueMauve-MD",
	col(167, 139, 136): "317-PewterGrey",
	col(197, 198, 190): "318-SteelGrey-LT",
	col(85, 95, 82):    "319-PistachioGrn-VYDK",
	col(138, 153, 120): "320-PistachioGreen-MD",
	col(231, 18, 97):   "321-ChristmasRed",
	col(81, 109, 135):  "322-NavyBlue-VYLT",
	col(188, 22, 65):   "326-Rose-VYDP",
	col(61, 0, 103):    "327-Violet-DK",
	col(127, 84, 130):  "333-BlueViolet-VYDK",
	col(115, 140, 170): "334-BabyBlue-MD",
	col(219, 36, 79):   "335-Rose",
	col(36, 73, 103):   "336-NavyBlue",
	col(162, 121, 164): "340-BlueViolet-MD",
	col(145, 180, 197): "341-BlueViolet-LT",
	col(194, 36, 67):   "347-Salmon-VYDK",
	col(220, 61, 91):   "349-Coral-DK",
	col(237, 69, 90):   "350-Coral-MD",
	col(255, 128, 135): "351-Coral",
	col(255, 157, 144): "352-Coral-LT",
	col(255, 196, 184): "353-PeachFlesh",
	col(189, 73, 47):   "355-TerraCotta-DK",
	col(226, 114, 91):  "356-TerraCotta-MD",
	col(95, 112, 91):   "367-PistachioGreen-DK",
	col(181, 206, 162): "368-PistachioGreen-LT",
	col(243, 250, 209): "369-PistachioGrn-VYLT",
	col(184, 138, 87):  "370-Mustard-MD",
	col(196, 155, 100): "371-Mustard",
	col(203, 162, 107): "372-Mustard-LT",
	col(157, 60, 39):   "400-Mahogany-DK",
	col(255, 190, 164): "402-Mahogany-VYLT",
	col(194, 101, 76):  "407-SportsmanFlsh-VYD",
	col(109, 95, 95):   "413-PewterGrey-DK",
	col(167, 139, 136): "414-SteelGrey-DK",
	col(221, 221, 218): "415-PearlGrey",
	col(140, 91, 43):   "420-HazelNutBrown-DK",
	col(237, 172, 123): "422-HazelNutBrown-LT",
	col(151, 84, 20):   "433-Brown-MD",
	col(178, 103, 70):  "434-Brown-LT",
	col(187, 107, 57):  "435-Brown-VYLT",
	col(231, 152, 115): "436-Tan",
	col(238, 171, 121): "437-Tan-LT",
	col(255, 176, 0):   "444-Lemon-DK",
	col(255, 255, 190): "445-Lemon-LT",
	col(179, 151, 143): "451-ShellGrey-DK",
	col(210, 185, 175): "452-ShellGrey-MD",
	col(235, 207, 185): "453-ShellGrey-LT",
	col(116, 114, 92):  "469-AvocadoGreen",
	col(133, 143, 108): "470-AvocadoGreen-LT",
	col(176, 187, 140): "471-AvocadoGreen-VYLT",
	col(238, 255, 182): "472-AvocadoGreen-ULTL",
	col(187, 0, 97):    "498-ChristmasRed-LT",
	col(43, 57, 41):    "500-BlueGreen-VYDK",
	col(67, 85, 73):    "501-BlueGreen-DK",
	col(134, 158, 134): "502-BlueGreen",
	col(195, 206, 183): "503-BlueGreen-MD",
	col(206, 221, 193): "504-BlueGreen-LT",
	col(16, 127, 135):  "517-Wedgewood-MD",
	col(102, 148, 154): "518-Wedgewood-LT",
	col(194, 209, 207): "519-SkyBlue",
	col(55, 73, 18):    "520-FernGreen-DK",
	col(159, 169, 142): "522-FernGreen",
	col(172, 183, 142): "523-FernGreen-LT",
	col(205, 182, 158): "524-FernGreen-VYLT",
	col(85, 85, 89):    "535-AshGrey-VYLT",
	col(239, 214, 188): "543-BeigeBrown-ULVYL",
	col(109, 18, 97):   "550-Violet-VYLT",
	col(146, 85, 130):  "552-Violet-MD",
	col(160, 100, 146): "553-Violet",
	col(243, 206, 225): "554-Violet-LT",
	col(59, 96, 76):    "561-Jade-VYDK",
	col(97, 134, 97):   "562-Jade-MD",
	col(182, 212, 180): "563-Jade-LT",
	col(214, 230, 204): "564-Jade-VYLT",
	col(0, 103, 0):     "580-MossGreen-DK",
	col(151, 152, 49):  "581-MossGreen",
	col(128, 151, 132): "597-Turquoise",
	col(208, 223, 205): "598-Turquoise-LT",
	col(208, 57, 106):  "600-Cranberry-VYDK",
	col(222, 57, 105):  "601-Cranberry-DK",
	col(231, 84, 122):  "602-Cranberry-MD",
	col(255, 115, 140): "603-Cranberry",
	col(255, 189, 202): "604-Cranberry-LT",
	col(255, 207, 214): "605-Cranberry-VYLT",
	col(255, 0, 0):     "606-BrightOrange-Red",
	col(255, 91, 0):    "608-BrightOrange",
	col(151, 104, 84):  "610-DrabBrown-VYDK",
	col(158, 109, 91):  "611-DrabBrown-DK",
	col(203, 152, 103): "612-DrabBrown-MD",
	col(219, 176, 122): "613-DrabBrown-LT",
	col(162, 77, 52):   "632-NegroFlesh-MD",
	col(163, 163, 157): "640-BeigeGrey-VYDK",
	col(174, 176, 170): "642-BeigeGrey-DK",
	col(224, 224, 215): "644-BeigeGrey-MD",
	col(113, 113, 113): "645-BeaverGrey-VYDK",
	col(121, 121, 121): "646-BeaverGrey-DK",
	col(190, 190, 185): "647-BeaverGrey-MD",
	col(202, 202, 202): "648-BeaverGrey-LT",
	col(213, 39, 86):   "666-ChristmasRed-LT",
	col(255, 206, 158): "676-OldGold-LT",
	col(255, 231, 182): "677-OldGold-VYLT",
	col(209, 140, 103): "680-OldGold-DK",
	col(0, 91, 6):      "699-ChirstmasGreen",
	col(0, 96, 47):     "700-ChristmasGreen-BRT",
	col(79, 108, 69):   "701-ChristmasGreen-LT",
	col(79, 121, 66):   "702-KellyGreen",
	col(121, 144, 76):  "703-Chartreuse",
	col(165, 164, 103): "704-Chartreuse-BRT",
	col(245, 240, 219): "712-Cream",
	col(219, 55, 121):  "718-Plum",
	col(200, 36, 43):   "720-OrangeSpice-DK",
	col(255, 115, 97):  "721-OrangeSpice-MD",
	col(255, 146, 109): "722-OrangeSpice-LT",
	col(255, 200, 124): "725-Topaz",
	col(255, 224, 128): "726-Topaz-LT",
	col(255, 235, 168): "727-Topaz-VYLT",
	col(243, 176, 128): "729-OldGold-MD",
	col(132, 102, 0):   "730-OliveGreen-VYDK",
	col(140, 103, 0):   "731-OliveGreen-DK",
	col(145, 104, 0):   "732-OliveGreen",
	col(206, 155, 97):  "733-OliveGreen-MD",
	col(221, 166, 107): "734-OliveGreen-LT",
	col(244, 195, 139): "738-Tan-VYLT",
	col(244, 233, 202): "739-Tan-ULTVYLT",
	col(255, 131, 19):  "740-Tangerine",
	col(255, 142, 4):   "741-Tangerine-MD",
	col(255, 183, 85):  "742-Tangerine-LT",
	col(255, 230, 146): "743-Yellow-MD",
	col(255, 239, 170): "744-Yellow-PALE",
	col(255, 240, 197): "745-Yellow-LTPALE",
	col(246, 234, 219): "746-OffWhite",
	col(240, 247, 239): "747-SkyBlue-VYLT",
	col(251, 227, 209): "754-PeachFlesh-LT",
	col(255, 177, 147): "758-TerraCotta-VYLT",
	col(249, 160, 146): "760-Salmon",
	col(255, 201, 188): "761-Salmon-LT",
	col(232, 232, 229): "762-PearlGrey-VYLT",
	col(231, 249, 203): "772-PineGreen--LT",
	col(247, 246, 248): "775-BabyBlue-VYLT",
	col(255, 177, 174): "776-Pink-MD",
	col(255, 199, 184): "778-AntiqueMauve-VYLT",
	col(181, 98, 46):   "780-Topaz-ULTVYDK",
	col(181, 107, 56):  "781-Topaz-VYDK",
	col(204, 119, 66):  "782-Topaz-DK",
	col(225, 146, 85):  "783-Topaz-MD",
	col(71, 55, 93):    "791-CornflowerBlue-VYD",
	col(97, 97, 128):   "792-CornflowerBlue-DK",
	col(147, 139, 164): "793-CornflowerBlue-MD",
	col(187, 208, 218): "794-CornflowerBlue-LT",
	col(30, 58, 95):    "796-RoyalBlue-DK",
	col(30, 66, 99):    "797-RoyalBlue",
	col(103, 115, 141): "798-Delft-DK",
	col(132, 156, 182): "799-Delft-MD",
	col(233, 238, 233): "800-Delft-PALE",
	col(123, 71, 20):   "801-CoffeeBrown-DK",
	col(30, 130, 133):  "806-PeacockBlue-DK",
	col(128, 167, 160): "807-PeacockBlue",
	col(190, 193, 205): "809-Delft",
	col(175, 195, 205): "813-Blue-LT",
	col(162, 0, 88):    "814-Garnet-DK",
	col(166, 0, 91):    "815-Garnet-MD",
	col(179, 0, 91):    "816-Garnet",
	col(219, 24, 85):   "817-CoralRed-VYDK",
	col(255, 234, 235): "818-BabyPink",
	col(248, 247, 221): "819-BabyPink-LT",
	col(30, 54, 85):    "820-RoyalBlue-VYDK",
	col(242, 234, 219): "822-BeigeGrey-LT",
	col(0, 0, 73):      "823-NavyBlue-DK",
	col(71, 97, 116):   "824-Blue-VYDK",
	col(85, 108, 128):  "825-Blue-DK",
	col(115, 138, 153): "826-Blue-MD",
	col(213, 231, 232): "827-Blue-VYLT",
	col(237, 247, 238): "828-Blue-ULTVYLT",
	col(130, 90, 8):    "829-GoldenOlive-VYDK",
	col(136, 95, 18):   "830-GoldenOlive-DK",
	col(144, 103, 18):  "831-GoldenOlive-MD",
	col(178, 119, 55):  "832-GoldenOlive",
	col(219, 182, 128): "833-GoldenOlive-LT",
	col(242, 209, 142): "834-GoldenOlive-VYLT",
	col(94, 56, 27):    "838-BeigeBrown-VYDK",
	col(109, 66, 39):   "839-BeigeBrown-DK",
	col(128, 85, 30):   "840-BeigeBrown-MD",
	col(188, 134, 107): "841-BeigeBrown-LT",
	col(219, 194, 164): "842-BeigeBrown-VYLT",
	col(107, 103, 102): "844-BeaverBrown-ULTD",
	col(153, 92, 48):   "868-HazelNutBrown-VYD",
	col(153, 92, 48):   "869-HazelNutBrn-VYDK",
	col(79, 86, 76):    "890-PistachioGrn-ULTD",
	col(241, 49, 84):   "891-Carnation-DK",
	col(249, 90, 97):   "892-Carnation-MD",
	col(243, 149, 157): "893-Carnation-LT",
	col(255, 194, 191): "894-Carnation-VYLT",
	col(89, 92, 78):    "895-HunterGreen-VYDK",
	col(118, 55, 19):   "898-CoffeeBrown-VYDK",
	col(233, 109, 115): "899-Rose-MD",
	col(206, 43, 0):    "900-BurntOrange-DK",
	col(138, 24, 77):   "902-Granet-VYDK",
	col(78, 95, 57):    "904-ParrotGreen-VYDK",
	col(98, 119, 57):   "905-ParrotGreen-DK",
	col(143, 163, 89):  "906-ParrotGreen-MD",
	col(185, 200, 102): "907-ParrotGreen-LT",
	col(49, 105, 85):   "909-EmeraldGreen-VYDK",
	col(48, 116, 91):   "910-EmeraldGreen-DK",
	col(49, 128, 97):   "911-EmeraldGreen-MD",
	col(115, 158, 115): "912-EmeraldGreen-LT",
	col(153, 188, 149): "913-NileGreen-MD",
	col(170, 24, 91):   "915-Plum-DK",
	col(171, 22, 95):   "917-Plum-MD",
	col(168, 68, 76):   "918-RedCopper-DK",
	col(180, 75, 82):   "919-RedCopper",
	col(197, 94, 88):   "920-Copper-MD",
	col(206, 103, 91):  "921-Copper",
	col(237, 134, 115): "922-Copper-LT",
	col(86, 99, 100):   "924-GreyGreen--VYDK",
	col(96, 116, 115):  "926-GreyGreen-LT",
	col(200, 198, 194): "927-GreyGreen-LT",
	col(225, 224, 216): "928-GreyGreen--VYLT",
	col(102, 122, 140): "930-AntiqueBlue-DK",
	col(124, 135, 145): "931-AntiqueBlue-MD",
	col(182, 186, 194): "932-AntiqueBlue-LT",
	col(62, 59, 40):    "934-BlackAvocadoGreen",
	col(67, 63, 47):    "935-AvocadoGreen-DK",
	col(69, 69, 49):    "936-AvocadoGreen--VYD",
	col(73, 86, 55):    "937-AvocadoGreen-MD",
	col(99, 39, 16):    "938-CoffeeBrown-ULTDK",
	col(0, 0, 49):      "939-NavyBlue-VyDK",
	col(0, 162, 117):   "943-Aquamarine-MD",
	col(255, 206, 164): "945-Flesh-MD",
	col(244, 73, 0):    "946-BurntOrange-MD",
	col(255, 91, 0):    "947-BurntOrange",
	col(255, 243, 231): "948-PeachFlesh-VYLT",
	col(239, 162, 127): "950-SportsmanFlesh",
	col(255, 229, 188): "951-Flesh",
	col(170, 213, 164): "954-NileGreen",
	col(214, 230, 204): "955-NileGreen-LT",
	col(255, 109, 115): "956-Geranium",
	col(255, 204, 208): "957-Gernanium-PALE",
	col(0, 160, 130):   "958-SeaGreen-DK",
	col(171, 206, 177): "959-SeaGreen-MD",
	col(243, 108, 123): "961-DustyRose-DK",
	col(253, 134, 141): "962-DustyRose-MD",
	col(208, 224, 210): "964-SeaGreen-LT",
	col(206, 213, 176): "966-BabyGreen-MD",
	col(255, 117, 24):  "970-Pumpkin-LT",
	col(255, 106, 0):   "971-Pumpkin",
	col(255, 146, 0):   "972-Canary-DP",
	col(255, 194, 67):  "973-Canary-BRT",
	col(158, 67, 18):   "975-GoldenBrown-DK",
	col(246, 141, 57):  "976-GoldenBrown-MD",
	col(255, 164, 73):  "977-GoldenBrown-LT",
	col(58, 82, 65):    "986-ForestGreen-VYDK",
	col(83, 97, 73):    "987-ForestGreen-DK",
	col(134, 145, 110): "988-ForestGreen-MD",
	col(134, 153, 110): "989-ForestGreen",
	col(47, 91, 73):    "991-Aquamarine-DK",
	col(146, 183, 165): "992-Aquamarine",
	col(192, 224, 200): "993-Aquamarine-LT",
	col(0, 123, 134):   "995-ElectricBlue-DK",
	col(170, 222, 225): "996-ElectricBlue-MD",
	col(123, 91, 64):   "3011-KhakiGreen-DK",
	col(170, 134, 103): "3012-KhakiGreen-MD",
	col(208, 195, 164): "3013-KhakiGreen-LT",
	col(115, 91, 93):   "3021-BrownGrey-VYDK",
	col(172, 172, 170): "3022-BrownGrey-MD",
	col(198, 190, 173): "3023-BrownGrey-LT",
	col(210, 208, 205): "3024-BrownGrey-VYLT",
	col(84, 56, 23):    "3031-MochaBrown-VYDK",
	col(188, 156, 120): "3032-MochaBrown-MD",
	col(239, 219, 190): "3033-MochaBrown-VYLT",
	col(190, 155, 167): "3041-AntiqueViolet-MD",
	col(225, 205, 200): "3042-AntiqueViolet-LT",
	col(216, 151, 105): "3045-YellowBeige-DK",
	col(229, 193, 139): "3046-YellowBeige-MD",
	col(255, 236, 211): "3047-YellowBeige-LT",
	col(85, 73, 0):     "3051-GreenGrey-DK",
	col(137, 141, 114): "3052-GreenGrey--MD",
	col(187, 179, 148): "3053-GreenGrey",
	col(194, 101, 76):  "3064-SportsmanFlsh-VYD",
	col(233, 233, 223): "3072-BeaverGrey-VYLT",
	col(255, 255, 220): "3078-GoldenYellow-VYLT",
	col(202, 226, 229): "3325-BabyBlue-LT",
	col(255, 157, 150): "3326-Rose-LT",
	col(188, 64, 85):   "3328-Salmon-DK",
	col(255, 123, 103): "3340-Apricot-MD",
	col(255, 172, 162): "3341-Apricot",
	col(97, 100, 82):   "3345-HunterGreen-DK",
	col(120, 134, 107): "3346-HunterGreen",
	col(128, 152, 115): "3347-YellowGreen-MD",
	col(225, 249, 190): "3348-YellowGreen-LT",
	col(201, 79, 91):   "3350-DustyRose-ULTDK",
	col(255, 214, 209): "3354-DustyRose-LT",
	col(96, 95, 84):    "3362-PineGreen-DK",
	col(116, 127, 96):  "3363-PineGreen-MD",
	col(161, 167, 135): "3364-PineGreen",
	col(83, 37, 16):    "3371-BlackBrown",
	col(231, 79, 134):  "3607-Plum-LT",
	col(247, 152, 182): "3608-Plum-VYLT",
	col(255, 214, 229): "3609-Plum-ULTLT",
	col(161, 53, 79):   "3685-Mauve-DK",
	col(203, 78, 97):   "3687-Mauve",
	col(250, 151, 144): "3688-Mauve-MD",
	col(255, 213, 216): "3689-Mauve-LT",
	col(255, 85, 91):   "3705-Melon-DK",
	col(255, 128, 109): "3706-Melon-MD",
	col(254, 212, 219): "3708-Melon-LT",
	col(230, 101, 107): "3712-Salmon-MD",
	col(253, 229, 217): "3713-Salmon-VYLT",
	col(255, 211, 212): "3716-DustyRose-VYLT",
	col(184, 75, 77):   "3721-ShellPink-DK",
	col(184, 89, 88):   "3722-ShellPink-MD",
	col(195, 118, 123): "3726-AntiqueMauve-DK",
	col(255, 199, 196): "3727-AntiqueMauve-LT",
	col(209, 93, 103):  "3731-DustyRose-VYDK",
	col(255, 154, 148): "3733-DustyRose",
	col(156, 125, 133): "3740-AntiqueViolet-DK",
	col(235, 235, 231): "3743-AntiqueViolet-VYL",
	col(149, 102, 162): "3746-BlueViolet-DK",
	col(230, 236, 232): "3747-BlueViolet-VYLT",
	col(12, 91, 108):   "3750-AntiqueBlue-VYDK",
	col(194, 209, 206): "3752-AntiqueBlue-VYLT",
	col(237, 247, 247): "3753-Ant.Blue-ULTVYLT",
	col(158, 176, 206): "3755-BabyBlue",
	col(248, 248, 252): "3756-BabyBlue-ULTVYLT",
	col(102, 142, 152): "3760-Wedgewood",
	col(227, 234, 230): "3761-SkyBlue-LT",
	col(24, 128, 134):  "3765-PeacockBlue-VYDK",
	col(24, 101, 111):  "3766-PeacockBlue-LT",
	col(92, 110, 108):  "3768-GreyGreen-DK",
	col(255, 250, 224): "3770-Flesh-VYLT",
	col(173, 83, 62):   "3772-NegroFlesh",
	col(231, 134, 103): "3773-SportsmanFlsh-MD",
	col(255, 220, 193): "3774-SportsmanFlsh-VYL",
	col(221, 109, 91):  "3776-Mahogony-LT",
	col(191, 64, 36):   "3777-TerraCotta-VYDK",
	col(237, 122, 100): "3778-TerraCotta-LT",
	col(255, 177, 152): "3779-Ter.Cotta-ULTVYL",
	col(113, 71, 42):   "3781-MochaBrown-DK",
	col(206, 175, 144): "3782-MochoBrown-LT",
	col(139, 109, 115): "3787-BrownGrey-DK",
	col(140, 117, 109): "3790-BeigeGrey-ULTDK",
	col(81, 76, 83):    "3799-PewterGrey-VYDK",
}

var legoMap = map[color.Color]string{
	col(242, 243, 242): "White",
	col(161, 165, 162): "Grey",
	col(249, 233, 153): "Light yellow",
	col(215, 197, 153): "Brick yellow",
	col(194, 218, 184): "Light green",
	col(232, 186, 199): "Light reddish violet",
	col(203, 132, 66):  "Light orange brown",
	col(204, 142, 104): "Nougat",
	col(196, 40, 27):   "Bright red",
	col(196, 112, 160): "Med. reddish violet",
	col(13, 105, 171):  "Bright blue",
	col(245, 205, 47):  "Bright yellow",
	col(98, 71, 50):    "Earth orange",
	col(27, 42, 52):    "Black",
	col(109, 110, 108): "Dark grey",
	col(40, 127, 70):   "Dark green",
	col(161, 196, 139): "Medium green",
	col(243, 207, 155): "Lig. Yellowich orange",
	col(75, 151, 74):   "Bright green",
	col(160, 95, 52):   "Dark orange",
	col(193, 202, 222): "Light bluish violet",
	col(180, 210, 227): "Light blue",
	col(238, 196, 182): "Light red",
	col(218, 134, 121): "Medium red",
	col(110, 153, 201): "Medium blue",
	col(199, 193, 183): "Light grey",
	col(107, 50, 123):  "Bright violet",
	col(226, 155, 63):  "Br. yellowish orange",
	col(218, 133, 64):  "Bright orange",
	col(0, 143, 155):   "Bright bluish green",
	col(104, 92, 67):   "Earth yellow",
	col(67, 84, 147):   "Bright bluish violet",
	col(104, 116, 172): "Medium bluish violet",
	col(199, 210, 60):  "Med. yellowish green",
	col(85, 165, 175):  "Med. bluish green",
	col(183, 215, 213): "Light bluish green",
	col(164, 189, 70):  "Br. yellowish green",
	col(217, 228, 167): "Lig. yellowish green",
	col(231, 172, 88):  "Med. yellowish orange",
	col(211, 111, 76):  "Br. reddish orange",
	col(146, 57, 120):  "Bright reddish violet",
	col(234, 184, 145): "Light orange",
	col(220, 188, 129): "Gold",
	col(174, 122, 89):  "Dark nougat",
	col(156, 163, 168): "Silver",
	col(116, 134, 156): "Sand blue",
	col(135, 124, 144): "Sand violet",
	col(224, 152, 100): "Medium orange",
	col(149, 138, 115): "Sand yellow",
	col(32, 58, 86):    "Earth blue",
	col(39, 70, 44):    "Earth green",
	col(121, 136, 161): "Sand blue metallic",
	col(149, 142, 163): "Sand violet metallic",
	col(147, 135, 103): "Sand yellow metallic",
	col(87, 88, 87):    "Dark grey metallic",
	col(22, 29, 50):    "Black metallic",
	col(171, 173, 172): "Light grey metallic",
	col(120, 144, 129): "Sand green",
	col(149, 121, 118): "Sand red",
	col(123, 46, 47):   "Dark red",
	col(117, 108, 98):  "Gun metallic",
	col(215, 169, 75):  "Curry",
	col(130, 138, 93):  "Lemon metalic",
	col(249, 214, 46):  "Fire Yellow",
	col(232, 171, 45):  "Flame yellowish orange",
	col(105, 64, 39):   "Reddish brown",
	col(207, 96, 36):   "Flame reddish orange",
	col(163, 162, 164): "Medium stone grey",
	col(70, 103, 164):  "Royal blue",
	col(35, 71, 139):   "Dark Royal blue",
	col(142, 66, 133):  "Bright reddish lilac",
	col(99, 95, 97):    "Dark stone grey",
	col(229, 228, 222): "Light stone grey",
	col(176, 142, 68):  "Dark Curry",
	col(112, 149, 120): "Faded green",
	col(121, 181, 181): "Turquoise",
	col(159, 195, 233): "Light Royal blue",
	col(108, 129, 183): "Medium Royal blue",
	col(143, 76, 42):   "Rust",
	col(124, 92, 69):   "Brown",
	col(150, 112, 159): "Reddish lilac",
	col(107, 98, 155):  "Lilac",
	col(167, 169, 206): "Light lilac",
	col(205, 98, 152):  "Bright purple",
	col(228, 173, 200): "Light purple",
	col(220, 144, 149): "Light pink",
	col(240, 213, 160): "Light brick yellow",
	col(235, 184, 127): "Warm yellowish orange",
	col(253, 234, 140): "Cool yellow",
	col(125, 187, 221): "Dove blue",
	col(52, 43, 117):   "Medium lilac",
	col(205, 84, 75):   "Tr. Red",
	col(193, 223, 240): "Tr. Lg blue",
	col(123, 182, 232): "Tr. Blue",
	col(247, 241, 141): "Tr. Yellow",
	col(217, 133, 108): "Tr. Flu. Reddish orange",
	col(132, 182, 141): "Tr. Green",
	col(248, 241, 132): "Tr. Flu. Green",
	col(236, 232, 222): "Phosph. White",
	col(191, 183, 177): "Tr. Brown",
	col(228, 173, 200): "Tr. Medi. reddish violet",
	col(165, 165, 203): "Tr. Bright bluish violet",
	col(213, 115, 61):  "Neon orange",
	col(216, 221, 86):  "Neon green",
	col(207, 226, 247): "Tr. Flu. Blue",
	col(255, 246, 123): "Tr. Flu. Yellow",
	col(225, 164, 194): "Tr. Flu. Red",
	col(151, 105, 91):  "Red flip/flop",
	col(180, 132, 85):  "Yellow flip/flop",
	col(137, 135, 136): "Silver flip/flop",
}