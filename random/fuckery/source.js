// ── Discord-style "Wait!" self-XSS warning ──────────────────
(function discordWarning() {
	console.log(
		"%cWait!",
		"font-size: 72px; font-weight: bold; color: #5865f2; text-shadow: 2px 2px 0 #990000; font-family: 'Helvetica Neue', sans-serif;"
	);
	console.log(
		"%cIf someone told you to copy/paste something here, there's an 11/10 chance you're being scammed.",
		"font-size: 16px; color: #ddd; font-family: 'Courier New', monospace; padding: 4px 0;"
	);
	console.log(
		"%cPasting anything in here could give attackers access to money!!",
		"font-size: 16px; color: #ff6666; font-family: 'Courier New', monospace; padding: 4px 0;"
	);
	console.log("\n");
})();

// ── Welcome banner ──────────────────────────────────────────
(function welcome() {
	var n = "%c╔══════════════╗\n" +
		"║   hi guys    ║\n" +
		"╚══════════════╝\n";
	var i = "%cThere's some hidden js functions here you might wanan find!.\n";
	var a = "%cthanks for visiting this site :3\n";

	console.log(
		n + i + a,
		"font-family: 'Courier New', monospace; color: #f68000; font-weight: bold; font-size: 13px;",
		"font-family: sans-serif; color: #ccc; font-size: 12px;",
		"font-family: sans-serif; color: #777; font-size: 11px;"
	);
})();

// ── ASCII art ──────────────────────────────────────────────
var icon =
	'                                                            o                               \n' +
	'                                                           o%                                \n' +
	'                                                        _ //                                 \n' +
	'                                                      -=^~\\                                  \n' +
	'                                                        ~\\\\\\                                 \n' +
	'                                                          \\\\\\                                \n' +
	'                                                           \\\\\\                               \n' +
	'                                                            );\\                              \n' +
	'                                                           /|;;\\                             \n' +
	'                                                      """;;;;;;;\\                            \n' +
	'                                                ///"""""""";;;;;;\\                           \n' +
	'                                    ___////+++++""""""""""""";;;@@\\                          \n' +
	'                      __________///////++++++++++++++""""""""@@@@%)                          \n' +
	'           ....__/0)///0)//0)//0)/++////////++++++++++"""@@@%%%%%%%%%/                           \n' +
	'     ..---0)/--------////////////////+++++++/////+++++@@%%%%%%%%%%%%%/                             \n' +
	'      ..///---0)---0)///0)//0)///0)/////////+++++====@%%%%%%%%%%%/                                \n' +
	'   ...0)....//----///------////////////+++++///"     \\/\\\\//                                  \n' +
	'      //../0)--0)///0)///0)///0)//++++/////          /  \\/                                   \n' +
	'      --///--------///////////+++/////             _/   /                                    \n' +
	'.-//..0).-/0)--0)--0)--0)--..                      /\\  /                                     \n' +
	'       .......--/////////.                            /\\_                                    \n' +
	'            .0)..0)..                                                                       ';

try {
	console.log(
		"%c" + icon,
		"background-color: #000; color: lime; font-family: 'Courier New', monospace; padding: 3px; font-size: 8px; line-height: 1;"
	);
	console.log("\n");
	console.log(
		"%c> Try: explain()",
		"background: #111; color: lime; padding: 8px 20px; font-family: 'Courier New', monospace; font-size: 24px; border-radius: 4px;"
	);
} catch (e) {
	console.log("Something broke. Reload the page, genius.");
}

// ── Achievement tracker ─────────────────────────────────────
var _found = {};
var _allFunctions = [
	"explain", "source", "rainbow", "funnynumber", "amogus",
	"morbius", "snek", "hacker", "matrix", "rave",
	"wisdom", "crash", "rickroll", "copypasta", "sussy"
];
function _track(name) {
	if (_found[name]) return;
	_found[name] = true;
	var count = Object.keys(_found).length;
	var total = _allFunctions.length;
	console.log(
		"%c[" + count + "/" + total + "] ✓ " + name + "() discovered",
		"color: #555; font-size: 10px; font-family: 'Courier New';"
	);
	if (count === total) {
		setTimeout(iFoundEverything, 500);
	}
}

// ============================================================
//  PUBLIC CONSOLE FUNCTIONS
// ============================================================

