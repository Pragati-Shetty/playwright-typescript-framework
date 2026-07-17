import{test,expect, Locator} from "@playwright/test";
test("Round trip flight booking from Bangalore to Dubai", async({page, context})=> {
  await page.goto('https://tickets.paytm.com/');
  await page.locator("//label[@id='rt']").click();
  const fromInput:Locator= page.locator("div[id='from'] span[class='hIbqG']");
    await fromInput.click();
    await page.locator("//input[@id='text-box']").fill("BLR");
    await page.locator("//div[normalize-space()='Bengaluru, Karnataka, India']").click();
    await page.locator("div[id='to'] span[class='hIbqG']").click();
    await page.locator("//input[@id='text-box']").fill("Dxb");
    await page.locator("//div[normalize-space()='Dubai International Airport']").click();
    await page.locator('div.ueycK').locator('span').nth(0).click(); //click on the depart label
    await page.locator("//div[@class='calendar__day calendar__activeDay']").click(); //click on the depart date
    await page.locator("(//div[contains(@class,'calendar__dayInDateRange') and .//div[normalize-space()='7']])[1]").click();//click on return date
    await page.locator("//span[@id='numPax' and normalize-space()='1 Traveller, Economy']").click();
    
const countAdult = page.locator("//div[@class='MAXnA']").nth(0);// target the count element
const addButtonAdult = page.locator("//div[@class='sbjB9']//div[1]//div[2]//div[3]//img[1]");//targetting add count button

while (parseInt(await countAdult.textContent()) < 4) {
  await addButtonAdult.click();
}

const countChild = page.locator("//div[@class='MAXnA']").nth(1);// target the count element for children
const addButtonChild = page.locator("img[alt='add-icon']").nth(1);//targetting add count button

while (parseInt(await countChild.textContent()) < 3) {
  await addButtonChild.click();
}

const countInfant = page.locator("//div[@class='MAXnA']").nth(2);// target the count element for infant
const addButtonInfant = page.locator("img[alt='add-icon']").nth(2);//targetting add count button for infant

while (parseInt(await countInfant.textContent()) < 2) {
  await addButtonInfant.click();
}

await page.locator("//div[@class='BlFv4' and normalize-space()='Done']").click();
await page.locator("//div[@class='PfNzo']").click();

await page.locator('span:has-text("Airlines")').click();
await page.locator("//div[@class='WGUhv m8euA']//span[@class='ZEm2Z'][normalize-space()='Air India']").click();
await page.locator("//img[@alt='Close Icon']").click();
await page.waitForTimeout(5000);

// Wait for new page to open
const page1Promise = context.waitForEvent('page');

// Click the button that opens new tab
await page.locator("//button[normalize-space()='Book Flights']").first().click();

// Get the new page
const page1 = await page1Promise;

// Wait until page loads
await page1.waitForLoadState();

// Perform actions on new tab
await page1.locator('section').nth(4).click();


// for Adult passengers
for (let i = 0; i < 4; i++) {

  await page1.locator(`//div[@class='e8e7U']//label[@id='MS-${i}-manual']`).click();

  if (i === 0) {
    await page1.locator(`//label[@id='${i}-label']//div[@class='CtciO thniI']//div//input[@name='firstname']`).fill("Pragati");
    await page1.locator(`//label[@id='${i}-label']//div[@class='CtciO thniI']//div//input[@name='lastname']`).fill("Shetty");
  }

  if (i === 1) {
    await page1.locator(`//label[@id='${i}-label']//div[@class='CtciO thniI']//div//input[@name='firstname']`).fill("Pooja Prakash");
    await page1.locator(`//label[@id='${i}-label']//div[@class='CtciO thniI']//div//input[@name='lastname']`).fill("Shetty");
  }

  if (i === 2) {
    await page1.locator(`//label[@id='${i}-label']//div[@class='CtciO thniI']//div//input[@name='firstname']`).fill("Jayashree");
    await page1.locator(`//label[@id='${i}-label']//div[@class='CtciO thniI']//div//input[@name='lastname']`).fill("Shetty");
  }

  if (i === 3) {
    await page1.locator(`//label[@id='${i}-label']//div//input[@name='firstname']`).fill("Prakash");
    await page1.locator(`//label[@id='${i}-label']//div//input[@name='lastname']`).fill("Shetty");
  }

  await page1.locator("//div[text()='Save Details']").first().click();
  await page1.waitForTimeout(2000);
}


//for child passengers
for (let i = 4; i <= 6; i++) {

  await page1.locator(`//div[@class='e8e7U']//label[@id='MS-${i}-manual']`).click();

  if (i === 4) {
    await page1.locator(`//label[@id='${i}-label']//div//input[@name='firstname']`).fill("Sumanth");
  }

  if (i === 5) {
    await page1.locator(`//label[@id='${i}-label']//div//input[@name='firstname']`).fill("Aadhya");
  }

  if (i === 6) {
    await page1.locator(`//label[@id='${i}-label']//div//input[@name='firstname']`).fill("Palavi");
  }

  await page1.locator(`//label[@id='${i}-label']//div//input[@name='lastname']`).fill("Shetty");

  await page1.locator(`//label[@id='${i}-label']//input[@placeholder='DD']`).fill("12");
  await page1.locator(`//label[@id='${i}-label']//input[@placeholder='MM']`).fill("08");
  await page1.locator(`//label[@id='${i}-label']//input[@placeholder='YYYY']`).fill("2020");

  await page1.locator("//div[text()='Save Details']").first().click();
  await page1.waitForTimeout(2000);
}

//for infant passenger
for (let i = 7; i <= 8; i++) {

  await page1.locator(`//div[@class='e8e7U']//label[@id='MS-${i}-manual']`).click();

  if (i === 7) {
    await page1.locator(`//label[@id='${i}-label']//div//input[@name='firstname']`).fill("Aradhya");
  }

  if (i === 8) {
    await page1.locator(`//label[@id='${i}-label']//div//input[@name='firstname']`).fill("Suman");
  }

  await page1.locator(`//label[@id='${i}-label']//div//input[@name='lastname']`).fill("Shetty");

  await page1.locator(`//label[@id='${i}-label']//input[@placeholder='DD']`).fill("12");
  await page1.locator(`//label[@id='${i}-label']//input[@placeholder='MM']`).fill("08");
  await page1.locator(`//label[@id='${i}-label']//input[@placeholder='YYYY']`).fill("2025");

  await page1.locator("//div[text()='Save Details']").first().click();
  await page1.waitForTimeout(2000);
}



await page1.locator('[name="mobile"]').fill("7788336633");
await page1.locator('[name="email"]').fill("pragati0@gmail.com");


const proceedBtn = page1.locator('button').filter({ hasText: 'Proceed To Pay' }).first();

await proceedBtn.click();

await page1.waitForTimeout(2000);
})