// =====================================================================
// Sequence Manipulation Utilities
// =====================================================================

"use strict";

// -- Complement map (handles IUPAC ambiguity codes) -------------------
var COMP_MAP = {
  G:"C", A:"T", T:"A", C:"G", N:"N",
  g:"c", a:"t", t:"a", c:"g", n:"n",
  R:"Y", Y:"R", K:"M", M:"K", S:"S", W:"W",
  B:"V", V:"B", D:"H", H:"D",
  r:"y", y:"r", k:"m", m:"k", s:"s", w:"w",
  b:"v", v:"b", d:"h", h:"d",
  U:"A", u:"a"
};

// -- Core sequence ops ------------------------------------------------

function complement(seq) {
  var out = "";
  for (var i = 0; i < seq.length; i++) out += COMP_MAP[seq[i]] || seq[i];
  return out;
}

function reverseStr(seq) {
  var out = "";
  for (var i = seq.length - 1; i >= 0; i--) out += seq[i];
  return out;
}

function reverseComplement(seq) {
  return reverseStr(complement(seq));
}

// -- Filters ----------------------------------------------------------

function filterDna(seq)              { return seq.replace(/[^GATCNUgatcnu]/g, "").toLowerCase(); }
function filterDnaSaveCase(seq)      { return seq.replace(/[^GATCNUgatcnu]/g, ""); }
function filterDnaIupac(seq)         { return seq.replace(/[^GATCNRYSWKMBDHVUgatcnryswkmbdhvu]/g, "").toLowerCase(); }
function filterDnaIupacSaveCase(seq) { return seq.replace(/[^GATCNRYSWKMBDHVUgatcnryswkmbdhvu]/g, ""); }
function filterProtein(seq)          { return seq.replace(/[^ABCDEFGHIKLMNPQRSTVWXYZabcdefghiklmnpqrstvwxyz*]/g, "").toUpperCase(); }
function filterProteinSaveCase(s)    { return s.replace(/[^ABCDEFGHIKLMNPQRSTVWXYZabcdefghiklmnpqrstvwxyz*]/g, ""); }

// -- FASTA parsing ----------------------------------------------------

function parseFasta(raw) {
  var title = "";
  var headerMatch = raw.match(/^>([^\r\n]+)/m);
  if (headerMatch) {
    title = headerMatch[1].trim().replace(/[<>]/g, "").replace(/\s{2,}/g, " ");
  }
  var sequence = raw.replace(/^>.*$/gm, "").trim();
  return { title: title, sequence: sequence };
}

// -- Validation -------------------------------------------------------

function verifyDna(seq)     { return !/[^gatcnu\s]/i.test(seq); }
function verifyProtein(seq) { return !/[^abcdefghiklmnpqrstvwxyz*\s]/i.test(seq); }

// -- Statistics -------------------------------------------------------

function seqStats(seq) {
  var len = seq.length;
  if (len === 0) return { len:0, a:0, t:0, g:0, c:0, n:0, gc:"0.0", at:"0.0" };
  var a=0, t=0, g=0, c=0, n=0;
  for (var i = 0; i < len; i++) {
    switch (seq[i].toUpperCase()) {
      case "A": a++; break;
      case "T": case "U": t++; break;
      case "G": g++; break;
      case "C": c++; break;
      default:  n++; break;
    }
  }
  return {
    len:len, a:a, t:t, g:g, c:c, n:n,
    gc: ((g + c) / len * 100).toFixed(1),
    at: ((a + t) / len * 100).toFixed(1)
  };
}

// -- Formatting -------------------------------------------------------

function formatSeq(seq, width) {
  width = width || 60;
  var lines = [];
  for (var i = 0; i < seq.length; i += width) {
    lines.push(seq.slice(i, i + width));
  }
  return lines.join("\n");
}

function formatSeqNumbered(seq, width, groupSize) {
  width = width || 60;
  groupSize = groupSize || 10;
  var lines = [];
  for (var i = 0; i < seq.length; i += width) {
    var chunk = seq.slice(i, i + width);
    var num = String(i + 1);
    while (num.length < 8) num = " " + num;
    var grouped = "";
    for (var j = 0; j < chunk.length; j += groupSize) {
      grouped += (j > 0 ? " " : "") + chunk.slice(j, j + groupSize);
    }
    lines.push(num + " " + grouped);
  }
  return lines.join("\n");
}

// =====================================================================
// TRANSLATION & GENETIC CODES
// =====================================================================

var STANDARD_CODE = {
  "TTT":"F","TTC":"F","TTA":"L","TTG":"L",
  "CTT":"L","CTC":"L","CTA":"L","CTG":"L",
  "ATT":"I","ATC":"I","ATA":"I","ATG":"M",
  "GTT":"V","GTC":"V","GTA":"V","GTG":"V",
  "TCT":"S","TCC":"S","TCA":"S","TCG":"S",
  "CCT":"P","CCC":"P","CCA":"P","CCG":"P",
  "ACT":"T","ACC":"T","ACA":"T","ACG":"T",
  "GCT":"A","GCC":"A","GCA":"A","GCG":"A",
  "TAT":"Y","TAC":"Y","TAA":"*","TAG":"*",
  "CAT":"H","CAC":"H","CAA":"Q","CAG":"Q",
  "AAT":"N","AAC":"N","AAA":"K","AAG":"K",
  "GAT":"D","GAC":"D","GAA":"E","GAG":"E",
  "TGT":"C","TGC":"C","TGA":"*","TGG":"W",
  "CGT":"R","CGC":"R","CGA":"R","CGG":"R",
  "AGT":"S","AGC":"S","AGA":"R","AGG":"R",
  "GGT":"G","GGC":"G","GGA":"G","GGG":"G"
};