function explain() {
	_track("explain");
	try {
		console.log(
			"%c-- What is this? --",
			"color: cyan; font-weight: bold; font-size: 16px; font-family: 'Courier New';"
		);
		console.log(
			"%cThis is literally just console fuckery and random shit lmao",
			"color: #ccc; font-size: 12px; font-family: 'Courier New';"
		);
		console.log(
			"%c\nHidden (or not) console functions exist. Some are useful.\nMost are not. Find them all. try rainbow()  funnynumber()  amogus()  morbius()  snek()  hacker() for a start!",
			"color: #ff2d55; font-size: 12px; font-family: 'Courier New';"
		);
		console.log(
			"%c\nHint: there are %c" + _allFunctions.length + " %cfunctions total. Good luck.",
			"color: #777; font-size: 11px; font-family: 'Courier New';",
			"color: #f68000; font-weight: bold; font-size: 11px; font-family: 'Courier New';",
			"color: #777; font-size: 11px; font-family: 'Courier New';"
		);
		return "🐍";
	} catch (e) {
		console.log("Somehow you broke explain(). Impressive.");
	}
}

function source() {
	_track("source");
	try {
		console.log(
			"%c📂 Unobfuscated source:",
			"color: magenta; font-weight: bold; font-size: 14px; font-family: 'Courier New';"
		);
		console.log(
			"%c   ./source.js",
			"color: #fff; font-size: 13px; font-family: 'Courier New'; text-decoration: underline;"
		);
		return true;
	} catch (e) {
		console.log("Error loading source. The irony is not lost on me.");
	}
}

function rainbow() {
	_track("rainbow");
	var style =
		"font-weight: bold; font-size: 50px; color: red; " +
		"text-shadow: 3px 3px 0 rgb(217,31,38), 6px 6px 0 rgb(226,91,14), " +
		"9px 9px 0 rgb(245,221,8), 12px 12px 0 rgb(5,148,68), " +
		"15px 15px 0 rgb(2,135,206), 18px 18px 0 rgb(4,77,145), " +
		"21px 21px 0 rgb(42,21,113)";
	console.log("%c Rainbowww!", style);
	return "🌈";
}

function funnynumber() {
	_track("funnynumber");
	var nums = [34, 42, 69, 420, 1337, 8008135, 80087355, 177013, 42069, 80085];
	var pick = nums[Math.floor(Math.random() * nums.length)];
	console.log(
		"%c" + pick,
		"font-size: 40px; font-weight: bold; color: #f68000; font-family: 'Courier New';"
	);
	if (pick === 42) {
		console.log(
			"%c  ^ The answer to life, the universe, and everything.",
			"color: #666; font-style: italic; font-family: 'Courier New';"
		);
	}
	if (pick === 177013) {
		console.log(
			"%c  ^ why did they purge this bruh its now gone from the site",
			"color: #666; font-style: italic; font-family: 'Courier New';"
		);
	}
	return pick;
}

function amogus(role) {
	_track("amogus");
	if (role === "imposter" || role === "impostor") {
		var r = Math.random();
		if (r < 0.5) {
			console.warn(
				"%c⚠ The impersonator is exhibiting rather suspicious behaviour.",
				"font-size: 20px; color: #ff69b4; text-shadow: 2px 2px 0 #ff1493;"
			);
		} else {
			console.log(
				"%cWhen the imposter is sussy (sussy) [sussy]!!! (might be important!!)",
				"font-weight: bold; font-size: 40px; color: #ff0000; " +
				"text-shadow: 4px 4px 0 #cc0000, 8px 8px 0 #990000;"
			);
		}
	} else if (role === "crewmate") {
		console.error("%c⚠ Warning", "color: red; font-size: 28px;");
		console.warn(
			"%cBe aware of the imposter among us.",
			"color: orange; font-size: 14px;"
		);
	} else {
		function trial(Plaintiff, Defendant, You) {
			this.Plaintiff = Plaintiff;
			this.Defendant = Defendant;
			this.You = You;
		}
		var me = new trial(
			"Crewmate",
			"Imposter",
			"The two valid inputs are 'imposter' and 'crewmate'. You managed neither."
		);
		console.table(me);
	}
	return "ඞ";
}

