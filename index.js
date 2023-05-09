const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const cron = require("node-cron");

const start = async () => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.goto("https://learnwebcode.github.io/practice-requests/");

  // ----------------- SCREEN SHOT WEBPAGE
  // screenshot web page
  // await page.screenshot({ path: "test_screenshot.png" });
  // screenshot full view web page
  // await page.screenshot({ path: "test_screenshot.png", fullPage: true });
  // -----------------

  // ----------------- WRITE FILE CONTENT BY CONTEXT
  const names = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".info strong")).map(
      (x) => x.textContent
    );
  });
  await fs.writeFile("names.txt", names.join("\r\n"));
  // -----------------

  // ----------------- GET SOMETHING AFTER CLICK A BUTTON
  await page.click("#clickme");
  const clickedData = await page.$eval("#data", (el) => el.textContent);
  // -----------------

  console.log(clickedData);

  // ----------------- GET IMAGE BY PUPPETEER
  const photos = await page.$$eval("img", (imgs) => {
    return imgs.map((x) => x.src);
  });

  // ----------------- FIELD VALUE FOR INPUT FORM
  // field value "blue" for element with id "ourfield"
  await page.type("#ourfield", "blue");
  // waitting click on button and then page navigate
  await Promise.all([page.click("#ourform button"), page.waitForNavigation()]);

  const info = await page.$eval("#message", (el) => el.textContent);

  console.log(info);

  for (const photo of photos) {
    const imagePage = await page.goto(photo);
    await fs.writeFile(photo.split("/").pop(), await imagePage.buffer());
  }

  await browser.close();
};

// ----------------- SETTIME FOR LOOP -> 5 seconds
// cron.schedule("*/5 * * * * *", start);
start();