function _makeCode(diffs) {
  var code = {};
  for (var k in STANDARD_CODE) code[k] = STANDARD_CODE[k];
  for (var k in diffs) code[k] = diffs[k];
  return code;
}

var GENETIC_CODES = {
  "1":  { name: "Standard", code: STANDARD_CODE },
  "2":  { name: "Vertebrate Mitochondrial", code: _makeCode({"TGA":"W","AGA":"*","AGG":"*","ATA":"M"}) },
  "3":  { name: "Yeast Mitochondrial", code: _makeCode({"TGA":"W","CTT":"T","CTC":"T","CTA":"T","CTG":"T","ATA":"M"}) },
  "4":  { name: "Mold/Protozoan/Coelenterate Mito & Mycoplasma", code: _makeCode({"TGA":"W"}) },
  "5":  { name: "Invertebrate Mitochondrial", code: _makeCode({"TGA":"W","AGA":"S","AGG":"S","ATA":"M"}) },
  "6":  { name: "Ciliate/Dasycladacean/Hexamita Nuclear", code: _makeCode({"TAA":"Q","TAG":"Q"}) },
  "9":  { name: "Echinoderm/Flatworm Mitochondrial", code: _makeCode({"TGA":"W","AGA":"S","AGG":"S","AAA":"N"}) },
  "10": { name: "Euplotid Nuclear", code: _makeCode({"TGA":"C"}) },
  "11": { name: "Bacterial/Archaeal/Plant Plastid", code: STANDARD_CODE },
  "12": { name: "Alternative Yeast Nuclear", code: _makeCode({"CTG":"S"}) },
  "13": { name: "Ascidian Mitochondrial", code: _makeCode({"TGA":"W","AGA":"G","AGG":"G","ATA":"M"}) },
  "14": { name: "Alternative Flatworm Mitochondrial", code: _makeCode({"TGA":"W","AGA":"S","AGG":"S","AAA":"N","TAA":"Y"}) },
  "15": { name: "Blepharisma Nuclear", code: _makeCode({"TAG":"Q"}) },
  "16": { name: "Chlorophycean Mitochondrial", code: _makeCode({"TAG":"L"}) },
  "21": { name: "Trematode Mitochondrial", code: _makeCode({"TGA":"W","ATA":"M","AGA":"S","AGG":"S","AAA":"N"}) },
  "22": { name: "Scenedesmus obliquus Mitochondrial", code: _makeCode({"TCA":"*","TAG":"L"}) },
  "23": { name: "Thraustochytrium Mitochondrial", code: _makeCode({"TTA":"*"}) },
  "24": { name: "Rhabdopleuridae Mitochondrial", code: _makeCode({"TGA":"W","AGA":"S","AGG":"K"}) },
  "25": { name: "Candidate Division SR1/Gracilibacteria", code: _makeCode({"TGA":"G"}) },
  "26": { name: "Pachysolen tannophilus Nuclear", code: _makeCode({"CTG":"A"}) },
  "27": { name: "Karyorelict Nuclear", code: _makeCode({"TAA":"Q","TAG":"Q","TGA":"W"}) },
  "28": { name: "Condylostoma Nuclear", code: _makeCode({"TAA":"Q","TAG":"Q","TGA":"W"}) },
  "29": { name: "Mesodinium Nuclear", code: _makeCode({"TAA":"Y","TAG":"Y"}) },
  "30": { name: "Peritrich Nuclear", code: _makeCode({"TAA":"E","TAG":"E"}) },
  "31": { name: "Blastocrithidia Nuclear", code: _makeCode({"TGA":"W","TAA":"E","TAG":"E"}) },
  "32": { name: "Balanophoraceae Plastid", code: _makeCode({"TAG":"W"}) },
  "33": { name: "Cephalodiscidae Mitochondrial", code: _makeCode({"TAA":"Y","TGA":"W","AGA":"S","AGG":"K"}) }
};

function translate(dnaSeq, frame, geneticCode) {
  frame = frame || 0;
  geneticCode = geneticCode || STANDARD_CODE;
  var protein = "";
  var upper = dnaSeq.toUpperCase().replace(/U/g, "T");
  for (var i = frame; i <= upper.length - 3; i += 3) {
    protein += geneticCode[upper.slice(i, i + 3)] || "X";
  }
  return protein;
}

function translateDetailed(dnaSeq, frame, geneticCode) {
  geneticCode = geneticCode || STANDARD_CODE;
  var upper = dnaSeq.toUpperCase().replace(/U/g, "T");
  var codons = [];
  for (var i = frame; i <= upper.length - 3; i += 3) {
    var codon = upper.slice(i, i + 3);
    codons.push({ codon: dnaSeq.slice(i, i + 3), aa: geneticCode[codon] || "X", pos: i });
  }
  return codons;
}

function findOrfs(codonData, minLength) {
  minLength = minLength || 1;
  var orfs = [];
  var start = -1;
  for (var i = 0; i < codonData.length; i++) {
    if (codonData[i].aa === "M" && start === -1) {
      start = i;
    } else if (codonData[i].aa === "*" && start !== -1) {
      if (i - start >= minLength) {
        orfs.push({ start: start, end: i, length: i - start });
      }
      start = -1;
    }
  }
  return orfs;
}

