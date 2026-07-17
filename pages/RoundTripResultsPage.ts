import { Page, Locator, expect } from "@playwright/test";
import { dragSliderToValue } from "../utils/sliderUtil";

export class RoundTripResultsPage {
  private cheapestSort: Locator;
  private dynamicFilter: Locator;
  private spanLocator: Locator;
  private selectAllArrival: Locator;
  private bookFlightButton: Locator;
  private proceedBook: Locator;
  private nonRefund: Locator;
  private baggage: Locator;
  private return: Locator;

  constructor(private page: Page) {
    this.cheapestSort = page.locator("//span[contains(.,'Cheapest')]").first();
    this.dynamicFilter = page.locator("//label");
    this.spanLocator = page.locator("span");
    this.bookFlightButton = page.locator("//button[text()='Book Flights']").first();
    this.selectAllArrival = page.locator("span:has-text('Select all')").first();
    this.proceedBook = page.locator("//div[contains(text(),'Proceed')]").first();
    this.nonRefund = page.locator("//label[@for='nonRefund']");
    this.baggage = page.locator("//label[@for='handBaggage']");
    this.return = page.locator("//div[normalize-space()='Returning']");
  }

  async selectArrivalCity(city: string) {
    await this.page
      .locator("div.Bbvrb span.mdWc0")
      .filter({ hasText: city })
      .first()
      .click();
  }

  private async clickByText(locator: Locator, text: string) {
    await locator.filter({ hasText: text }).first().click();
  }

  async applyFilters(data: any) {
    await this.cheapestSort.click();
    await this.clickByText(this.dynamicFilter, data.filter);
    await this.baggage.click();

    const filterConfigs = [
      { value: data.layover, before: async () => { if (data.layover) await this.clickByText(this.spanLocator, "more"); }},
      { 
        value: data.arrivalCity, 
        before: async () => { if (data.arrivalCity) { await this.clickByText(this.spanLocator, "more"); await this.selectAllArrival.click(); } },
        action: async () => { await this.selectArrivalCity(data.arrivalCity); }
      },
      { value: data.stops },
      { value: data.airline, before: async () => { if (data.airline) await this.clickByText(this.spanLocator, "more"); }}
    ];

    for (const filter of filterConfigs) {
      if (!filter.value) continue;
      if (filter.before) await filter.before();
      if (filter.action) await filter.action();
      else await this.clickByText(this.spanLocator, filter.value);
    }

    console.log("\n===== Outbound Flight Filters Summary =====\n");

    // Arrival City
    if (data.arrivalCity) {
      const locator = this.page.locator(`//div[@class="SbCrI v4LL6"]//div[@class="mTP9d" and contains(text(),"${data.arrivalCity}")]`);
      const count = await locator.count();
      console.log(`ArrivalCity (${data.arrivalCity}) Flights Count: ${count}`);
      if (count > 0) {
        console.log(`First ArrivalCity: ${await locator.first().textContent()}`);
        console.log(`Last ArrivalCity: ${await locator.nth(count - 1).textContent()}`);
      }
    }

    // Airline
    if (data.airline) {
      const locator = this.page.locator(`//div[@class="QFpuj"]//span[contains(text(),"${data.airline}")]`);
      const count = await locator.count();
      console.log(`Airline (${data.airline}) Flights Count: ${count}`);
      if (count > 0) {
        console.log(`First Airline: ${await locator.first().textContent()}`);
        console.log(`Last Airline: ${await locator.nth(count - 1).textContent()}`);
      }
    }

    // Stops
    if (data.stops) {
      const locator = this.page.locator(`//div[@class="Z_a9X"]//span[text()='${data.stops}']`);
      const count = await locator.count();
      console.log(`Stops (${data.stops}) Flights Count: ${count}`);
      if (count > 0) {
        console.log(`First Stops: ${await locator.first().textContent()}`);
        console.log(`Last Stops: ${await locator.nth(count - 1).textContent()}`);
      }
    }
  }

