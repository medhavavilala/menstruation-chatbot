let chatbotData = {};

fetch("pain.json")
  .then(response => response.json())
  .then(json => {
    chatbotData = json;
  });

function addMessage(text, type) {

  const messages =
    document.getElementById("messages");

  const bubble =
    document.createElement("div");

  bubble.className = type;

  bubble.innerText = text;

  messages.appendChild(bubble);

  messages.scrollTop =
    messages.scrollHeight;

}

function findAnswer(userInput) {

  userInput =
    userInput.toLowerCase();

  for (const item of chatbotData.qa) {

    if (
      item.question
      .toLowerCase()
      .includes(userInput)
    ) {
      return item;
    }

    for (
      const trigger
      of item.triggers
    ) {

      if (
        userInput.includes(
          trigger.toLowerCase()
        )
      ) {

        return item;

      }

    }

  }

  return null;

}

function sendMessage() {

  const input =
    document
      .getElementById(
        "question"
      );

  const text =
    input.value.trim();

  if (!text) return;

  addMessage(
    text,
    "user"
  );

  const match =
    findAnswer(text);

  if (match) {

    addMessage(

`${match.answer}

⚠ ${chatbotData.global_disclaimer}`,

"bot"

);

  }

  else {

    addMessage(

`I'm not sure I understood.

Try asking:
• Why do cramps get worse at night?
• Why do I feel nauseous?
• Can dehydration worsen cramps?

${chatbotData.global_disclaimer}`,

"bot"

);

  }

  input.value = "";

}

document
.getElementById(
"question"
)
.addEventListener(
"keydown",
e => {

if (
e.key === "Enter"
) {

sendMessage();

}

});