function translateAllFrames(dnaSeq, geneticCode) {
  var results = [];
  var rc = reverseComplement(dnaSeq);
  for (var f = 0; f < 3; f++) {
    var cd = translateDetailed(dnaSeq, f, geneticCode);
    results.push({ label: "5'>3' Frame " + (f + 1), codonData: cd, orfs: findOrfs(cd) });
  }
  for (var f = 0; f < 3; f++) {
    var cd = translateDetailed(rc, f, geneticCode);
    results.push({ label: "3'>5' Frame " + (f + 1), codonData: cd, orfs: findOrfs(cd) });
  }
  return results;
}

// Codon frequency from a DNA sequence
function codonFrequency(dnaSeq, geneticCode) {
  geneticCode = geneticCode || STANDARD_CODE;
  var upper = dnaSeq.toUpperCase().replace(/U/g, "T");
  var freq = {};
  for (var i = 0; i <= upper.length - 3; i += 3) {
    var c = upper.slice(i, i + 3);
    freq[c] = (freq[c] || 0) + 1;
  }
  return freq;
}

// =====================================================================
// BACK TRANSLATE
// =====================================================================

var IUPAC_MAP = {
  "A":"A","C":"C","G":"G","T":"T",
  "AG":"R","CT":"Y","CG":"S","AT":"W","GT":"K","AC":"M",
  "CGT":"B","AGT":"D","ACT":"H","ACG":"V",
  "ACGT":"N"
};

function getIUPAC(basesArr) {
  var unique = [];
  var seen = {};
  for (var i = 0; i < basesArr.length; i++) {
    var b = basesArr[i].toUpperCase();
    if (!seen[b]) { seen[b] = true; unique.push(b); }
  }
  unique.sort();
  return IUPAC_MAP[unique.join("")] || "N";
}

function buildReverseTable(geneticCode) {
  var rev = {};
  for (var codon in geneticCode) {
    var aa = geneticCode[codon];
    if (!rev[aa]) rev[aa] = [];
    rev[aa].push(codon);
  }
  return rev;
}

function backTranslate(proteinSeq, geneticCode) {
  var revTable = buildReverseTable(geneticCode || STANDARD_CODE);
  var result = "";
  var details = [];
  for (var i = 0; i < proteinSeq.length; i++) {
    var aa = proteinSeq[i].toUpperCase();
    var codons = revTable[aa];
    if (!codons || codons.length === 0) {
      result += "NNN";
      details.push({ aa: aa, codons: [], degenerate: "NNN" });
      continue;
    }
    var p1 = [], p2 = [], p3 = [];
    for (var j = 0; j < codons.length; j++) {
      p1.push(codons[j][0]);
      p2.push(codons[j][1]);
      p3.push(codons[j][2]);
    }
    var deg = getIUPAC(p1) + getIUPAC(p2) + getIUPAC(p3);
    result += deg;
    details.push({ aa: aa, codons: codons.slice(), degenerate: deg });
  }
  return { sequence: result, details: details };
}

// =====================================================================
// PROTEIN STATISTICS
// =====================================================================

var AA_MW = {
  G:57.0519, A:71.0788, V:99.1326, L:113.1594, I:113.1594,
  P:97.1167, F:147.1766, W:186.2132, M:131.1926, S:87.0782,
  T:101.1051, C:103.1388, Y:163.1760, H:137.1411, D:115.0886,
  E:129.1155, N:114.1038, Q:128.1307, K:128.1741, R:156.1875,
  B:114.5962, X:111.0608, Z:128.6231, "*":0
};
var WATER_MW = 18.0153;

// pKa datasets for pI calculation
// Values verified against Kozlowski (2016) IPC and primary sources
var PKA_SETS = {
  "bjellqvist": {
    name: "Bjellqvist (ExPASy Compute pI/Mw)",
    nterm: 7.5, cterm: 3.55,
    side: { D:4.05, E:4.45, C:9.0, Y:10.0, H:5.98, K:10.0, R:12.0 }
  },
  "lehninger": {
    name: "Lehninger Principles of Biochemistry",
    nterm: 9.69, cterm: 2.34,
    side: { D:3.86, E:4.25, C:8.33, Y:10.0, H:6.0, K:10.5, R:12.4 }
  },
  "emboss": {
    name: "EMBOSS (Epk.dat)",
    nterm: 8.6, cterm: 3.6,
    side: { D:3.9, E:4.1, C:8.5, Y:10.1, H:6.5, K:10.8, R:12.5 }
  },
  "dtamb": {
    name: "DTASelect (Scripps)",
    nterm: 8.0, cterm: 3.1,
    side: { D:4.4, E:4.4, C:8.5, Y:10.0, H:6.5, K:10.0, R:12.0 }
  }
}

function proteinMW(seq) {
  var mw = WATER_MW;
  for (var i = 0; i < seq.length; i++) {
    var w = AA_MW[seq[i].toUpperCase()];
    if (w) mw += w;
  }
  return mw;
}

function chargeAtPH(seq, pH, pkaSet) {
  pkaSet = pkaSet || PKA_SETS["bjellqvist"];
  var charge = 0;
  // N-terminal positive
  charge += Math.pow(10, pkaSet.nterm) / (Math.pow(10, pkaSet.nterm) + Math.pow(10, pH));
  // C-terminal negative
  charge -= Math.pow(10, pH) / (Math.pow(10, pkaSet.cterm) + Math.pow(10, pH));
  for (var i = 0; i < seq.length; i++) {
    var aa = seq[i].toUpperCase();
    var pka = pkaSet.side[aa];
    if (pka === undefined) continue;
    if (aa === "K" || aa === "R" || aa === "H") {
      charge += Math.pow(10, pka) / (Math.pow(10, pka) + Math.pow(10, pH));
    } else {
      charge -= Math.pow(10, pH) / (Math.pow(10, pka) + Math.pow(10, pH));
    }
  }
  return charge;
}