function morbius() {
	_track("morbius");
	var r = Math.random();
	if (r < 0.3) {
		console.error(
			"%cCease this morbhavior immediately. It is NOT morbin' time.",
			"font-size: 16px; font-family: 'Courier New';"
		);
	} else if (r < 0.6) {
		console.log(
			"%cIt's morbin' time. 🦇",
			"font-size: 32px; font-weight: bold; color: #6a0dad; text-shadow: 2px 2px 0 #3d0066;"
		);
		console.log(
			"%c(One morbillion dollars at the box office)",
			"color: #888; font-style: italic; font-family: 'Courier New';"
		);
	} else {
		console.warn(
			"%c[MORBIUS CONTAINMENT BREACH] All personnel evacuate immediately.",
			"color: #ff4444; font-size: 14px; font-family: 'Courier New'; font-weight: bold;"
		);
	}
	return true;
}

function snek(toggle) {
	_track("snek");
	var x = document.getElementById("SnekArt");
	if (!x) {
		console.log("%cSnekArt element not found. The snek has escaped.", "color: yellow; font-family: 'Courier New';");
		return false;
	}
	if (toggle === "on") {
		x.style.display = "block";
		console.log("%c🐍 Snek deployed.", "color: lime; font-family: 'Courier New';");
	} else if (toggle === "off") {
		x.style.display = "none";
		console.log("%c🐍 Snek retracted.", "color: #888; font-family: 'Courier New';");
	} else {
		console.log(
			"%cUsage: snek('on') or snek('off')\nPut them in quotes, you absolute retard.",
			"color: yellow; font-family: 'Courier New'; padding: 5px;"
		);
	}
	return true;
}

