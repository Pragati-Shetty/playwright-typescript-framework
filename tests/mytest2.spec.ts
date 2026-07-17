import { test, expect } from '@playwright/test';
import { url } from 'node:inspector';

test('verify page Url', async ({ page }) => {
  await page.goto('http://www.automationpractice.pl/index.php');
  let url: string = await page.url();
  console.log('Url:', url);
 await expect(page).toHaveURL(/automationpractice/);
});


// import { Page, Locator, expect } from "@playwright/test";
// export class HomePage {
//   private fromInput: Locator;
//   private toInput: Locator;
//   private travellerDropdown: Locator;
//   private nextButton: Locator;
//   private doneButton: Locator;
//   private searchButton: Locator;
//   private bookFlightButton: Locator;
//   private cityInput: Locator;
//   private departureDateInput: Locator;
//   private countAdult: Locator;
//   private addButtonAdult: Locator;
//   private countChild: Locator;
//   private addButtonChild: Locator;
//   private countInfant: Locator;
//   private addButtonInfant: Locator;
//   private specialFare: Locator;
//   private cheapestSort: Locator;
//   private dynamicFilter: Locator;
//   private spanLocator: Locator;
//   private selectAllArrival: Locator;

//   constructor(private page: Page) {
//     this.fromInput = page.locator("div[id='from'] span.hIbqG");
//     this.toInput = page.locator("div[id='to'] span.hIbqG");
//     this.travellerDropdown = page.locator("span#numPax");
//     this.nextButton = page.locator("//i[contains(@class,'zamAL')]");
//     this.doneButton = page.locator("//div[@class='BlFv4' and normalize-space()='Done']");
//     this.searchButton = page.locator("//div[normalize-space()='Search Flights']").nth(1);
//     this.bookFlightButton = page.locator("//button[text()='Book Flight']").first();
//     this.cityInput = page.locator("//input[@id='text-box']");
//     this.departureDateInput = page.locator("div.ueycK span.hIbqG");
//     this.countAdult = page.locator("//div[@class='MAXnA']").nth(0);
//     this.addButtonAdult = page.locator("//div[@class='sbjB9']//img[1]");
//     this.countChild = page.locator("//div[@class='MAXnA']").nth(1);
//     this.addButtonChild = page.locator("img[alt='add-icon']").nth(1);
//     this.countInfant = page.locator("//div[@class='MAXnA']").nth(2);
//     this.addButtonInfant = page.locator("img[alt='add-icon']").nth(2);
//     this.specialFare = page.locator("//div[@class='elGAs']");
//     this.cheapestSort = page.locator("//span[contains(.,'Cheapest')]").first();
//     this.dynamicFilter = page.locator("//label");
//     this.spanLocator = page.locator("span");
//     this.selectAllArrival = page.locator(`span:has-text("Select all")`).first();
//   }

//   async navigate() {
//     await this.page.goto("https://tickets.paytm.com/");
//     await this.page.waitForLoadState("domcontentloaded");
//   }

//   private async clickByText(locator: Locator, text: string) {
//     await locator.filter({ hasText: text }).first().click();
//   }

//   async searchCity(data: any) {
//     await this.fromInput.click();
//     await this.cityInput.fill(data.fromCity);
//     await this.page.locator(`//div[normalize-space()='${data.fromCityFull}']`).click();

//     await this.toInput.click();
//     await this.cityInput.fill(data.toCity);
//     await this.page.locator(`:text-is("${data.toCityFull}")`).click();
//   }

//   async selectDepartureDate(data: any) {
//     await this.departureDateInput.click();

//     while ((await this.page.locator(`//td[normalize-space()='${data.monthYear}']`).count()) === 0)
//       await this.nextButton.click();

//     await this.page.locator(
//       `//td[normalize-space()='${data.monthYear}']/ancestor::table//div[contains(@class,'calendar__day') and .//div[normalize-space()='${data.day}']]`
//     ).click();
//   }

