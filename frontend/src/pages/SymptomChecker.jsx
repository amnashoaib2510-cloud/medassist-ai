import { useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";

const commonSymptoms = [
  "fever", "cough", "headache", "sore throat", "runny nose",
  "shortness of breath", "chest pain", "nausea", "vomiting",
  "diarrhea", "abdominal pain", "fatigue", "joint pain",
  "rash", "itching", "anxiety", "insomnia",
];

const SymptomChecker = () => {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleSymptom = (symptom) => {
    setSelected((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleCheck = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      const { data } = await api.post("/symptoms/check", { symptoms: selected });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        <h2 className="text-2xl font-bold mb-2">🤖 AI Symptom Checker</h2>
        <p className="text-sm text-slate-500 mb-6">
          Select the symptoms you're experiencing to get a preliminary suggestion.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {commonSymptoms.map((symptom) => (
            <button
              key={symptom}
              onClick={() => toggleSymptom(symptom)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                selected.includes(symptom)
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white/60 text-slate-700 border-slate-300 hover:border-primary-400"
              }`}
            >
              {symptom}
            </button>
          ))}
        </div>

        <button
          onClick={handleCheck}
          disabled={loading || selected.length === 0}
          className="btn-primary w-full"
        >
          {loading ? "Analyzing..." : "Check Symptoms"}
        </button>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-primary-50 rounded-xl"
          >
            <h3 className="font-semibold mb-2">Possible Conditions:</h3>
            <ul className="list-disc list-inside text-slate-700 mb-3">
              {result.possibleConditions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="font-medium text-primary-700">
              Recommendation: {result.recommendation}
            </p>
            <p className="text-xs text-slate-500 mt-3">{result.disclaimer}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SymptomChecker;