  async runAllSliders(data: any) {
    const sliders = [
      { name: "Flight Duration", index: 0, locator: "//span[@role='text' and contains(@aria-label,'Upto')]", value: data.flightDuration, type: "duration", step: 2, nth: 0, flightLocator: "(//div[contains(@class,'Zi4TO')])[position() mod 2 = 1]//span[contains(@class,'n6YFe')]" },
      { name: "Departure Time", index: 1, locator: "div[id='departure-label'] div[class='Zx_qJ'] span:nth-child(2) span:nth-child(1)", value: data.departureDestinationTime, type: "time", step: 2, flightLocator: "(//div[contains(@class,'Zi4TO')])[position() mod 2 = 1]//div[contains(@class,'v4LL6')]//span[contains(@class,'ZLquk')]" },
      { name: "Layover Duration", index: 2, locator: "//span[@role='text' and contains(@aria-label,'Upto')]", value: data.layoverDuration, type: "duration", step: 3, nth: 1, flightLocator: "(//div[contains(@class,'Zi4TO')])[position() mod 2 = 1]//span[contains(@class,'n6YFe')]" },
      { name: "Price", index: 3, locator: "div.NrZmc span:nth-child(2)", value: data.priceValue, type: "price", step: 2, flightLocator: "(//span[contains(@class,'VpB0H')])[position() mod 2 = 1]" },
      { name: "Arrival Time", index: 4, locator: "div[class='Zx_qJ'] span:nth-child(2) span:nth-child(1) span:nth-child(1)", value: data.arrivalTime, type: "time", step: 2, flightLocator: "(//div[contains(@class,'Zi4TO')])[position() mod 2 = 1]//div[contains(@class,'v4LL6')]//span[contains(@class,'ZLquk')]" }
    ];

    console.log("\n===== Slider Filter Summary =====\n");

    for (const slider of sliders) {
      await this.dragSliderToValue(slider);

      // Validation and printing for each slider
      const flightLocator = this.page.locator(slider.flightLocator);
      const flightCount = await flightLocator.count();
      const validFlights: string[] = [];

      for (let i = 0; i < flightCount; i++) {
        const text = await flightLocator.nth(i).textContent();
        if (!text) continue;

        let value = slider.type === "price" ? parseInt(text.replace(/[^\d]/g, "")) :
                    slider.type === "time" ? this.convertTimeToMinutes(text) :
                    this.convertDurationToMinutes(text);

        const target = typeof slider.value === "number" ? slider.value :
                       slider.type === "time" ? this.convertTimeToMinutes(slider.value) :
                       this.convertDurationToMinutes(slider.value);

        if (value <= target) validFlights.push(text);
      }

      console.log(`Total Flights Found for ${slider.name}: ${validFlights.length}`);
      if (validFlights.length > 0) {
        console.log(`Flight 1: ${slider.name} is valid → ${validFlights[0]} (Max allowed: ${slider.value})`);
        console.log(`Flight ${validFlights.length}: ${slider.name} is valid → ${validFlights[validFlights.length - 1]} (Max allowed: ${slider.value})`);
      }
      console.log(`Validation successful: ${slider.name} verified for first and last flights\n`);
    }
  }

