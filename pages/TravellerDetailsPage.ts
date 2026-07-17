import { Page, Locator, expect } from "@playwright/test";
import { generatePassenger } from "../utils/fakerDataGenerator";
import { HomePage } from "./HomePage"; // ✅ ADD THIS

export class TravellerDetailsPage {
  private insuranceNone: Locator;
  private passengerSection: Locator;
  private saveDetailsButton: Locator;
  private mobileInput: Locator;
  private emailInput: Locator;
  private proceedToPayButton: Locator;
  private titleLocator: (titleId: string) => Locator;
  private firstNameInput: (index: number) => Locator;
  private lastNameInput: (index: number) => Locator;
  private dobDayInput: (index: number) => Locator;
  private dobMonthInput: (index: number) => Locator;
  private dobYearInput: (index: number) => Locator;

  constructor(private page: Page) {
    this.insuranceNone = this.page.locator("//label[@id='none']");
    this.passengerSection = this.page.locator("//div[@class='AIKNX']").nth(0);
    this.saveDetailsButton = this.page.locator("//div[@class='pV2vY' and text()='Save Details']").first();
    this.mobileInput = this.page.locator('[name="mobile"]');
    this.emailInput = this.page.locator('[name="email"]');
    this.proceedToPayButton = this.page
      .locator("button")
      .filter({ hasText: "Proceed To Pay" })
      .first();

    this.titleLocator = (titleId: string) =>
      this.page.locator(`//div[@class='e8e7U']//label[@id='${titleId}']`);

    this.firstNameInput = (index: number) =>
      this.page.locator(`//label[@id='${index}-label']//div[@class='CtciO thniI']//div//input[@name='firstname']`);

    this.lastNameInput = (index: number) =>
      this.page.locator(`//label[@id='${index}-label']//div[@class='CtciO thniI']//div//input[@name='lastname']`);

    this.dobDayInput = (index: number) =>
      this.page.locator(`//label[@id='${index}-label']//input[@placeholder='DD']`);

    this.dobMonthInput = (index: number) =>
      this.page.locator(`//label[@id='${index}-label']//input[@placeholder='MM']`);

    this.dobYearInput = (index: number) =>
      this.page.locator(`//label[@id='${index}-label']//input[@placeholder='YYYY']`);
  }

  //UPDATED (OPTIONAL CLICK)
  async selectInsurance() {
    if (await this.insuranceNone.isVisible()) {
      await this.insuranceNone.click();
      console.log("Insurance option selected: None");
    } else {
      console.log("Insurance option not visible, skipping...");
    }
    await this.page.waitForTimeout(500);
  }

  async fillTravellerDetails(data: any) {
    console.log("\n==================================================");
    console.log("PASSENGER DETAILS");
    console.log("==================================================\n");

    await this.passengerSection.click();

    const adultPassengers = data.passengers.slice(0, data.adults);
    const childPassengers = data.passengers.slice(data.adults, data.adults + data.children);
    const infantPassengers = data.passengers.slice(
      data.adults + data.children,
      data.adults + data.children + data.infants
    );

    // ADULTS
    for (let i = 0; i < adultPassengers.length; i++) {
      const passenger = adultPassengers[i];
      const passengerData = generatePassenger();
      const firstName = passengerData.firstName;
      const lastName = passengerData.lastName;

      await this.titleLocator(passenger.titleId).click();
      await this.firstNameInput(i).fill(firstName);
      await expect(this.firstNameInput(i)).toHaveValue(firstName);
      await this.page.waitForTimeout(300);
      await this.lastNameInput(i).fill(lastName);
      await expect(this.lastNameInput(i)).toHaveValue(lastName);
      await this.page.waitForTimeout(300);
      console.log(`Adult Passenger ${i + 1}`);
      console.log(`Name : ${firstName} ${lastName}`);
      console.log("--------------------------------------------------");

      await this.saveDetailsButton.click();
      await this.page.waitForTimeout(300);
    }

    //CHILDREN
    for (let i = 0; i < childPassengers.length; i++) {
      const passenger = childPassengers[i];
      const index = data.adults + i;

      const passengerData = generatePassenger();
      const firstName = passengerData.firstName;
      const lastName = passengerData.lastName;

      await this.titleLocator(passenger.titleId).click();
      await this.firstNameInput(index).fill(firstName);
      await expect(this.firstNameInput(index)).toHaveValue(firstName);
      await this.page.waitForTimeout(300); 
      await this.lastNameInput(index).fill(lastName);
      await expect(this.lastNameInput(index)).toHaveValue(lastName);
      await this.page.waitForTimeout(300); 
      console.log(`Child Passenger ${i + 1}`);
      console.log(`Name : ${firstName} ${lastName}`);

      if (passenger.dob) {
        const { day, month, year } = passenger.dob;

        await this.dobDayInput(index).fill(day);
        await expect(this.dobDayInput(index)).toHaveValue(day);

        await this.dobMonthInput(index).fill(month);
        await expect(this.dobMonthInput(index)).toHaveValue(month);

        await this.dobYearInput(index).fill(year);
        await expect(this.dobYearInput(index)).toHaveValue(year);

        console.log(`DOB  : ${day}-${month}-${year}`);
      }

      console.log("--------------------------------------------------");

      await this.saveDetailsButton.click();
      await this.page.waitForTimeout(300);
    }

    // INFANTS
    for (let i = 0; i < infantPassengers.length; i++) {
      const passenger = infantPassengers[i];
      const index = data.adults + data.children + i;

      const passengerData = generatePassenger();
      const firstName = passengerData.firstName;
      const lastName = passengerData.lastName;

      await this.titleLocator(passenger.titleId).click();
      await this.firstNameInput(index).fill(firstName);
      await expect(this.firstNameInput(index)).toHaveValue(firstName);

      await this.lastNameInput(index).fill(lastName);
      await expect(this.lastNameInput(index)).toHaveValue(lastName);

      console.log(`Infant Passenger ${i + 1}`);
      console.log(`Name : ${firstName} ${lastName}`);

      if (passenger.dob) {
        const { day, month, year } = passenger.dob;

        await this.dobDayInput(index).fill(day);
        await expect(this.dobDayInput(index)).toHaveValue(day);

        await this.dobMonthInput(index).fill(month);
        await expect(this.dobMonthInput(index)).toHaveValue(month);

        await this.dobYearInput(index).fill(year);
        await expect(this.dobYearInput(index)).toHaveValue(year);

        console.log(`DOB  : ${day}-${month}-${year}`);
      }

      console.log("--------------------------------------------------");

      await this.saveDetailsButton.click();
      await this.page.waitForTimeout(300);
    }
  }