function proteinPI(seq, pkaSet) {
  pkaSet = pkaSet || PKA_SETS["bjellqvist"];
  var lo = 0, hi = 14, mid;
  for (var i = 0; i < 200; i++) {
    mid = (lo + hi) / 2;
    var ch = chargeAtPH(seq, mid, pkaSet);
    if (ch > 0) lo = mid;
    else hi = mid;
    if (Math.abs(ch) < 0.0001) break;
  }
  return mid;
}

function extinctionCoeff(seq) {
  var nY = 0, nW = 0, nC = 0;
  for (var i = 0; i < seq.length; i++) {
    var aa = seq[i].toUpperCase();
    if (aa === "Y") nY++;
    else if (aa === "W") nW++;
    else if (aa === "C") nC++;
  }
  var cystines = Math.floor(nC / 2);
  return {
    withCystines: nY * 1490 + nW * 5500 + cystines * 125,
    reduced: nY * 1490 + nW * 5500,
    nY: nY, nW: nW, nC: nC
  };
}

function aaComposition(seq) {
  var counts = {};
  var order = "GAVLIPFWMSCTYHDEQNKRBXZ";
  for (var i = 0; i < order.length; i++) counts[order[i]] = 0;
  for (var i = 0; i < seq.length; i++) {
    var aa = seq[i].toUpperCase();
    if (counts[aa] !== undefined) counts[aa]++;
  }
  return counts;
}

// =====================================================================
// TM CALCULATOR
// =====================================================================

// Nearest-neighbor parameters (SantaLucia 1998, unified)
// delta-H in kcal/mol, delta-S in cal/(mol*K)
var NN_DH = {
  "AA":-7.9,"TT":-7.9, "AT":-7.2, "TA":-7.2,
  "CA":-8.5,"TG":-8.5, "GT":-8.4,"AC":-8.4,
  "CT":-7.8,"AG":-7.8, "GA":-8.2,"TC":-8.2,
  "CG":-10.6, "GC":-9.8, "GG":-8.0,"CC":-8.0
};
var NN_DS = {
  "AA":-22.2,"TT":-22.2, "AT":-20.4, "TA":-21.3,
  "CA":-22.7,"TG":-22.7, "GT":-22.4,"AC":-22.4,
  "CT":-21.0,"AG":-21.0, "GA":-22.2,"TC":-22.2,
  "CG":-27.2, "GC":-24.4, "GG":-19.9,"CC":-19.9
};
// Initiation parameters
var NN_INIT_DH = { "GC": 0.1, "AT": 2.3 };
var NN_INIT_DS = { "GC": -2.8, "AT": 4.1 };

function calcTmNN(seq, naConc, primerConc) {
  naConc = naConc || 0.05;
  primerConc = primerConc || 0.00000025; // 250 nM default
  var upper = seq.toUpperCase();
  var len = upper.length;
  if (len < 2) return null;

  // Expand IUPAC to possible bases
  var IUPAC_EXPAND = {
    A:["A"], C:["C"], G:["G"], T:["T"], U:["T"],
    R:["A","G"], Y:["C","T"], S:["G","C"], W:["A","T"], K:["G","T"], M:["A","C"],
    B:["C","G","T"], D:["A","G","T"], H:["A","C","T"], V:["A","C","G"],
    N:["A","C","G","T"]
  };

  // Sum nearest-neighbor params, averaging over ambiguous positions
  var dH = 0, dS = 0;
  for (var i = 0; i < len - 1; i++) {
    var bases1 = IUPAC_EXPAND[upper[i]];
    var bases2 = IUPAC_EXPAND[upper[i + 1]];
    if (!bases1 || !bases2) return null;
    var sumH = 0, sumS = 0, count = 0;
    for (var a = 0; a < bases1.length; a++) {
      for (var b = 0; b < bases2.length; b++) {
        var pair = bases1[a] + bases2[b];
        if (NN_DH[pair] !== undefined) {
          sumH += NN_DH[pair];
          sumS += NN_DS[pair];
          count++;
        }
      }
    }
    if (count === 0) return null;
    dH += sumH / count;
    dS += sumS / count;
  }

  // Initiation params based on terminal bases (use first possibility if ambiguous)
  var firstBases = IUPAC_EXPAND[upper[0]] || ["A"];
  var lastBases  = IUPAC_EXPAND[upper[len - 1]] || ["A"];
  function gcFraction(bases) {
    var gc = 0;
    for (var i = 0; i < bases.length; i++) if (bases[i]==="G"||bases[i]==="C") gc++;
    return gc / bases.length;
  }
  var fGC = gcFraction(firstBases), lGC = gcFraction(lastBases);
  dH += fGC*NN_INIT_DH["GC"] + (1-fGC)*NN_INIT_DH["AT"] + lGC*NN_INIT_DH["GC"] + (1-lGC)*NN_INIT_DH["AT"];
  dS += fGC*NN_INIT_DS["GC"] + (1-fGC)*NN_INIT_DS["AT"] + lGC*NN_INIT_DS["GC"] + (1-lGC)*NN_INIT_DS["AT"];

  // Salt correction (SantaLucia 1998)
  dS += 0.368 * (len - 1) * Math.log(naConc);

  // Tm = dH / (dS + R * ln(Ct/4)) - 273.15
  var R = 1.987;
  var isSelfComp = (seq.toUpperCase() === reverseComplement(seq.toUpperCase()));
  var ctTerm = isSelfComp ? primerConc : (primerConc / 4);
  var tm = (dH * 1000) / (dS + R * Math.log(ctTerm)) - 273.15;
  return parseFloat(tm.toFixed(1));
}

