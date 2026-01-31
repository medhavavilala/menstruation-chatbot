let faqData = null; // will hold the JSON once loaded

// ==========================
// 1. LOAD JSON FILE
// ==========================
async function loadFAQData() {
  try {
    const response = await fetch("mood.json");
    faqData = await response.json();
    console.log("FAQ data loaded!");
  } catch (error) {
    console.error("Error loading FAQ data:", error);
  }
}

// Load immediately
loadFAQData();


// ==========================
// 2. TEXT NORMALIZATION
// ==========================
function normalize(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
}


// ==========================
// 3. SIMPLER SEARCH FUNCTION
// (no scoring, just matches)
// ==========================
function searchFAQ(userInput) {
  if (!faqData) return null;

  const query = normalize(userInput);
  const queryWords = query.split(" ");

  let results = [];

  faqData.topics.forEach(topic => {
    const topicTitle = normalize(topic.title);
    const topicKeywords = topic.keywords.map(k => normalize(k));

    topic.qa.forEach(item => {
      const question = normalize(item.question);
      const answer = normalize(item.answer);

      let isMatch = false;

      // Topic title match
      if (queryWords.some(word => topicTitle.includes(word))) {
        isMatch = true;
      }

      // Keyword match
      topicKeywords.forEach(keyword => {
        if (query.includes(keyword)) {
          isMatch = true;
        }
      });

      // Question text match
      queryWords.forEach(word => {
        if (question.includes(word)) {
          isMatch = true;
        }
      });

      // Answer text match
      queryWords.forEach(word => {
        if (answer.includes(word)) {
          isMatch = true;
        }
      });

      if (isMatch) {
        results.push({
          topic: topic.title,
          question: item.question,
          answer: item.answer
        });
      }
    });
  });

  return results.length ? results : null;
}


// ==========================
// 4. DISPLAY HANDLER
// ==========================
function handleUserSearch(inputText) {
  const matches = searchFAQ(inputText);

  if (!matches) {
    console.log(faqData.fallback.message);
    return;
  }

  console.log("Results:\n");
  matches.slice(0, 5).forEach(result => {
    console.log(`Topic: ${result.topic}`);
    console.log(`Q: ${result.question}`);
    console.log(`A: ${result.answer}`);
    console.log("------");
  });
}

