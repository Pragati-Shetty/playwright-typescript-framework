import{test,expect, Locator} from "@playwright/test";

test("One way flight booking from BLR to GOA", async({page,context})=>{
  await page.goto('https://tickets.paytm.com/');
 const fromInput:Locator= page.locator("div[id='from'] span[class='hIbqG']");
 await fromInput.click();
 await page.locator("//input[@id='text-box']").fill("BLR");
 await page.locator("//div[normalize-space()='Bengaluru, Karnataka, India']").click();
 await page.locator("div[id='to'] span[class='hIbqG']").click();
 await page.locator("//input[@id='text-box']").fill("Goa");
 await page.locator(':text-is("Goa Mopa, Goa, India")').click();
 await page.locator("div[class='ueycK'] span[class='hIbqG']").click();
 await page.locator("//div[@class='calendar__day calendar__activeDay']").click();
 await page.locator("//span[@id='numPax']").click();
 await page.locator("//div[@class='QkIqd']//div[2]//div[2]//div[3]//img[1]").dblclick();
 await page.locator("//div[@class='BlFv4']").click();
 await page.locator("//div[@class='PfNzo']").click();
  await page.waitForTimeout(3000);
  // Wait for new page to open
const page1Promise = context.waitForEvent('page');
// Click the button that opens new tab
 await page.locator("//button[text()='Book Flight']").first().click();
 // Get the new page
const page1 = await page1Promise;

// Wait until page loads
await page1.waitForLoadState();
//click on radiobutton
await page1.locator("//label[@id='none']").click();
await page1.waitForTimeout(3000);

await page1.waitForTimeout(3000);
await page1.locator("//div[@class='AIKNX']").nth(0).click();
await page1.waitForTimeout(3000);

for (let i = 0; i <= 2; i++) {

  // Title click (different prefix per index)
  if (i === 0) {
    await page1.locator(`//div[@class='e8e7U']//label[@id='MR-${i}-manual']`).click();
  }

  if (i === 1) {
    await page1.locator(`//div[@class='e8e7U']//label[@id='MSTR-${i}-manual']`).click();
  }

  if (i === 2) {
    await page1.locator(`//div[@class='e8e7U']//label[@id='MS-${i}-manual']`).click();
  }

  //  Firstname + Lastname
  if (i === 0) {
    await page1.locator(`//label[@id='${i}-label']//div[@class='CtciO thniI']//div//input[@name='firstname']`).fill("Prakash");
  }

  if (i === 1) {
    await page1.locator(`//label[@id='${i}-label']//div[@class='CtciO thniI']//div//input[@name='firstname']`).fill("Sumanth");
  }

  if (i === 2) {
    await page1.locator(`//label[@id='${i}-label']//div[@class='CtciO thniI']//div//input[@name='firstname']`).fill("Pragati");
  }

  await page1.locator(`//label[@id='${i}-label']//div[@class='CtciO thniI']//div//input[@name='lastname']`).fill("Shetty");


  //  DOB only for index 1 and 2
  if (i === 1 || i === 2) {

    await page1.locator(`//label[@id='${i}-label']//div[@class='LoLsZ']//div[@class='CtciO thniI']//div//section[@id='dob']//section[@class='q8JS8']//div//input[@placeholder='DD']`).fill("12");

    await page1.locator(`//label[@id='${i}-label']//div[@class='LoLsZ']//div[@class='CtciO thniI']//div//section[@id='dob']//section[@class='q8JS8']//div//input[@placeholder='MM']`).fill("08");
  }

  if (i === 1) {
    await page1.locator(`//label[@id='${i}-label']//div[@class='CtciO thniI']//div//input[@placeholder='YYYY']`).fill("2020");
  }

  if (i === 2) {
    await page1.locator(`//label[@id='${i}-label']//div[@class='CtciO thniI']//div//input[@placeholder='YYYY']`).fill("2023");
  }

  await page1.locator("//div[@class='pV2vY' and text()='Save Details']").first().click();
  await page1.waitForTimeout(3000);
}


await page1.locator('[name="mobile"]').fill("7788336633");
await page1.locator('[name="email"]').fill("pragati0@gmail.com");


const proceedBtn = page1.locator('button').filter({ hasText: 'Proceed To Pay' }).first();

await proceedBtn.click();
await page1.waitForTimeout(3000);
})