//   private async incrementCount(countLocator: Locator, addButton: Locator, target: number) {
//     while (parseInt((await countLocator.textContent()) || "0") < target)
//       await addButton.click();
//   }

//   async selectTraveller(data: any) {
//     await this.travellerDropdown.click();

//     await this.incrementCount(this.countAdult, this.addButtonAdult, data.adults);
//     await this.incrementCount(this.countChild, this.addButtonChild, data.children);
//     await this.incrementCount(this.countInfant, this.addButtonInfant, data.infants);

//     await this.doneButton.click();

//     await this.clickByText(this.specialFare, data.special);

//     await this.searchButton.click();
//   }

//   async applyFilters(data: any) {

//     await this.cheapestSort.click();

//     await this.clickByText(this.dynamicFilter, data.filter);

//     if (data.airline) {

//       await this.clickByText(this.spanLocator, data.airline);
//       await this.page.waitForTimeout(300);

//       const airlineCards = this.page.locator(`//div[@class="amk5q"]`);

//       const count = await airlineCards.count();

//       console.log(`Total Flights Displayed For Airline (${data.airline}) : ${count}`);

//       for (let i = 0; i < count; i++) {

//         const airlineElement = airlineCards.nth(i);

//         await expect(airlineElement).toBeVisible();

//         const airlineText = await airlineElement.textContent();

//         expect(airlineText?.trim()).toBe(data.airline);

//         console.log(`✔ Flight ${i + 1} Airline Verified : ${airlineText}`);
//       }

//       console.log(`✔ Airline Filter Assertion Passed For All Flights`);
//       console.log("----------------------------------------------------------");
//     }

//     if (data.layover) {

// await this.clickByText(this.spanLocator, data.layover);

// const layoverCards = this.page.locator(`//span[contains(@class,"IFBh5") and contains(text(),"${data.layover}")]`);

// const count = await layoverCards.count();

// console.log(`Total Flights Found With Layover (${data.layover}) : ${count}`);

// for (let i = 0; i < count; i++) {

// const layoverElement = layoverCards.nth(i);

// await expect(layoverElement).toBeVisible();

// const layoverText = await layoverElement.textContent();

// expect(layoverText).toContain(data.layover);

// console.log(`✔ Flight ${i + 1} Layover Verified : ${layoverText}`);

// }

// console.log(`✔ Layover Filter Assertion Passed For All Flights`);
// console.log("----------------------------------------------------------");

// }

//     if (data.arrivalCity) {

// await this.selectAllArrival.click();

// await this.clickByText(this.spanLocator, data.arrivalCity);

// const arrivalCards = this.page.locator(`//div[@class="XrESd P7uBv"]//span[contains(text(),"${data.arrivalCity}")]`);

// const count = await arrivalCards.count();

// console.log(`Total Flights Found With Arrival Airport (${data.arrivalCity}) : ${count}`);

// for (let i = 0; i < count; i++) {

// const arrivalElement = arrivalCards.nth(i);

// await expect(arrivalElement).toBeVisible();

// const arrivalText = await arrivalElement.textContent();

// expect(arrivalText).toContain(data.arrivalCity);

// console.log(`✔ Flight ${i + 1} Arrival Airport Verified : ${arrivalText}`);

// }

// console.log(`✔ Arrival Airport Filter Assertion Passed For All Flights`);
// console.log("----------------------------------------------------------");
// }

//     if (data.stops) {

//       await this.clickByText(this.spanLocator, data.stops);

//       const stopCards = this.page.locator(`//div//span[contains(text(),"${data.stops}")]`);

//       const count = await stopCards.count();

//       console.log(`Total Flights Found With Stops Filter: ${count}`);

//       for (let i = 0; i < count; i++) {

//         const stopElement = stopCards.nth(i);

//         await expect(stopElement).toBeVisible();

//         const stopText = await stopElement.textContent();

//         expect(stopText).toContain(data.stops);

//         console.log(`✔ Flight ${i + 1} Stop Verified : ${stopText}`);
//       }