function hacker() {
	_track("hacker");
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;':\",./<>?";
	var lines = 20;
	console.log(
		"%c[INITIATING HACK SEQUENCE...]",
		"color: #0f0; background: #000; font-family: 'Courier New'; font-size: 14px; font-weight: bold; padding: 4px 12px;"
	);
	for (var i = 0; i < lines; i++) {
		var line = "";
		var len = 40 + Math.floor(Math.random() * 40);
		for (var j = 0; j < len; j++) {
			line += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		console.log(
			"%c" + line,
			"color: #0f0; background: #000; font-family: 'Courier New'; font-size: 10px; line-height: 1.2; padding: 0 12px;"
		);
	}
	console.log(
		"%c[ACCESS GRANTED], additional function `matrix` has been found.",
		"color: #0f0; background: #000; font-family: 'Courier New'; font-size: 14px; font-weight: bold; padding: 4px 12px;"
	);
	return "👨‍💻";
}

function matrix() {
	_track("matrix");
	var phrases = [
		"Wake up, Neo...",
		"The Matrix has you in a `rave`...",
		"Follow the white rabbit for `wisdom`.",
		"Knock, knock, Neo, or else you might `crash`."
	];
	phrases.forEach(function (phrase, i) {
		setTimeout(function () {
			console.log(
				"%c" + phrase,
				"color: #00ff41; background: #000; font-family: 'Courier New'; font-size: 18px; padding: 6px 16px; letter-spacing: 2px;"
			);
		}, i * 1500);
	});
	return "🐇";
}

function rave() {
	_track("rave");
	var colors = ["#ff0000", "#ff8800", "#ffff00", "#00ff00", "#0088ff", "#8800ff", "#ff00ff"];
	var blocks = "";
	for (var i = 0; i < 50; i++) {
		blocks += "█";
	}
	console.log("%c🎵 DONT TRY `RICKROLL`! LEST YOU GET SPAMMED WITH `COPYPASTA`! 🎵", "font-size: 20px; font-weight: bold;");
	for (var j = 0; j < 8; j++) {
		var c = colors[j % colors.length];
		console.log(
			"%c" + blocks,
			"color: " + c + "; background: #000; font-size: 14px; line-height: 1; padding: 0 8px;"
		);
	}
	console.log("%c🎵 STAYIN ALIVE, STAYIN ALIVE 🎵", "font-size: 20px; font-weight: bold;");
	return "🪩";
}

function wisdom() {
	_track("wisdom");
	var quotes = [
		{ text: "You will never be ready. That is the secret they keep from you - readiness was never the prerequisite, only the excuse.", src: "- Lena Vasović" },
		{ text: "The tragedy is not that we forget the dead. It's that we forget we're alive.", src: "- Tomás Quesada" },
		{ text: "Comfort is just fear wearing a bathrobe.", src: "- Miriam Okafor" },
		{ text: "You are not your thoughts. You are the silence that notices them.", src: "- Rēhan Attar" },
		{ text: "The people who hurt you were also once small and afraid. This does not make it okay. But it makes it survivable.", src: "- Yui Tanabe" },
		{ text: "Every empire was once just a person who refused to sit down.", src: "- Cass Morrow" },
		{ text: "Forgiveness is not a gift you give to them. It is the war you finally stop fighting inside yourself.", src: "- Dmitri Solokov" },
		{ text: "The universe does not owe you meaning. That is what makes it so extraordinary when you build some anyway.", src: "- Ingrid Holm" },
		{ text: "You will lose people not because you failed them, but because some doors only open from the other side.", src: "- Amara Sefton" },
		{ text: "The bravest thing you will ever do is choose to begin again when no one is watching.", src: "- Joel Achebe" },
	];
	var pick = quotes[Math.floor(Math.random() * quotes.length)];
	console.log(
		"%c\"" + pick.text + "\"",
		"color: #f0c040; font-size: 14px; font-family: Georgia, serif; font-style: italic; padding: 8px 0 2px;"
	);
	console.log(
		"%c" + pick.src,
		"color: #888; font-size: 11px; font-family: 'Courier New'; padding: 0 0 8px 20px;"
	);
	return "🧠";
}

function crash() {
	_track("crash");
	console.log(
		"%c💥 CRITICAL ERROR: SYSTEM32 DELETED 💥",
		"color: #fff; background: #ff0000; font-size: 24px; font-weight: bold; padding: 10px 20px; font-family: 'Courier New';"
	);
	console.log(
		"%c\n...rebooting in 3... 2... 1...",
		"color: #aaa; font-size: 12px; font-family: 'Courier New';"
	);
	return "💀";
}

function rickroll() {
	_track("rickroll");
	console.log(
		"%c♫ Never gonna give you up ♫",
		"font-size: 28px; font-weight: bold; color: #ff6600; font-family: 'Courier New';"
	);
	console.log(
		"%c♫ Never gonna let you down ♫",
		"font-size: 24px; color: #ff8833; font-family: 'Courier New';"
	);
	console.log(
		"%c♫ Never gonna run around and desert you ♫",
		"font-size: 20px; color: #ffaa55; font-family: 'Courier New';"
	);
	console.log(
		"%c\nYou just got console-rolled.",
		"color: #888; font-size: 12px; font-style: italic; font-family: 'Courier New';"
	);

	window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

	return "🎤";
}

function copypasta() {
	_track("copypasta");
	var pastas = [
		"You are now breathing manually.",
		"None of this is original. That's the point.",
		"You could be doing anything right now and you chose this.",
		"Everything on the internet is a copy of a copy of a copy.",
		"This content has been recycled so many times it's basically compost.",
		"Somebody typed this once. Then everybody typed it forever.",
		"You've scrolled this far. No point in stopping now.",
	];
	var pick = pastas[Math.floor(Math.random() * pastas.length)];
	console.log(
		"%c📋 " + pick,
		"color: #af52de; font-size: 14px; font-family: 'Courier New'; padding: 6px 0;"
	);
	return "📋";
}

function sussy() {
	_track("sussy");
	var amogusArt =
		"⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣤⣤⣤⣶⣦⣤⣄⡀\n" +
		"⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡿⠛⠉⠙⠛⠛⠛⠛⠻⢿⣿⣷⣤⡀\n" +
		"⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⠋⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠈⢻⣿⣿⡄\n" +
		"⠀⠀⠀⠀⠀⠀⠀⣸⣿⡏⠀⠀⠀⣠⣶⣾⣿⣿⣿⠿⠿⠿⢿⣿⣿⣿⣄\n" +
		"⠀⠀⠀⠀⠀⠀⠀⣿⣿⠁⠀⠀⢰⣿⣿⣯⠁⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣷⡄\n" +
		"⠀⠀⣀⣤⣴⣶⣶⣿⡟⠀⠀⠀⢸⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣷\n" +
		"⠀⢰⣿⡟⠋⠉⣹⣿⡇⠀⠀⠀⠘⣿⣿⣿⣿⣷⣦⣤⣤⣤⣶⣶⣶⣶⣿⣿⣿\n" +
		"⠀⢸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃\n" +
		"⠀⣸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠉⠻⠿⣿⣿⣿⣿⡿⠿⠿⠛⢻⣿⡇\n" +
		"⠀⣿⣿⠁⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣧\n" +
		"⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿\n" +
		"⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿\n" +
		"⠀⢿⣿⡆⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇\n" +
		"⠀⠸⣿⣧⡀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠃\n" +
		"⠀⠀⠛⢿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⣰⣿⣿⣷⣶⣶⣶⣶⠶⠀⢠⣿⣿\n" +
		"⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⣽⣿⡏⠁⠀⠀⢸⣿⡇\n" +
		"⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⢹⣿⡆⠀⠀⠀⣸⣿⠇\n" +
		"⠀⠀⠀⠀⠀⠀⠀⢿⣿⣦⣄⣀⣠⣴⣿⣿⠁⠀⠈⠻⣿⣿⣿⣿⡿⠏\n" +
		"⠀⠀⠀⠀⠀⠀⠀⠈⠛⠻⠿⠿⠿⠿⠋⠁";
	console.log(
		"%c" + amogusArt,
		"color: #ff0000; font-family: 'Courier New'; font-size: 10px; line-height: 1.05; background: #000; padding: 10px;"
	);
	console.log(
		"%cS U S",
		"color: #ff0000; font-size: 48px; font-weight: bold; font-family: 'Courier New'; text-shadow: 3px 3px 0 #660000;"
	);
	return "ඞ";
}

// ── title glitch ────────────────────────────────────
(function titleGlitch() {
	var original = document.title;
	var glitches = [
		"undefined is not a function",
		"c̷o̶n̵s̶o̸l̵e̸ ̵f̸u̵c̸k̵e̶r̷y̶",
		"ctrl+c ctrl+v",
		"ඞ amogus ඞ",
		"segfault (core dumped)",
		"404 Pasta Not Found",
		"npm install meaning-of-life",
		"you're still here?",
	];
	var idx = 0;
	setInterval(function () {
		if (document.hidden) return;
		if (Math.random() < 0.08) {
			document.title = glitches[idx % glitches.length];
			idx++;
			setTimeout(function () {
				document.title = original;
			}, 2500);
		}
	}, 8000);
})();

// ── konami code listener ────────────────────────────
(function konamiCode() {
	var code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
	var pos = 0;
	document.addEventListener("keydown", function (e) {
		if (e.keyCode === code[pos]) {
			pos++;
			if (pos === code.length) {
				pos = 0;
				console.log(
					"%c🎮 KONAMI CODE ACTIVATED 🎮",
					"font-size: 28px; font-weight: bold; color: #fff; background: linear-gradient(90deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff); padding: 10px 24px; border-radius: 8px;"
				);
				console.log(
					"%c+30 lives.",
					"color: #aaa; font-size: 12px; font-family: 'Courier New';"
				);
				document.body.style.transition = "transform 1s ease";
				document.body.style.transform = "rotate(360deg)";
				setTimeout(function () {
					document.body.style.transform = "rotate(0deg)";
				}, 1200);
			}
		} else {
			pos = 0;
		}
	});
})();

// ── right-click snark ───────────────────────────────
(function rightClickSnark() {
	var messages = [
		"Inspecting the document? A scholar, I see.",
		"Looking for the source code? Try source() in the console.",
		"Right-clicking won't make the copypasta any less pasta.",
		"You can look, but you can't un-read.",
	];
	var count = 0;
	document.addEventListener("contextmenu", function () {
		if (count < 4) {
			console.log(
				"%c🖱 " + messages[count],
				"color: #f68000; font-family: 'Courier New'; font-size: 11px;"
			);
			count++;
		}
	});
})();

// ── Badge for finding all secrets (auto-triggers) ───────────
function iFoundEverything() {
	console.log("%c\n" +
		"╔═══════════════════════════════════════╗\n" +
		"║       CERTIFIED ARCHAEOLOGIST         ║\n" +
		"║                                       ║\n" +
		"║  You found all the hidden functions.  ║\n" +
		"║  Your reward is... this message.      ║\n" +
		"║  What did you expect? A medal?        ║\n" +
		"╚═══════════════════════════════════════╝",
		"color: #ffd700; background: #1a1a1d; font-family: 'Courier New'; font-size: 13px; padding: 10px; line-height: 1.7;"
	);
	return "🏆";
}