function calcTm(seq, naConc, primerConc) {
  naConc = naConc || 0.05;
  primerConc = primerConc || 0.00000025;
  // IUPAC-aware base counting: distribute ambiguous bases fractionally
  var IUPAC_BASES = {
    A:[1,0,0,0], C:[0,1,0,0], G:[0,0,1,0], T:[0,0,0,1], U:[0,0,0,1],
    R:[0.5,0,0.5,0], Y:[0,0.5,0,0.5], S:[0,0.5,0.5,0], W:[0.5,0,0,0.5],
    K:[0,0,0.5,0.5], M:[0.5,0.5,0,0], B:[0,1/3,1/3,1/3], D:[1/3,0,1/3,1/3],
    H:[1/3,1/3,0,1/3], V:[1/3,1/3,1/3,0], N:[0.25,0.25,0.25,0.25]
  };
  var fa=0, fc=0, fg=0, ft=0, len=0;
  for (var i = 0; i < seq.length; i++) {
    var b = IUPAC_BASES[seq[i].toUpperCase()];
    if (b) { fa += b[0]; fc += b[1]; fg += b[2]; ft += b[3]; len++; }
  }
  if (len === 0) return { methods: [], len: 0 };
  var s = {
    len: len, a: Math.round(fa), t: Math.round(ft), g: Math.round(fg), c: Math.round(fc), n: 0,
    gc: ((fg + fc) / len * 100).toFixed(1),
    at: ((fa + ft) / len * 100).toFixed(1)
  };

  var methods = [];

  if (len <= 13) {
    // Short oligos: Wallace only
    var tmW = 2 * (s.a + s.t) + 4 * (s.g + s.c);
    methods.push({ name: "Wallace rule", tm: tmW, formula: "Tm = 2(A+T) + 4(G+C)", note: "Standard method for short oligos (\u226413 bp). Does not account for salt or primer concentration.", recommended: true });
  } else if (len <= 60) {
    // Primer range: NN (recommended) + salt-adjusted for comparison
    var tmNN = calcTmNN(seq, naConc, primerConc);
    if (tmNN !== null) {
      methods.push({ name: "Nearest-neighbor", tm: tmNN, formula: "Tm = \u0394H / (\u0394S + R\u00b7ln(Ct/4)) \u2212 273.15 (SantaLucia 1998)", note: "Most accurate for primers (14\u201360 bp). Uses dinucleotide thermodynamic parameters with salt and primer concentration corrections.", recommended: true });
    }
    var gcFrac = (s.g + s.c) / len;
    var tmSalt = 100.5 + (41 * gcFrac) - (820 / len) + 16.6 * Math.log10(naConc);
    methods.push({ name: "Salt-adjusted", tm: parseFloat(tmSalt.toFixed(1)), formula: "Tm = 100.5 + 41\u00b7(%GC) \u2212 820/N + 16.6\u00b7log\u2081\u2080([Na\u207a])", note: "General-purpose formula. Less accurate than nearest-neighbor for primers but useful for comparison.", recommended: (tmNN === null) });
  } else {
    // Long sequences: salt-adjusted (long-sequence variant, Howley et al. 1979)
    var gcFrac = (s.g + s.c) / len;
    var tmSalt = 81.5 + (41 * gcFrac) - (500 / len) + 16.6 * Math.log10(naConc);
    methods.push({ name: "Salt-adjusted", tm: parseFloat(tmSalt.toFixed(1)), formula: "Tm = 81.5 + 41\u00b7(%GC) \u2212 500/N + 16.6\u00b7log\u2081\u2080([Na\u207a])", note: "Long-sequence salt-adjusted formula (>60 bp). GC and salt terms from Marmur & Doty (1962) and Schildkraut & Lifson (1965).", recommended: true });
  }

  return { methods: methods, len: len, gc: s.gc, stats: s };
}

// =====================================================================
// MOTIF SEARCH
// =====================================================================

// IUPAC_TO_REGEX is defined in the restriction enzyme section below
// and is also used by searchMotif

function searchMotif(seq, pattern, isProtein) {
  var upper = seq.toUpperCase();
  var patUpper = pattern.toUpperCase().replace(/\s/g, "");

  // Build regex from pattern (supports IUPAC for DNA, or literal for protein)
  var regexStr = "";
  for (var i = 0; i < patUpper.length; i++) {
    var ch = patUpper[i];
    if (!isProtein && IUPAC_TO_REGEX[ch]) {
      regexStr += IUPAC_TO_REGEX[ch];
    } else if (ch === ".") {
      regexStr += ".";
    } else if (ch === "[" || ch === "]") {
      regexStr += ch;
    } else {
      regexStr += ch;
    }
  }

  var re;
  try {
    re = new RegExp(regexStr, "g");
  } catch(e) {
    return { error: "Invalid pattern: " + e.message, matches: [] };
  }

  var matches = [];
  var match;
  while ((match = re.exec(upper)) !== null) {
    matches.push({
      pos: match.index + 1,
      end: match.index + match[0].length,
      seq: seq.slice(match.index, match.index + match[0].length)
    });
    re.lastIndex = match.index + 1; // allow overlapping matches
  }

  return { matches: matches, pattern: patUpper, regex: regexStr, error: null };
}

// =====================================================================
// RESTRICTION ENZYMES
// =====================================================================

