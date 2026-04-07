/**
 * Calculates edge weight based on optimization preference
 * @param {Object} edge - { distance, traffic, safety }
 * @param {string} preference - 'fastest' | 'safest' | 'fuel'
 * @returns {number} composite weight
 */
function calcWeight(edge, preference = 'fastest') {
  const { distance, traffic, safety } = edge;
  const safetyPenalty = edge.safetyPenalty || 0; // from community reports

  switch (preference) {
    case 'fastest':
      // Prioritize low traffic
      return distance * (1 + traffic * 1.5);
    case 'safest':
      // Heavily penalize unsafe roads and community-reported hazards
      return distance * (1 + (1 - safety) * 2 + safetyPenalty);
    case 'fuel':
      // Minimize distance with moderate traffic consideration
      return distance * (1 + traffic * 0.5);
    default:
      return distance;
  }
}

module.exports = { calcWeight };