//       console.log(`✔ Stops Filter Assertion Passed For All Flights`);
//       console.log("----------------------------------------------------------");
//     }
//   }

//   async runAllSliders(data: any) {

//     const sliders = [
//       { name: "Price Slider", index: 0, locator: "div.NrZmc span:nth-child(2)", value: data.priceValue, type: "price", step: 2 },
//       { name: "Arrival Time Slider", index: 1, locator: "div[class='Zx_qJ'] span:nth-child(2) span:nth-child(1) span:nth-child(1)", value: data.arrivalTime, type: "time", step: 2 },
//       { name: "Flight Duration Slider", index: 2, locator: "//span[@role='text' and contains(@aria-label,'Upto')]", value: data.flightDuration, type: "duration", step: 2, nth: 0 },
//       { name: "Layover Duration Slider", index: 3, locator: "//span[@role='text' and contains(@aria-label,'Upto')]", value: data.layoverDuration, type: "duration", step: 3, nth: 1 },
//       { name: "Departure Time Slider", index: 4, locator: "div[id='departure-label'] div[class='Zx_qJ'] span:nth-child(2) span:nth-child(1)", value: data.departureDestinationTime, type: "time", step: 2 }
//     ];

//     for (const slider of sliders)
//       await this.dragSliderToValue(slider);
//   }

//   private async dragSliderToValue(config: any) {

//     const slider = this.page.locator('div.thumb.thumb-1[role="slider"]').nth(config.index);

//     const UIvalueLocator = config.nth !== undefined
//       ? this.page.locator(config.locator).nth(config.nth)
//       : this.page.locator(config.locator);

//     await slider.scrollIntoViewIfNeeded();

//     const box = await slider.boundingBox();

//     if (!box) return;

//     let startX = box.x + box.width / 2;

//     const startY = box.y + box.height / 2;

//     await this.page.mouse.move(startX, startY);

//     await this.page.mouse.down();

//     const targetValue = typeof config.value === "number"
//       ? config.value
//       : config.type === "time"
//         ? this.convertTimeToMinutes(config.value)
//         : this.convertDurationToMinutes(config.value);

//     for (let i = 0; i < 60; i++) {

//       startX -= config.step;

//       await this.page.mouse.move(startX, startY, { steps: 5 });

//       await this.page.waitForTimeout(50);

//       const currentText = await UIvalueLocator.textContent();

//       if (!currentText) continue;

//       const currentValue =
//         config.type === "price"
//           ? parseInt(currentText.replace(/[^\d]/g, ""))
//           : config.type === "time"
//             ? this.convertTimeToMinutes(currentText)
//             : this.convertDurationToMinutes(currentText);

//       if (currentValue <= targetValue) break;
//     }

//     await this.page.mouse.up();

//     const finalText = await UIvalueLocator.textContent();

//     console.log("--------------------------------------------------");
//     console.log(`Slider Name           : ${config.name}`);
//     console.log(`Slider Type           : ${config.type}`);
//     console.log(`Expected Value (JSON) : ${config.value}`);
//     console.log(`Actual UI Value       : ${finalText}`);
//     console.log(`✔ Assertion Passed`);
//     console.log(`Condition Verified: UI Value (${finalText}) <= Expected (${config.value})`);
//     console.log("--------------------------------------------------");
//   }

//   private convertTimeToMinutes(time: string): number {
//     const [hours, minutes] = time.split(":").map(Number);
//     return hours * 60 + minutes;
//   }

//   private convertDurationToMinutes(duration: string): number {
//     const hoursMatch = duration.match(/(\d+)h/);
//     const minutesMatch = duration.match(/(\d+)m/);
//     const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
//     const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
//     return hours * 60 + minutes;
//   }

//   async bookFlightAndNavigate() {
//     const pagePromise = this.page.context().waitForEvent("page");
//     await this.bookFlightButton.click();
//     const newPage = await pagePromise;
//     await newPage.waitForLoadState("domcontentloaded");
//     return newPage;
//   }
// }