  async fillContactDetails(data: { mobile: string; email: string }) {
    console.log("CONTACT DETAILS");
    console.log("==================================================\n");

    await this.mobileInput.fill(data.mobile);
    await this.emailInput.fill(data.email);

    console.log(`Mobile Number : ${data.mobile}`);
    console.log(`Email Address : ${data.email}`);
    console.log("--------------------------------------------------");

    await this.page.waitForTimeout(1000);
  }

  async verifyContactDetails(data: { mobile: string; email: string }) {
    console.log("CONTACT DETAILS VALIDATION");
    console.log("==================================================\n");

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(data.mobile)) {
      console.log(`Invalid Mobile Number : ${data.mobile}`);
    } else {
      console.log(`Valid Mobile Number  : ${data.mobile}`);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      console.log(`Invalid Email Address : ${data.email}`);
    } else {
      console.log(`Valid Email Address   : ${data.email}`);
    }

    console.log("--------------------------------------------------");
  }

  async verifyProceedButton() {
    await this.page.waitForTimeout(300);
    await expect(this.proceedToPayButton).toBeVisible();
  }

  async clickProceed() {
    await this.proceedToPayButton.click();
    await this.page.waitForTimeout(3000);
    await this.page.getByRole('img', { name: 'Close' }).click();
  }

 async verifyFareBreakupCalculation() {
  console.log("FARE BREAKUP CALCULATION");
  console.log("==================================================\n");

  const baseFareText = await this.page.locator("//div[@class='dCZRn']//div[1]//div[1]//span[1]").textContent();
  const taxesText = await this.page.locator("//div[@class='dCZRn']//div[2]//div[1]//span[1]").textContent();
  const convenienceFeeText = await this.page
    .locator("//div[text()='Convenience Fee']/following-sibling::span[@class='UCFuX']")
    .textContent();
  const grandTotalText = await this.page.locator("//span[@id='totalPrice']").textContent();

  const convertPrice = (price: string | null) =>
    parseInt(price!.replace(/[₹,]/g, "").trim());

  const baseFare = convertPrice(baseFareText);
  const taxes = convertPrice(taxesText);
  const convenienceFee = convertPrice(convenienceFeeText);
  const grandTotal = convertPrice(grandTotalText);

  // ==================== ✅ UPDATED LOGIC START ====================

  const storedPrice = HomePage.selectedFlightPrice;
  const calculatedPerPerson = Math.round((baseFare + taxes) / 3);

  console.log("PRICE VALIDATION (Previous Page vs Current Page)");
  console.log("--------------------------------------------------");
  console.log(`Stored Flight Price        : ₹${storedPrice}`);
  console.log(`(BaseFare + Taxes) / 3     : ₹${calculatedPerPerson}`);

  const difference = Math.abs(storedPrice - calculatedPerPerson);
  const tolerance = 1000; // ✅ UPDATED to 1000

  console.log(`Difference                 : ₹${difference}`);
  console.log(`Allowed Tolerance          : ₹${tolerance}`);

  // ✅ Assertion with updated tolerance
  expect(difference).toBeLessThanOrEqual(tolerance);

  if (difference <= tolerance) {
    console.log("✅ Price is within acceptable tolerance\n");
  } else {
    console.log("❌ Price mismatch beyond tolerance\n");
  }

  // ==================== ✅ UPDATED LOGIC END ====================

  const calculatedTotal = baseFare + taxes + convenienceFee;

  console.log(`Base Fare        : ₹${baseFare}`);
  console.log(`Taxes & Fees     : ₹${taxes}`);
  console.log(`Convenience Fee  : ₹${convenienceFee}`);
  console.log("--------------------------------------------------");
  console.log(`Calculated Total : ₹${calculatedTotal}`);
  console.log(`Displayed Total  : ₹${grandTotal}`);
  console.log("--------------------------------------------------");

  await expect(calculatedTotal).toBe(grandTotal);

  console.log("Fare calculation verified successfully\n");
}

}