/**
 * Rule-based Symptom Checker Engine
 * -----------------------------------
 * This is a simple, transparent rule-based system that maps
 * combinations of symptoms to possible conditions and a
 * recommended type of specialist to consult.
 *
 * NOTE: This is NOT a medical diagnostic tool. It only provides
 * general, non-binding suggestions. It can later be swapped out
 * or enhanced with a real ML model / OpenAI API call without
 * changing the controller that calls it (see symptomController.js).
 */

const rules = [
  {
    symptoms: ["fever", "cough", "headache"],
    conditions: ["Common Cold", "Seasonal Flu"],
    recommendation: "Consult a General Physician",
  },
  {
    symptoms: ["fever", "cough", "shortness of breath"],
    conditions: ["Respiratory Infection", "Possible COVID-19"],
    recommendation: "Consult a Pulmonologist or General Physician urgently",
  },
  {
    symptoms: ["chest pain", "shortness of breath"],
    conditions: ["Cardiac Issue", "Angina"],
    recommendation: "Consult a Cardiologist immediately",
  },
  {
    symptoms: ["headache", "nausea", "sensitivity to light"],
    conditions: ["Migraine"],
    recommendation: "Consult a Neurologist",
  },
  {
    symptoms: ["joint pain", "swelling", "stiffness"],
    conditions: ["Arthritis"],
    recommendation: "Consult a Rheumatologist / Orthopedic Specialist",
  },
  {
    symptoms: ["rash", "itching", "redness"],
    conditions: ["Allergic Reaction", "Dermatitis"],
    recommendation: "Consult a Dermatologist",
  },
  {
    symptoms: ["abdominal pain", "vomiting", "diarrhea"],
    conditions: ["Gastroenteritis", "Food Poisoning"],
    recommendation: "Consult a Gastroenterologist / General Physician",
  },
  {
    symptoms: ["fatigue", "weight loss", "excessive thirst"],
    conditions: ["Possible Diabetes"],
    recommendation: "Consult an Endocrinologist",
  },
  {
    symptoms: ["sore throat", "cough", "runny nose"],
    conditions: ["Common Cold", "Viral Pharyngitis"],
    recommendation: "Consult a General Physician",
  },
  {
    symptoms: ["anxiety", "insomnia", "low mood"],
    conditions: ["Stress / Anxiety-related concerns"],
    recommendation: "Consult a Psychiatrist / Psychologist",
  },
];

/**
 * Given an array of user-entered symptoms (strings),
 * returns matched conditions and a recommendation.
 * Matching is based on overlap count with each rule.
 */
function analyzeSymptoms(userSymptoms = []) {
  const normalized = userSymptoms.map((s) => s.trim().toLowerCase());

  let bestMatch = null;
  let bestScore = 0;

  rules.forEach((rule) => {
    const overlap = rule.symptoms.filter((s) => normalized.includes(s)).length;
    if (overlap > bestScore) {
      bestScore = overlap;
      bestMatch = rule;
    }
  });

  if (!bestMatch || bestScore === 0) {
    return {
      possibleConditions: ["Unable to determine - insufficient symptom match"],
      recommendation: "Consult a General Physician for proper evaluation",
      matchedSymptoms: [],
    };
  }

  return {
    possibleConditions: bestMatch.conditions,
    recommendation: bestMatch.recommendation,
    matchedSymptoms: bestMatch.symptoms.filter((s) => normalized.includes(s)),
  };
}

module.exports = { analyzeSymptoms, rules };