var RESTRICTION_ENZYMES = [
  { name:"AatII",   site:"GACGTC",     cut:5 },
  { name:"Acc65I",  site:"GGTACC",     cut:1 },
  { name:"AflII",   site:"CTTAAG",     cut:1 },
  { name:"AgeI",    site:"ACCGGT",     cut:1 },
  { name:"ApaI",    site:"GGGCCC",     cut:5 },
  { name:"AscI",    site:"GGCGCGCC",   cut:2 },
  { name:"AvrII",   site:"CCTAGG",     cut:1 },
  { name:"BamHI",   site:"GGATCC",     cut:1 },
  { name:"BclI",    site:"TGATCA",     cut:1 },
  { name:"BglII",   site:"AGATCT",     cut:1 },
  { name:"BlpI",    site:"GCTNAGC",    cut:2 },
  { name:"BsiWI",   site:"CGTACG",     cut:1 },
  { name:"BspEI",   site:"TCCGGA",     cut:1 },
  { name:"BsrGI",   site:"TGTACA",     cut:1 },
  { name:"BstBI",   site:"TTCGAA",     cut:2 },
  { name:"ClaI",    site:"ATCGAT",     cut:2 },
  { name:"DraI",    site:"TTTAAA",     cut:3 },
  { name:"EcoRI",   site:"GAATTC",     cut:1 },
  { name:"EcoRV",   site:"GATATC",     cut:3 },
  { name:"FseI",    site:"GGCCGGCC",   cut:6 },
  { name:"HindIII", site:"AAGCTT",     cut:1 },
  { name:"HpaI",    site:"GTTAAC",     cut:3 },
  { name:"KpnI",    site:"GGTACC",     cut:5 },
  { name:"MfeI",    site:"CAATTG",     cut:1 },
  { name:"MluI",    site:"ACGCGT",     cut:1 },
  { name:"NarI",    site:"GGCGCC",     cut:2 },
  { name:"NcoI",    site:"CCATGG",     cut:1 },
  { name:"NdeI",    site:"CATATG",     cut:2 },
  { name:"NheI",    site:"GCTAGC",     cut:1 },
  { name:"NotI",    site:"GCGGCCGC",   cut:2 },
  { name:"PacI",    site:"TTAATTAA",   cut:5 },
  { name:"PmeI",    site:"GTTTAAAC",   cut:4 },
  { name:"PstI",    site:"CTGCAG",     cut:5 },
  { name:"PvuI",    site:"CGATCG",     cut:4 },
  { name:"PvuII",   site:"CAGCTG",     cut:3 },
  { name:"SacI",    site:"GAGCTC",     cut:5 },
  { name:"SacII",   site:"CCGCGG",     cut:4 },
  { name:"SalI",    site:"GTCGAC",     cut:1 },
  { name:"ScaI",    site:"AGTACT",     cut:3 },
  { name:"SmaI",    site:"CCCGGG",     cut:3 },
  { name:"SpeI",    site:"ACTAGT",     cut:1 },
  { name:"SphI",    site:"GCATGC",     cut:5 },
  { name:"StuI",    site:"AGGCCT",     cut:3 },
  { name:"SwaI",    site:"ATTTAAAT",   cut:4 },
  { name:"XbaI",    site:"TCTAGA",     cut:1 },
  { name:"XhoI",    site:"CTCGAG",     cut:1 },
  { name:"XmaI",    site:"CCCGGG",     cut:1 }
];

var IUPAC_TO_REGEX = {
  A:"A", C:"C", G:"G", T:"T", U:"T",
  R:"[AG]", Y:"[CT]", S:"[GC]", W:"[AT]", K:"[GT]", M:"[AC]",
  B:"[CGT]", D:"[AGT]", H:"[ACT]", V:"[ACG]", N:"[ACGT]"
};

function siteToRegex(site) {
  var pattern = "";
  for (var i = 0; i < site.length; i++) {
    pattern += IUPAC_TO_REGEX[site[i].toUpperCase()] || site[i].toUpperCase();
  }
  return pattern;
}

function findRestrictionSites(dnaSeq, enzymes) {
  var upper = dnaSeq.toUpperCase();
  var results = [];
  for (var e = 0; e < enzymes.length; e++) {
    var enz = enzymes[e];
    var pattern = siteToRegex(enz.site);
    var re = new RegExp(pattern, "g");
    var positions = [];
    var match;
    while ((match = re.exec(upper)) !== null) {
      positions.push({ pos: match.index + 1, strand: "+", cutPos: match.index + enz.cut });
      re.lastIndex = match.index + 1; // allow overlapping
    }
    // Also search reverse complement
    var rcSite = reverseComplement(enz.site.toUpperCase());
    if (rcSite !== enz.site.toUpperCase()) {
      var rcPattern = siteToRegex(rcSite);
      var rcRe = new RegExp(rcPattern, "g");
      while ((match = rcRe.exec(upper)) !== null) {
        positions.push({ pos: match.index + 1, strand: "-", cutPos: match.index + (enz.site.length - enz.cut) });
        rcRe.lastIndex = match.index + 1;
      }
    }
    if (positions.length > 0) {
      positions.sort(function(a,b){ return a.pos - b.pos; });
      results.push({ name: enz.name, site: enz.site, cuts: positions.length, positions: positions });
    }
  }
  results.sort(function(a,b){ return a.name.localeCompare(b.name); });
  return results;
}

// =====================================================================
// SEQUENCE FORMAT CONVERTER
// =====================================================================

function toFasta(seq, title, lineWidth) {
  title = title || "Sequence";
  lineWidth = lineWidth || 60;
  var lines = [">" + title];
  for (var i = 0; i < seq.length; i += lineWidth) {
    lines.push(seq.slice(i, i + lineWidth));
  }
  return lines.join("\n");
}

