// ═══════════════════════════════════════════════════════════════════════════════
// Sequence Manipulation Utilities
// ═══════════════════════════════════════════════════════════════════════════════

"use strict";

// ── Complement map (handles IUPAC ambiguity codes) ───────────────────────────
const COMP_MAP = Object.freeze({
  G:"C", A:"T", T:"A", C:"G", N:"N",
  g:"c", a:"t", t:"a", c:"g", n:"n",
  R:"Y", Y:"R", K:"M", M:"K", S:"S", W:"W",
  B:"V", V:"B", D:"H", H:"D",
  r:"y", y:"r", k:"m", m:"k", s:"s", w:"w",
  b:"v", v:"b", d:"h", h:"d",
  U:"A", u:"a"
});

// ── Core sequence ops ────────────────────────────────────────────────────────

function complement(seq) {
  let out = "";
  for (let i = 0; i < seq.length; i++) out += COMP_MAP[seq[i]] || seq[i];
  return out;
}

function reverseStr(seq) {
  let out = "";
  for (let i = seq.length - 1; i >= 0; i--) out += seq[i];
  return out;
}

function reverseComplement(seq) {
  return reverseStr(complement(seq));
}

// ── Filters ──────────────────────────────────────────────────────────────────

function filterDna(seq)          { return seq.replace(/[^GATCNgatcn]/g, "").toLowerCase(); }
function filterDnaSaveCase(seq)  { return seq.replace(/[^GATCNgatcn]/g, ""); }
function filterProtein(seq)      { return seq.replace(/[^ACDEFGHIKLMNPQRSTVWYZacdefghiklmnpqrstvwyz*]/g, "").toUpperCase(); }
function filterProteinSaveCase(s){ return s.replace(/[^ACDEFGHIKLMNPQRSTVWYZacdefghiklmnpqrstvwyz*]/g, ""); }

// ── FASTA parsing ────────────────────────────────────────────────────────────

function parseFasta(raw) {
  let title = "";
  const headerMatch = raw.match(/^>([^\r\n]+)/m);
  if (headerMatch) {
    title = headerMatch[1].trim().replace(/[<>]/g, "").replace(/\s{2,}/g, " ");
  }
  const sequence = raw.replace(/^>.*$/gm, "").trim();
  return { title, sequence };
}

// ── Validation ───────────────────────────────────────────────────────────────

function verifyDna(seq) {
  return !/[^gatcn\s]/i.test(seq);
}

function verifyProtein(seq) {
  return !/[^acdefghiklmnpqrstvwyz*\s]/i.test(seq);
}

// ── Statistics ───────────────────────────────────────────────────────────────

function seqStats(seq) {
  const len = seq.length;
  if (len === 0) return { len:0, a:0, t:0, g:0, c:0, n:0, gc:"0.0", at:"0.0" };
  let a=0, t=0, g=0, c=0, n=0;
  for (let i = 0; i < len; i++) {
    switch (seq[i].toUpperCase()) {
      case "A": a++; break;
      case "T": case "U": t++; break;
      case "G": g++; break;
      case "C": c++; break;
      default:  n++; break;
    }
  }
  return {
    len, a, t, g, c, n,
    gc: ((g + c) / len * 100).toFixed(1),
    at: ((a + t) / len * 100).toFixed(1)
  };
}

// ── Formatting ───────────────────────────────────────────────────────────────

function formatSeq(seq, width) {
  width = width || 60;
  const lines = [];
  for (let i = 0; i < seq.length; i += width) {
    lines.push(seq.slice(i, i + width));
  }
  return lines.join("\n");
}

function formatSeqNumbered(seq, width, groupSize) {
  width = width || 60;
  groupSize = groupSize || 10;
  const lines = [];
  for (let i = 0; i < seq.length; i += width) {
    const chunk = seq.slice(i, i + width);
    const num = String(i + 1).padStart(8, " ");
    let grouped = "";
    for (let j = 0; j < chunk.length; j += groupSize) {
      grouped += (j > 0 ? " " : "") + chunk.slice(j, j + groupSize);
    }
    lines.push(num + " " + grouped);
  }
  return lines.join("\n");
}

