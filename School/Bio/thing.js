//define mappings between dna, mrna and amino acids
//this completely mitigates the need for a massive block of elifs
const DNAtoMRNA = {
  T: 'A', 
  A: 'U', 
  C: 'G', 
  G: 'C'
};

const aminoToRNA= {
  UUU: 'Phe', UUC: 'Phe', 
  UUA: 'Leu', UUG: 'Leu', CUU: 'Leu', CUC: 'Leu', CUA: 'Leu', CUG: 'Leu',  AUG: 'Leu', 
  AUU: 'Ile', AUC: 'Ile', AUA: 'Ile', 
  GUU: 'Val', GUC: 'Val', GUA: 'Val', GUG: 'Val', 
  UCU: 'Ser', UCC: 'Ser', UCA: 'Ser', UCG: 'Ser', AGU: 'Ser', AGC: 'Ser', 
  CCU: 'Pro', CCC: 'Pro', CCA: 'Pro', CCG: 'Pro', 
  ACU: 'Thr', ACC: 'Thr', ACA: 'Thr', ACG: 'Thr',
  GCU: 'Ala', GCC: 'Ala', GCA: 'Ala', GCG: 'Ala',
  UAU: 'Tyr', UAC: 'Tyr',
  UAA: 'Stop', UAG: 'Stop', UGA: 'Stop',
  CAU: 'His', CAC: 'His',
  CAA: 'Gln', CAG: 'Gln',
  AAU: 'Asn', AAC: 'Asn',
  AAA: 'Lys', AAG: 'Lys',
  GAU: 'Asp', GAC: 'Asp',
  GAA: 'Glu', GAG: 'Glu',
  UGU: 'Cys', UGC: 'Cys',
  UGG: 'Trp',
  CGU: 'Arp', CGC: 'Arp', CGA: 'Arp', CGG: 'Arp',
  AGA: 'Arg', AGG: 'Arg',
  GGU: 'Gly', GGC: 'Gly', GGA: 'Gly', GGG: 'Gly'
};

//define buffer vars
//var rawDNA = "tacgactgggtcatcgtacgctgggggatc";
var MRNAbuffer= "";
var aminoMapped= "";

//step 1: translation from dna to mrna sequence using defined mapping
//this function is called on button press, hence no need to explicitly run it 
function mrnaConv(){
  //define var rawDNA as the internal (entered) value of textbox element "dna_input"
  var rawDNA= document.getElementById("dna_input").value;
    
  //clearing vars
  MRNAbuffer= "";
  aminoMapped= "";

  for (var i=0; i < rawDNA.length; i++) {
    //appending to MRNAbuffer, after reading from rawDNA[i] using character as named index 
    MRNAbuffer+= DNAtoMRNA[rawDNA[i].toUpperCase()];
  }
  //return MRNAbuffer;
  //chaining next function
  toAmino();
}

//step 2: conversion from mrna to protein sequence
function toAmino(){
  for (var i=0; i < MRNAbuffer.length; i+=3) {
    //appending to aminoMapped, after extracting every 3 chars from str MRNAbuffer and used to index the mapping aminotoRNA
    aminoMapped+= aminoToRNA[MRNAbuffer.substr(i, 3)]+'\n';
  }
  console.log(aminoMapped);
  //now in context of the DOM, append a div and populate with result
  resultDiv= document.getElementById('result');
  document.getElementById('result').innerHTML = "";
  resultDiv.append("Result: "+aminoMapped);
}