function toUpperCase(seq) { return seq.toUpperCase(); }
function toLowerCase(seq) { return seq.toLowerCase(); }

function removeNumbers(seq) { return seq.replace(/[0-9]/g, ""); }
function removeSpaces(seq) { return seq.replace(/\s/g, ""); }
function removeNonSeq(seq) { return seq.replace(/[^A-Za-z*]/g, ""); }

// =====================================================================
// ALIGNMENT
// =====================================================================

function parseAlignment(text) {
  var blocks = text.split(/^>/gm).filter(Boolean);
  return blocks.map(function(block) {
    var nl = block.indexOf("\n");
    var title = block.slice(0, nl).trim().replace(/[<>]/g, "");
    var seq   = block.slice(nl).replace(/[^A-Za-z.\-]/g, "");
    return { title: title, seq: seq };
  });
}

function checkAlign(titles, sequences) {
  if (sequences.length < 2) return false;
  var len = sequences[0].length;
  for (var i = 0; i < sequences.length; i++) {
    if (!titles[i].trim() || !sequences[i].trim() || sequences[i].length !== len) return false;
  }
  return true;
}

// =====================================================================
// SHUFFLE & RANDOM
// =====================================================================

function shuffleSeq(seq) {
  var arr = seq.split("");
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
  return arr.join("");
}

function randomSeq(components, length) {
  var seq = "";
  for (var i = 0; i < length; i++) {
    seq += components[Math.floor(Math.random() * components.length)];
  }
  return seq;
}

// =====================================================================
// CODON TABLE PARSING
// =====================================================================

function parseCodonTable(tableText) {
  var entries = [];
  var lines = tableText.replace(/[^.]*\.\./, "").split(/[\r\n]+/);
  for (var i = 0; i < lines.length; i++) {
    var fields = lines[i].trim().split(/\s+/);
    if (fields.length >= 5) {
      var aa  = fields[0].charAt(0).toUpperCase() + fields[0].slice(1,3).toLowerCase();
      var cdn = fields[1].toLowerCase();
      var num = parseFloat(fields[2]);
      var pt  = parseFloat(fields[3]);
      var frac = parseFloat(fields[4]);
      if (/^[A-Z][a-z]{2}$/.test(aa) && /^[a-z]{3}$/.test(cdn)) {
        entries.push({ aa:aa, codon:cdn, number:num, perThou:pt, fraction:frac });
      }
    }
  }
  return entries;
}

// =====================================================================
// DNA MASS CALCULATOR
// =====================================================================

// Average MW of a dsDNA base pair ~ 660 Da
// Average MW of a ssDNA nucleotide ~ 330 Da
// Average MW of a ssRNA nucleotide ~ 340 Da

function dnaConversions(lengthBp, massUg, pmol, seqType) {
  // seqType: "dsDNA", "ssDNA", "ssRNA"
  var mwPerUnit;
  var unitLabel;
  if (seqType === "ssDNA") { mwPerUnit = 330; unitLabel = "nt"; }
  else if (seqType === "ssRNA") { mwPerUnit = 340; unitLabel = "nt"; }
  else { mwPerUnit = 660; unitLabel = "bp"; } // dsDNA default

  var mwTotal = lengthBp * mwPerUnit; // Da (g/mol)

  var results = {};
  results.mwDa = mwTotal;
  results.mwKDa = mwTotal / 1000;
  results.unitLabel = unitLabel;

  // If mass given, calculate pmol and copies
  if (massUg > 0) {
    var massG = massUg * 1e-6;
    var moles = massG / mwTotal;
    results.fromMass = {
      pmol: moles * 1e12,
      fmol: moles * 1e15,
      nmol: moles * 1e9,
      copies: moles * 6.022e23,
      massUg: massUg
    };
  }

  // If pmol given, calculate mass and copies
  if (pmol > 0) {
    var moles = pmol * 1e-12;
    var massG = moles * mwTotal;
    results.fromPmol = {
      ug: massG * 1e6,
      ng: massG * 1e9,
      copies: moles * 6.022e23,
      pmol: pmol
    };
  }

  return results;
}

// =====================================================================
// PRIMER DIMER CHECK
// =====================================================================

