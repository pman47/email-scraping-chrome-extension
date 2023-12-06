// Button
const scrapEmails = document.getElementById("scrapEmails");

scrapEmails.addEventListener("click", async () => {
  console.log("Clicked");

  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  // Execute script to parse emails on page

  chrome.scripting.executeScript({
    target: {
      tabId: tab.id,
    },
    func: scrapEmailsFromPage,
  });
});

// Function to scrap emails
function scrapEmailsFromPage() {
  // REGEX for email
  let emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  // Parsed emails from page
  const emails = document.body.innerHTML.match(emailRegex);

  // send emails to popup
  chrome.runtime.sendMessage({ emails });
}
