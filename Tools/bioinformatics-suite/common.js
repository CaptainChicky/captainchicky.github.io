// ═══════════════════════════════════════════════════════════════════════════════
// Sequence Manipulation Utilities
// ═══════════════════════════════════════════════════════════════════════════════

"use strict";

// ── Complement map (single lookup, handles IUPAC ambiguity codes) ────────────
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
  for (let i = 0; i < seq.length; i++) {
    out += COMP_MAP[seq[i]] || seq[i];
  }
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

const RE_NON_DNA        = /[^GATCNgatcn]/g;
const RE_NON_DNA_IUPAC  = /[^GATCNURYKMSWBDHVgatcnurykmswbdhv]/g;
const RE_NON_PROTEIN    = /[^ACDEFGHIKLMNPQRSTVWYZacdefghiklmnpqrstvwyz*]/g;
const RE_WHITESPACE_NUM = /[\s\d]/g;

function filterDna(seq)          { return seq.replace(RE_NON_DNA, "").toLowerCase(); }
function filterDnaSaveCase(seq)  { return seq.replace(RE_NON_DNA, ""); }
function filterDnaIupac(seq)     { return seq.replace(RE_NON_DNA_IUPAC, ""); }
function filterDnaLight(seq)     { return seq.replace(RE_WHITESPACE_NUM, "").toLowerCase(); }
function filterProtein(seq)      { return seq.replace(RE_NON_PROTEIN, "").toUpperCase(); }
function filterProteinSaveCase(s){ return s.replace(RE_NON_PROTEIN, ""); }

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

// legacy aliases
function removeFastaTitleDna(seq) {
  const p = parseFasta(seq);
  window._lastFastaTitle = p.title;
  return p.sequence;
}

function removeFastaTitleProtein(seq) {
  return removeFastaTitleDna(seq); // same logic
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
    // insert spaces every groupSize chars
    let grouped = "";
    for (let j = 0; j < chunk.length; j += groupSize) {
      grouped += (j > 0 ? " " : "") + chunk.slice(j, j + groupSize);
    }
    lines.push(num + " " + grouped);
  }
  return lines.join("\n");
}

// ── Translation helpers ──────────────────────────────────────────────────────

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

function translate(dnaSeq, frame, geneticCode) {
  frame = frame || 0;
  geneticCode = geneticCode || STANDARD_CODE;
  let protein = "";
  const upper = dnaSeq.toUpperCase().replace(/U/g, "T");
  for (let i = frame; i <= upper.length - 3; i += 3) {
    const codon = upper.slice(i, i + 3);
    protein += geneticCode[codon] || "X";
  }
  return protein;
}

// ── Alignment helpers ────────────────────────────────────────────────────────

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

// ── Regex/restriction enzyme helpers ─────────────────────────────────────────

function complementExp(expr) {
  const body = expr.match(/\/(.+)\//);
  const flags = expr.match(/[a-z]+$/);
  if (!body) return expr;
  let s = body[1];
  s = s.replace(/[GATCgatc]/g, ch => COMP_MAP[ch] || ch);
  return "/" + s + "/" + (flags ? flags[0] : "");
}

function reverseExp(expr) {
  const m = expr.match(/^\/(.+)\/([a-z]*)$/);
  if (!m) return expr;
  let body = m[1];
  const flags = m[2];
  // reverse while swapping brackets
  let rev = "";
  for (let i = body.length - 1; i >= 0; i--) {
    const ch = body[i];
    if (ch === "[") rev += "]";
    else if (ch === "]") rev += "[";
    else rev += ch;
  }
  return "/" + rev + "/" + flags;
}

function palinCheck(expr) {
  const normal = toMinimum(expr);
  const rc = complementExp(reverseExp(normal));
  return normal === rc;
}

function toMinimum(expr) {
  // Normalise bracket contents to canonical order: g, a, t, c, n
  return expr.replace(/\[([^\]]+)\]/g, (_, inner) => {
    const order = "gatcn";
    let sorted = "";
    for (const ch of order) {
      if (inner.toLowerCase().includes(ch)) sorted += ch;
    }
    return "[" + sorted + "]";
  });
}

function handleN(expr) {
  return expr.replace(/\[gatc\]/g, "[gatcn]");
}

// ── Shuffle ──────────────────────────────────────────────────────────────────

function shuffleSeq(seq) {
  const arr = seq.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

// ── Random sequence ──────────────────────────────────────────────────────────

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