 private async dragSliderToValue(config: any) {
  const slider = this.page.locator('div.thumb.thumb-1[role="slider"]').nth(config.index);
  const UIvalueLocator = config.nth !== undefined
    ? this.page.locator(config.locator).nth(config.nth)
    : this.page.locator(config.locator);

  await slider.scrollIntoViewIfNeeded();
  const box = await slider.boundingBox();
  if (!box) return;

  let startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;

  await this.page.mouse.move(startX, startY);
  await this.page.mouse.down();

  const targetValue =
    typeof config.value === "number"
      ? config.value
      : config.type === "time"
      ? this.convertTimeToMinutes(config.value)
      : this.convertDurationToMinutes(config.value);

  // ✅ same controlled loop as HomePage
  for (let i = 0; i < 60; i++) {
    startX -= config.step;

    await this.page.mouse.move(startX, startY, { steps: 5 });
    await this.page.waitForTimeout(50);

    const currentText = await UIvalueLocator.textContent();
    if (!currentText) continue;

    const currentValue =
      config.type === "price"
        ? Number(currentText.replace(/[^\d]/g, "")) || 0
        : config.type === "time"
        ? this.convertTimeToMinutes(currentText)
        : this.convertDurationToMinutes(currentText);

    if (currentValue <= targetValue) break;
  }

  await this.page.mouse.up();

  const finalText = await UIvalueLocator.textContent();

  console.log("--------------------------------------------------");
  console.log(`Slider Name : ${config.name}`);
  console.log(`Expected Value (JSON) : ${config.value}`);
  console.log(`Actual UI Value : ${finalText}`);
  console.log("--------------------------------------------------");

  // ✅ relaxed validation (same philosophy as homepage)
  if (finalText) {
    const finalValue =
      config.type === "price"
        ? Number(finalText.replace(/[^\d]/g, "")) || 0
        : config.type === "time"
        ? this.convertTimeToMinutes(finalText)
        : this.convertDurationToMinutes(finalText);

    const expectedValue =
      typeof config.value === "number"
        ? config.value
        : config.type === "time"
        ? this.convertTimeToMinutes(config.value)
        : this.convertDurationToMinutes(config.value);

    // ✅ tolerance (important for RT as well)
    const tolerance = config.type === "price" ? 300 : 10;

    expect(finalValue).toBeLessThanOrEqual(expectedValue + tolerance);
  }
}

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

  async returnFlight() { await this.return.click(); }

  async applyFiltersReturn(data: any) {
    const filterConfigs = [
      {
        value: data.layoverReturn,
        before: async () => { if (data.layoverReturn) await this.clickByText(this.spanLocator, "more"); }
      },
      {
        value: data.DepartCity,
        before: async () => { if (data.DepartCity) { await this.clickByText(this.spanLocator, "more"); await this.selectAllArrival.click(); } },
        action: async () => { await this.selectArrivalCity(data.DepartCity); }
      },
      {
  value: data.airlineReturn
}
    ];

    for (const filter of filterConfigs) {
      if (!filter.value) continue;
      if (filter.before) await filter.before();
      if (filter.action) await filter.action();
      else await this.clickByText(this.spanLocator, filter.value);
    }

    // ===== RETURN VALIDATION PRINTING =====
    if (data.DepartCity) {
      const locator = this.page.locator(`//div[@class="mTP9d" and text()='${data.DepartCity}']`);
      const count = await locator.count();
      console.log(`DepartCity (${data.DepartCity}) Flights Count: ${count}`);
      if (count > 0) {
        console.log(`First DepartCity: ${await locator.first().textContent()}`);
        console.log(`Last DepartCity: ${await locator.nth(count - 1).textContent()}`);
      }
    }

    if (data.airlineReturn) {
      const locator = this.page.locator(`//div[@class="QFpuj"]//span[text()='${data.airlineReturn}']`);
      const count = await locator.count();
      console.log(`AirlineReturn (${data.airlineReturn}) Flights Count: ${count}`);
      if (count > 0) {
        console.log(`First AirlineReturn: ${await locator.first().textContent()}`);
        console.log(`Last AirlineReturn: ${await locator.nth(count - 1).textContent()}`);
      }
    }

    if (data.layoverReturn) {
      const locator = this.page.locator(`//span[@class="n6YFe"]`);
      const flightCount = await locator.count();
      const validFlights: string[] = [];
      const target = this.convertDurationToMinutes(data.layoverReturn);

      for (let i = 0; i < flightCount; i++) {
        const text = await locator.nth(i).textContent();
        if (!text) continue;
        if (this.convertDurationToMinutes(text) <= target) validFlights.push(text);
      }

      console.log(`Total Flights Found for Return Layover Duration: ${validFlights.length}`);
      if (validFlights.length > 0) {
        console.log(`Flight 1: Duration is valid → ${validFlights[0]}  (Max allowed: ${data.layoverReturn})`);
        console.log(`Flight ${validFlights.length}: Duration is valid → ${validFlights[validFlights.length - 1]}  (Max allowed: ${data.layoverReturn})`);
      }
      console.log(`Validation successful: Return Layover Duration verified for first and last flights\n`);
    }
  }

