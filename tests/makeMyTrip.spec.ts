import{test,expect} from "@playwright/test";
test("Book Flight", async ({page})=>{
await page.goto("https://www.makemytrip.com/");
await page.waitForTimeout(2000);
await page.locator('span.commonModal__close').click();
await page.getByRole('img', {name:'minimize'}).click();
await page.waitForTimeout(3000);
await page.locator("body").click();
await page.getByLabel('From').click();
await page.getByPlaceholder('From').fill('Bangalore');
await page.waitForTimeout(2000);
await page.getByText('Bengaluru, India').click()
await page.waitForTimeout(2000);
await page.getByLabel('ToBLR, Bengaluru International Airport India').click();
await page.getByPlaceholder('To').fill('Goa');
await page.getByText('Goa - Dabolim Airport, India').click();
await page.locator('p').filter({ hasText: '17' }).first().click();
})