function checkPrimerDimer(primer1, primer2) {
  var p1 = primer1.toUpperCase();
  var p2 = primer2 ? primer2.toUpperCase() : p1; // self-dimer if no second primer
  var p2c = reverseComplement(p2).toUpperCase(); // reverse complement of primer2

  var results = [];
  var len1 = p1.length, len2 = p2c.length;

  // Slide p2c across p1 in all offsets
  for (var offset = -(len2 - 1); offset < len1; offset++) {
    var matches = 0;
    var matchStr1 = "";
    var matchStr2 = "";
    var bondStr = "";
    var start1 = Math.max(0, offset);
    var start2 = Math.max(0, -offset);
    var overlapLen = Math.min(len1 - start1, len2 - start2);

    if (overlapLen < 2) continue;

    for (var i = 0; i < overlapLen; i++) {
      var b1 = p1[start1 + i];
      var b2 = p2c[start2 + i];
      if (b1 === b2) {
        matches++;
        bondStr += "|";
      } else {
        bondStr += " ";
      }
    }

    if (matches < 3) continue;

    // Check if 3' end is involved (last 5 bases)
    var end3p1 = false, end3p2 = false;
    for (var i = 0; i < Math.min(5, overlapLen); i++) {
      var idx1 = start1 + overlapLen - 1 - i;
      var idx2 = start2 + overlapLen - 1 - i;
      if (idx1 >= len1 - 5 && p1[idx1] === p2c[idx2]) end3p1 = true;
      if (start2 + i < 5 && p1[start1 + i] === p2c[start2 + i]) end3p2 = true;
    }

    // Build visual alignment
    var pad1 = "", pad2 = "";
    if (offset > 0) { pad2 = ""; for (var i = 0; i < offset; i++) pad2 += " "; }
    else { pad1 = ""; for (var i = 0; i < -offset; i++) pad1 += " "; }

    var line1 = pad1 + "5'-" + p1 + "-3'";
    var bondLine = "";
    for (var i = 0; i < start1 + 3 + (offset < 0 ? -offset : 0); i++) bondLine += " ";
    bondLine += bondStr;
    var line2 = pad2 + "3'-" + p2.toUpperCase().split("").reverse().join("") + "-5'";

    // Compute score: matches weighted, bonus for 3' involvement
    var score = matches;
    if (end3p1 || end3p2) score += 5;

    // Calculate estimated Tm of the dimer (rough: 2*AT + 4*GC for matched region)
    var dimerAt = 0, dimerGc = 0;
    for (var i = 0; i < overlapLen; i++) {
      if (p1[start1 + i] === p2c[start2 + i]) {
        if (p1[start1 + i] === "A" || p1[start1 + i] === "T") dimerAt++;
        else dimerGc++;
      }
    }
    var dimerTm = 2 * dimerAt + 4 * dimerGc;

    results.push({
      matches: matches,
      overlap: overlapLen,
      end3: end3p1 || end3p2,
      score: score,
      dimerTm: dimerTm,
      line1: line1,
      bondLine: bondLine,
      line2: line2,
      offset: offset
    });
  }

  // Sort by score descending
  results.sort(function(a, b) { return b.score - a.score; });

  return results;
}

// =====================================================================
// PAIRWISE ALIGNMENT (Needleman-Wunsch / Smith-Waterman)
// =====================================================================

function pairwiseAlign(seq1, seq2, mode, matchScore, mismatchPen, gapPen) {
  mode = mode || "global"; // "global" (NW) or "local" (SW)
  matchScore = matchScore !== undefined ? matchScore : 2;
  mismatchPen = mismatchPen !== undefined ? mismatchPen : -1;
  gapPen = gapPen !== undefined ? gapPen : -2;

  var m = seq1.length;
  var n = seq2.length;

  // Init score matrix
  var score = [];
  var trace = []; // 0=done, 1=diag, 2=up, 3=left
  for (var i = 0; i <= m; i++) {
    score[i] = [];
    trace[i] = [];
    for (var j = 0; j <= n; j++) {
      score[i][j] = 0;
      trace[i][j] = 0;
    }
  }

  if (mode === "global") {
    for (var i = 1; i <= m; i++) { score[i][0] = i * gapPen; trace[i][0] = 2; }
    for (var j = 1; j <= n; j++) { score[0][j] = j * gapPen; trace[0][j] = 3; }
  }

  var maxScore = 0, maxI = 0, maxJ = 0;

  for (var i = 1; i <= m; i++) {
    for (var j = 1; j <= n; j++) {
      var s = (seq1[i-1].toUpperCase() === seq2[j-1].toUpperCase()) ? matchScore : mismatchPen;
      var diag = score[i-1][j-1] + s;
      var up   = score[i-1][j] + gapPen;
      var left = score[i][j-1] + gapPen;

      if (mode === "local") {
        var best = Math.max(0, diag, up, left);
        score[i][j] = best;
        if (best === 0) trace[i][j] = 0;
        else if (best === diag) trace[i][j] = 1;
        else if (best === up) trace[i][j] = 2;
        else trace[i][j] = 3;
        if (best > maxScore) { maxScore = best; maxI = i; maxJ = j; }
      } else {
        if (diag >= up && diag >= left) { score[i][j] = diag; trace[i][j] = 1; }
        else if (up >= left) { score[i][j] = up; trace[i][j] = 2; }
        else { score[i][j] = left; trace[i][j] = 3; }
      }
    }
  }

  // Traceback
  var align1 = "", align2 = "", midline = "";
  var ti, tj;
  if (mode === "local") { ti = maxI; tj = maxJ; }
  else { ti = m; tj = n; maxScore = score[m][n]; }

  while (ti > 0 || tj > 0) {
    if (mode === "local" && score[ti][tj] === 0) break;
    if (trace[ti][tj] === 1) {
      var c1 = seq1[ti-1], c2 = seq2[tj-1];
      align1 = c1 + align1;
      align2 = c2 + align2;
      midline = (c1.toUpperCase() === c2.toUpperCase() ? "|" : ".") + midline;
      ti--; tj--;
    } else if (trace[ti][tj] === 2) {
      align1 = seq1[ti-1] + align1;
      align2 = "-" + align2;
      midline = " " + midline;
      ti--;
    } else {
      align1 = "-" + align1;
      align2 = seq2[tj-1] + align2;
      midline = " " + midline;
      tj--;
    }
  }

  // Calc stats
  var matches = 0, mismatches = 0, gaps = 0;
  for (var i = 0; i < midline.length; i++) {
    if (midline[i] === "|") matches++;
    else if (midline[i] === ".") mismatches++;
    else gaps++;
  }
  var identity = align1.length > 0 ? (matches / align1.length * 100).toFixed(1) : "0.0";

  return {
    align1: align1, align2: align2, midline: midline,
    score: maxScore, matches: matches, mismatches: mismatches, gaps: gaps,
    identity: identity, length: align1.length
  };
}