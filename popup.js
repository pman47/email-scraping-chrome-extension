// Button
const scrapEmails = document.getElementById("scrapEmails");
const list = document.getElementById("emailList");
const emailContainer = document.getElementById("emailContainer");

scrapEmails.addEventListener("click", async () => {
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

// Handler to receive emails from content script
chrome.runtime.onMessage.addListener((request) => {
  list.innerHTML = "";
  // Get emails
  let emails = request.emails;

  // Display emails on popup
  if (emails === null || emails.length === 0) {
    let li = document.createElement("li");
    li.innerText = "No email found.";
    list.appendChild(li);
  } else {
    // Create a Set to store unique emails
    let uniqueEmailsSet = new Set();

    // Iterate through the emails array
    emails.forEach((email) => {
      if (!uniqueEmailsSet.has(email)) {
        uniqueEmailsSet.add(email);

        let li = document.createElement("li");
        li.innerText = email;
        list.appendChild(li);
      }
    });
  }
});