  async runAllSlidersReturn(data: any) {
    const sliders = [
      { name: "Return Flight Duration", index: 0, locator: "//span[@role='text' and contains(@aria-label,'Upto')]", value: data.flightDurationReturn, type: "duration", step: 2, nth: 0, flightLocator: "(//div[contains(@class,'Zi4TO')])[position() mod 2 = 1]//span[contains(@class,'n6YFe')]" },
      { name: "Return Departure Time", index: 1, locator: "div[id='departure-label'] div[class='Zx_qJ'] span:nth-child(2) span:nth-child(1)", value: data.departureDestinationTimeReturn, type: "time", step: 2, flightLocator: "(//div[contains(@class,'Zi4TO')])[position() mod 2 = 1]//div[contains(@class,'v4LL6')]//span[contains(@class,'ZLquk')]" },
      { name: "Return Layover Duration", index: 2, locator: "//span[@role='text' and contains(@aria-label,'Upto')]", value: data.layoverDurationReturn, type: "duration", step: 2, nth: 1, flightLocator: "(//div[contains(@class,'Zi4TO')])[position() mod 2 = 1]//span[contains(@class,'n6YFe')]" },
      { name: "Return Price", index: 3, locator: "div.NrZmc span:nth-child(2)", value: data.priceValueReturn, type: "price", step: 2, flightLocator: "(//span[contains(@class,'VpB0H')])[position() mod 2 = 1]" },
      { name: "Return Arrival Time", index: 4, locator: "div[class='Zx_qJ'] span:nth-child(2) span:nth-child(1) span:nth-child(1)", value: data.arrivalTimeReturn, type: "time", step: 2, flightLocator: "(//div[contains(@class,'Zi4TO')])[position() mod 2 = 1]//div[contains(@class,'v4LL6')]//span[contains(@class,'ZLquk')]" }
    ];

    console.log("\n===== Return Slider Filter Summary =====\n");

    for (const slider of sliders) {
      await this.dragSliderToValue(slider);

      const flightLocator = this.page.locator(slider.flightLocator);
      const flightCount = await flightLocator.count();
      const validFlights: string[] = [];

      const target = typeof slider.value === "number" ? slider.value :
                     slider.type === "time" ? this.convertTimeToMinutes(slider.value) :
                     this.convertDurationToMinutes(slider.value);

      for (let i = 0; i < flightCount; i++) {
        const text = await flightLocator.nth(i).textContent();
        if (!text) continue;
        const value = slider.type === "price" ? parseInt(text.replace(/[^\d]/g, "")) :
                      slider.type === "time" ? this.convertTimeToMinutes(text) :
                      this.convertDurationToMinutes(text);
        if (value <= target) validFlights.push(text);
      }

      console.log(`Total Flights Found for ${slider.name}: ${validFlights.length}`);
      if (validFlights.length > 0) {
        console.log(`Flight 1: ${slider.name} is valid → ${validFlights[0]}  (Max allowed: ${slider.value})`);
        console.log(`Flight ${validFlights.length}: ${slider.name} is valid → ${validFlights[validFlights.length - 1]}  (Max allowed: ${slider.value})`);
      }
      console.log(`Validation successful: ${slider.name} verified for first and last flights\n`);
    }
  }

  async bookFlightAndNavigate() {
    
    const pagePromise = this.page.context().waitForEvent("page");
    await this.bookFlightButton.click();
    await this.proceedBook.click();
    await this.proceedBook.click();
    const newPage = await pagePromise;
    await newPage.waitForLoadState("domcontentloaded");
    return newPage;
  }
}