// ── Translation & Genetic Codes ───────────────────────────────────────────────

const STANDARD_CODE = {
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

// Build alternate codes from standard + diffs
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
    var codon = upper.slice(i, i + 3);
    protein += geneticCode[codon] || "X";
  }
  return protein;
}

// Translate and return per-codon data for ORF highlighting
function translateDetailed(dnaSeq, frame, geneticCode) {
  geneticCode = geneticCode || STANDARD_CODE;
  var upper = dnaSeq.toUpperCase().replace(/U/g, "T");
  var codons = [];
  for (var i = frame; i <= upper.length - 3; i += 3) {
    var codon = upper.slice(i, i + 3);
    var aa = geneticCode[codon] || "X";
    codons.push({ codon: dnaSeq.slice(i, i + 3), aa: aa, pos: i });
  }
  return codons;
}

// Find ORFs: runs of amino acids from M to * (inclusive)
function findOrfs(codonData, minLength) {
  minLength = minLength || 1;
  var orfs = [];
  var start = -1;
  for (var i = 0; i < codonData.length; i++) {
    if (codonData[i].aa === "M" && start === -1) {
      start = i;
    } else if (codonData[i].aa === "*" && start !== -1) {
      var len = i - start + 1;
      if (len >= minLength) {
        orfs.push({ start: start, end: i, length: len });
      }
      start = -1;
    }
  }
  return orfs;
}

// Translate all 6 frames, return array of { label, codonData, orfs }
function translateAllFrames(dnaSeq, geneticCode) {
  var results = [];
  var rc = reverseComplement(dnaSeq);
  for (var f = 0; f < 3; f++) {
    var cd = translateDetailed(dnaSeq, f, geneticCode);
    results.push({
      label: "5'→3' Frame " + (f + 1),
      codonData: cd,
      orfs: findOrfs(cd)
    });
  }
  for (var f = 0; f < 3; f++) {
    var cd = translateDetailed(rc, f, geneticCode);
    results.push({
      label: "3'→5' Frame " + (f + 1),
      codonData: cd,
      orfs: findOrfs(cd)
    });
  }
  return results;
}

// ── Alignment ────────────────────────────────────────────────────────────────

function parseAlignment(text) {
  const blocks = text.split(/^>/gm).filter(Boolean);
  return blocks.map(block => {
    const nl = block.indexOf("\n");
    const title = block.slice(0, nl).trim().replace(/[<>]/g, "");
    const seq   = block.slice(nl).replace(/[^A-Za-z.\-]/g, "");
    return { title, seq };
  });
}

function checkAlign(titles, sequences) {
  if (sequences.length < 2) return false;
  const len = sequences[0].length;
  for (let i = 0; i < sequences.length; i++) {
    if (!titles[i].trim() || !sequences[i].trim() || sequences[i].length !== len) return false;
  }
  return true;
}

// ── Shuffle & Random ─────────────────────────────────────────────────────────

function shuffleSeq(seq) {
  const arr = seq.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

function randomSeq(components, length) {
  let seq = "";
  for (let i = 0; i < length; i++) {
    seq += components[Math.floor(Math.random() * components.length)];
  }
  return seq;
}

// ── Codon table parsing ─────────────────────────────────────────────────────

function parseCodonTable(tableText) {
  const entries = [];
  const lines = tableText.replace(/[^.]*\.\./, "").split(/[\r\n]+/);
  for (const line of lines) {
    const fields = line.trim().split(/\s+/);
    if (fields.length >= 5) {
      const aa   = fields[0].charAt(0).toUpperCase() + fields[0].slice(1,3).toLowerCase();
      const cdn  = fields[1].toLowerCase();
      const num  = parseFloat(fields[2]);
      const pt   = parseFloat(fields[3]);
      const frac = parseFloat(fields[4]);
      if (/^[A-Z][a-z]{2}$/.test(aa) && /^[a-z]{3}$/.test(cdn)) {
        entries.push({ aa, codon: cdn, number: num, perThou: pt, fraction: frac });
      }
    }
  }
  return entries;
}