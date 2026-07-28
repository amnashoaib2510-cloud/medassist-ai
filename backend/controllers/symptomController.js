const { analyzeSymptoms } = require("../utils/symptomEngine");

// @desc   Analyze symptoms and return possible conditions + recommendation
// @route  POST /api/symptoms/check
exports.checkSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ message: "Please provide an array of symptoms" });
    }

    const result = analyzeSymptoms(symptoms);

    res.json({
      inputSymptoms: symptoms,
      ...result,
      disclaimer:
        "This is a preliminary, rule-based suggestion and not a medical diagnosis. Please consult a licensed doctor for accurate diagnosis.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
