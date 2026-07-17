import { Page, Locator, expect } from "@playwright/test";
export class RoundTripHomePage {
  private roundTripRadio: Locator;
  private fromInput: Locator;
  private toInput: Locator;
  private cityInput: Locator;
  private calendarOpen: Locator;
  private nextButton: Locator;
  private travellerDropdown: Locator;
  private countAdult: Locator;
  private addButtonAdult: Locator;
  private countChild: Locator;
  private addButtonChild: Locator;
  private countInfant: Locator;
  private addButtonInfant: Locator;
  private specialFare: Locator;
  private doneButton: Locator;
  private searchButton: Locator;
  constructor(private page: Page) {
    this.roundTripRadio = page.locator("//label[@id='rt']");
    this.fromInput = page.locator("div[id='from'] span[class='hIbqG']");
    this.toInput = page.locator("div[id='to'] span[class='hIbqG']");
    this.cityInput = page.locator("//input[@id='text-box']");
    this.calendarOpen = page.locator("div.ueycK").locator("span").nth(0);
    this.nextButton = page.locator("//i[contains(@class,'zamAL')]");
    this.travellerDropdown = page.locator("//span[@id='numPax' and normalize-space()='1 Traveller, Economy/Premium Economy']");
    this.countAdult = page.locator("//div[@class='MAXnA']").nth(0);
    this.addButtonAdult = page.locator("//div[@class='sbjB9']//div[1]//div[2]//div[3]//img[1]");
    this.countChild = page.locator("//div[@class='MAXnA']").nth(1);
    this.addButtonChild = page.locator("img[alt='add-icon']").nth(1);
    this.countInfant = page.locator("//div[@class='MAXnA']").nth(2);
    this.addButtonInfant = page.locator("img[alt='add-icon']").nth(2);
    this.specialFare = page.locator("//div[@class='elGAs']");
    this.doneButton = page.locator("//div[@class='BlFv4' and normalize-space()='Done']");
    this.searchButton = page.locator("//div[normalize-space()='Search Flights']").nth(1);
  }
  async navigate() {
    await this.page.goto("https://tickets.paytm.com/");
  }
  private async clickByText(locator: Locator, text: string) {
    await locator.filter({ hasText: text }).first().click();
  }
  async searchRoundTrip(data: {
    fromCity: string;
    fromCityFull: string;
    toCity: string;
    toCityFull: string;
    departMonthYear: string;
    departDay: string;
    returnMonthYear: string;
    returnDay: string;
    adults: number;
    children: number;
    infants: number;
    special: string;
  }) {
    await this.roundTripRadio.click();
    await this.fromInput.click();
    await this.cityInput.fill(data.fromCity);
    await this.page.locator(`//div[normalize-space()='${data.fromCityFull}']`).click();
    await this.toInput.click();
    await this.cityInput.fill(data.toCity);
    await this.page.locator(`//div[normalize-space()='${data.toCityFull}']`).click();
    await this.calendarOpen.click();
    while (
      await this.page.locator(
        `//td[contains(@class,'calendar__month') and normalize-space()='${data.departMonthYear}']`
      ).count() === 0
    ) {
      await this.nextButton.click();
    }
    await this.page.locator(`
      //td[normalize-space()='${data.departMonthYear}']
      /ancestor::table
      //div[contains(@class,'calendar__day')
        and not(contains(@class,'calendar__dayFromOtherMonth'))]
      [.//div[normalize-space()='${data.departDay}']]
    `).click();
    while (
      await this.page.locator(
        `//td[contains(@class,'calendar__month') and normalize-space()='${data.returnMonthYear}']`
      ).count() === 0
    ) {
      await this.nextButton.click();
    }
    await this.page.locator(`
      //td[normalize-space()='${data.returnMonthYear}']
      /ancestor::table
      //div[contains(@class,'calendar__day')
        and not(contains(@class,'calendar__dayFromOtherMonth'))]
      [.//div[normalize-space()='${data.returnDay}']]
    `).click();
    await this.travellerDropdown.click();
    while (parseInt(await this.countAdult.textContent() || "0") < data.adults) {
      await this.addButtonAdult.click();
    }
    while (parseInt(await this.countChild.textContent() || "0") < data.children) {
      await this.addButtonChild.click();
    }
    while (parseInt(await this.countInfant.textContent() || "0") < data.infants) {
      await this.addButtonInfant.click();
    }
    await this.doneButton.click();
    await this.clickByText(this.specialFare, data.special);
    await this.searchButton.click();
  }
}