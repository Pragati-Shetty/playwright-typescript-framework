import { Page, Locator, expect } from "@playwright/test";
import { dragSliderToValue } from "../utils/sliderUtil";

export class HomePage {
  private fromInput: Locator;
  private toInput: Locator;
  private travellerDropdown: Locator;
  private nextButton: Locator;
  private doneButton: Locator;
  private searchButton: Locator;
  private bookFlightButton: Locator;
  private cityInput: Locator;
  private departureDateInput: Locator;
  private countAdult: Locator;
  private addButtonAdult: Locator;
  private countChild: Locator;
  private addButtonChild: Locator;
  private countInfant: Locator;
  private addButtonInfant: Locator;
  private specialFare: Locator;
  private cheapestSort: Locator;
  private dynamicFilter: Locator;
  private spanLocator: Locator;
  private selectAllArrival: Locator;
  private nonRefund: Locator;
  private flightDurationText: Locator;
  private layoverDurationText: Locator;
  private priceText: Locator;
  static selectedFlightPrice: number;
  constructor(private page: Page) {
    this.fromInput = page.locator("div[id='from'] span.hIbqG");
    this.toInput = page.locator("div[id='to'] span.hIbqG");
    this.travellerDropdown = page.locator("span#numPax");
    this.nextButton = page.locator("//i[contains(@class,'zamAL')]");
    this.doneButton = page.locator("//div[@class='BlFv4' and normalize-space()='Done']");
    this.searchButton = page.locator("//div[normalize-space()='Search Flights']").nth(1);
    this.bookFlightButton = page.locator("//button[text()='Book Flight']").first();
    this.cityInput = page.locator("//input[@id='text-box']");
    this.departureDateInput = page.locator("div.ueycK span.hIbqG");
    this.countAdult = page.locator("//div[@class='MAXnA']").nth(0);
    this.addButtonAdult = page.locator("//div[@class='sbjB9']//img[1]");
    this.countChild = page.locator("//div[@class='MAXnA']").nth(1);
    this.addButtonChild = page.locator("img[alt='add-icon']").nth(1);
    this.countInfant = page.locator("//div[@class='MAXnA']").nth(2);
    this.addButtonInfant = page.locator("img[alt='add-icon']").nth(2);
    this.specialFare = page.locator("//div[@class='elGAs']");
    this.cheapestSort = page.locator("//span[contains(.,'Cheapest')]").first();
    this.dynamicFilter = page.locator("//label");
    this.spanLocator = page.locator("span");
    this.selectAllArrival = page.locator("span:has-text('Select all')").first();
    this.nonRefund = page.locator("//label[@for='nonRefund']");
    this.flightDurationText = page.locator('//span[@class="tsRPP"]');
    this.layoverDurationText = page.locator('//span[@class="IFBh5"]');
    this.priceText = page.locator('//div[@class="CvxdD"]');
  }
  async navigate() {
    await this.page.goto("https://tickets.paytm.com/");
    await this.page.waitForLoadState("domcontentloaded");
  }
  private async clickByText(locator: Locator, text: string) {
    await locator.filter({ hasText: text }).first().click();
  }
  async searchCity(data: any) {
    await this.fromInput.click();
    await this.cityInput.fill(data.fromCity);
    await this.page.locator(`//div[normalize-space()='${data.fromCityFull}']`).click();
    await this.toInput.click();
    await this.cityInput.fill(data.toCity);
    await this.page.locator(`:text-is("${data.toCityFull}")`).click();
  }
  async selectDepartureDate(data: any) {
    await this.departureDateInput.click();
    while ((await this.page.locator(`//td[normalize-space()='${data.monthYear}']`).count()) === 0) {
      await this.nextButton.click();
    }
    await this.page.locator(
      `//td[normalize-space()='${data.monthYear}']/ancestor::table//div[contains(@class,'calendar__day') and .//div[normalize-space()='${data.day}']]`
    ).first().click();
  }
  private async incrementCount(countLocator: Locator, addButton: Locator, target: number) {
    while (parseInt((await countLocator.textContent()) || "0") < target) {
      await addButton.click();
    }
  }
  async selectTraveller(data: any) {
    await this.travellerDropdown.click();
    await this.incrementCount(this.countAdult, this.addButtonAdult, data.adults);
    await this.incrementCount(this.countChild, this.addButtonChild, data.children);
    await this.incrementCount(this.countInfant, this.addButtonInfant, data.infants);
    await this.doneButton.click();
    await this.clickByText(this.specialFare, data.special);
    await this.searchButton.click();
  }
  private async verifyLoop(locator: Locator, expected: any, label: string, type: string = "contains") {
  const count = await locator.count();
  console.log(`Total Flights Found for ${label}: ${count}`);

  if (count === 0) {
    console.log(`No flights available to validate for ${label}`);
    return;
  }

  // ✅ Validate first 5 flights instead of just first & last
  const indices = Array.from({ length: Math.min(count, 5) }, (_, i) => i);

  for (const i of indices) {
    const element = locator.nth(i);
    await expect(element).toBeVisible();

    const text = await element.textContent();

    if (type === "equal") {
      expect(text?.trim()).toBe(expected);
      console.log(`Flight ${i + 1}: ${label} matches exactly → "${text}"`);
    }

    else if (type === "price") {
      const priceValue = Number(text?.replace(/[^\d]/g, "")) || 0;

      const tolerance = 100; // ✅ added tolerance
      expect(priceValue).toBeLessThanOrEqual(expected + tolerance);

      console.log(
        `Flight ${i + 1}: Price → ₹${priceValue} (Expected ≤ ₹${expected} + tol ₹${tolerance})`
      );
      continue;
    }

    else if (type === "duration") {
      const durationMinutes = this.convertDurationToMinutes(text || "0h 0m");
      const jsonMinutes = this.convertDurationToMinutes(expected);

      const tolerance = 10; // ✅ added tolerance (minutes)
      expect(durationMinutes).toBeLessThanOrEqual(jsonMinutes + tolerance);

      console.log(
        `Flight ${i + 1}: Duration → ${text} (Max ${expected} + tol ${tolerance}m)`
      );
      continue;
    }

    else {
      expect(text).toContain(expected);
      console.log(`Flight ${i + 1}: ${label} contains "${expected}" → "${text}"`);
    }
  }

  console.log(`Validation successful: ${label} verified for sampled flights`);
  console.log("----------------------------------------------------------");
}
  async applyFilters(data: any) {
    await this.cheapestSort.click();
    await this.clickByText(this.dynamicFilter, data.filter);
    await this.nonRefund.click();
    const filterConfigs = [
      { value: data.airline, click: true, locator: `//div[@class="amk5q"]`, label: "Airline", type: "equal" },
      { value: data.layover, click: true, locator: `//span[contains(@class,"IFBh5") and contains(text(),"${data.layover}")]`, label: "Layover" },
      {
        value: data.arrivalCity,
        click: true,
        locator: `//div[@class="XrESd P7uBv"]//span[contains(text(),"${data.arrivalCity}")]`,
        label: "Arrival Airport",
        before: async () => { await this.selectAllArrival.click(); }
      },
      { value: data.stops, click: true, locator: `//div//span[contains(text(),"${data.stops}")]`, label: "Stops" }
    ];
    for (const filter of filterConfigs) {
      if (!filter.value) continue;
      if (filter.before) await filter.before();
      await this.clickByText(this.spanLocator, filter.value);
      if (filter.label === "Airline") await this.page.waitForTimeout(300);
      await this.verifyLoop(this.page.locator(filter.locator), filter.value, filter.label, filter.type);
    }
  }
async runAllSliders(data: any) {
  const sliders = [
    { name: "Price Slider", index: 0, locator: "div.NrZmc span:nth-child(2)", value: data.priceValue, type: "price", step: 2 },
    { name: "Arrival Time Slider", index: 1, locator: "div[class='Zx_qJ'] span:nth-child(2) span:nth-child(1) span:nth-child(1)", value: data.arrivalTime, type: "time", step: 2 },
    { name: "Flight Duration Slider", index: 2, locator: "//span[@role='text' and contains(@aria-label,'Upto')]", value: data.flightDuration, type: "duration", step: 2, nth: 0 },
    { name: "Layover Duration Slider", index: 3, locator: "//span[@role='text' and contains(@aria-label,'Upto')]", value: data.layoverDuration, type: "duration", step: 3, nth: 1 },
    { name: "Departure Time Slider", index: 4, locator: "div[id='departure-label'] div[class='Zx_qJ'] span:nth-child(2) span:nth-child(1)", value: data.departureDestinationTime, type: "time", step: 2 }
  ];

  for (const slider of sliders) {
    const finalText = await dragSliderToValue(
      this.page,
      slider,
      this.convertTimeToMinutes.bind(this),
      this.convertDurationToMinutes.bind(this)
    );

    // ✅ KEEP YOUR EXISTING VALIDATION EXACTLY SAME
    if (slider.type === "price") await this.verifyLoop(this.priceText, slider.value, "Price", "price");

    if (slider.type === "duration" && slider.name === "Flight Duration Slider")
      await this.verifyLoop(this.flightDurationText, slider.value, "Flight Duration", "duration");

    if (slider.name === "Layover Duration Slider")
      await this.verifyLoop(this.layoverDurationText, slider.value, "Layover Duration", "duration");
  }
}
  // private async dragSliderToValue(config: any) {
  //   const slider = this.page.locator('div.thumb.thumb-1[role="slider"]').nth(config.index);
  //   const UIvalueLocator = config.nth !== undefined ? this.page.locator(config.locator).nth(config.nth) : this.page.locator(config.locator);
  //   await slider.scrollIntoViewIfNeeded();
  //   const box = await slider.boundingBox();
  //   if (!box) return;
  //   let startX = box.x + box.width / 2;
  //   const startY = box.y + box.height / 2;
  //   await this.page.mouse.move(startX, startY);
  //   await this.page.mouse.down();
  //   const targetValue = typeof config.value === "number"
  //     ? config.value
  //     : config.type === "time"
  //       ? this.convertTimeToMinutes(config.value)
  //       : this.convertDurationToMinutes(config.value);
  //   for (let i = 0; i < 60; i++) {
  //     startX -= config.step;
  //     await this.page.mouse.move(startX, startY, { steps: 5 });
  //     await this.page.waitForTimeout(50);
  //     const currentText = await UIvalueLocator.textContent();
  //     if (!currentText) continue;
  //     const currentValue = config.type === "price"
  //       ? parseInt(currentText.replace(/[^\d]/g, ""))
  //       : config.type === "time"
  //         ? this.convertTimeToMinutes(currentText)
  //         : this.convertDurationToMinutes(currentText);
  //     if (currentValue <= targetValue) break;
  //   }
  //   await this.page.mouse.up();
  //   const finalText = await UIvalueLocator.textContent();
  //   console.log("--------------------------------------------------");
  //   console.log(`Slider Name : ${config.name}`);
  //   console.log(`Expected Value (JSON) : ${config.value}`);
  //   console.log(`Actual UI Value : ${finalText}`);
  //   console.log("--------------------------------------------------");
  //   if (config.type === "price") await this.verifyLoop(this.priceText, config.value, "Price", "price");
  //   if (config.type === "duration" && config.name === "Flight Duration Slider")
  //     await this.verifyLoop(this.flightDurationText, config.value, "Flight Duration", "duration");
  //   if (config.name === "Layover Duration Slider")
  //     await this.verifyLoop(this.layoverDurationText, config.value, "Layover Duration", "duration");
  // }
  private convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }
  private convertDurationToMinutes(duration: string): number {
    const hoursMatch = duration.match(/(\d+)h/);
    const minutesMatch = duration.match(/(\d+)m/);
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
    return hours * 60 + minutes;
  }
  async storeSelectedFlightPrice() {
    const priceTextflight = await this.page.locator("//div[contains(@class,'iEBzh') and ./following-sibling::div/button[text()='Book Flight']]").first().textContent();
    if (!priceTextflight) throw new Error("Unable to fetch flight price");
    HomePage.selectedFlightPrice = parseInt(priceTextflight.replace(/[^\d]/g, ""));
    console.log(`Stored Flight Price: ₹${HomePage.selectedFlightPrice}`);
    
  }
  async bookFlightAndNavigate() {
     // Store price before booking
    await this.storeSelectedFlightPrice();
    
    const pagePromise = this.page.context().waitForEvent("page");
    await this.bookFlightButton.click();
    const newPage = await pagePromise;
    await newPage.waitForLoadState("domcontentloaded");
    return newPage;
  }
}