import { Page, Locator, expect } from "@playwright/test";
import { generatePassenger } from "../utils/fakerDataGenerator";
import { faker, th } from "@faker-js/faker";

export class RoundTripTravellerPage{

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

  private passportNumberInput: (index: number) => Locator;

  private passportExpiryDayInput: (index: number) => Locator;
  private passportExpiryMonthInput: (index: number) => Locator;
  private passportExpiryYearInput: (index: number) => Locator;

  private passengerNationalityInput: Locator;
  private passportIssueCountryInput: Locator;
  

  constructor(private page: Page) {

    this.passengerSection = this.page.locator('section.rY8kb');
    this.saveDetailsButton = this.page.locator("//div[text()='Save Details']").first();

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
      this.page.locator(`//label[@id='${index}-label']//input[@placeholder='DD']`).first();

    this.dobMonthInput = (index: number) =>
      this.page.locator(`//label[@id='${index}-label']//input[@placeholder='MM']`).first();

    this.dobYearInput = (index: number) =>
      this.page.locator(`//label[@id='${index}-label']//input[@placeholder='YYYY']`).first();

    this.passportNumberInput = (index: number) =>
      this.page.locator(`//label[@id='${index}-label']//div[@class='CtciO thniI']//div//input[@name='passport_no']`);

    this.passportExpiryDayInput = (index: number) =>
      this.page.locator(`//label[@id='${index}-label']//input[@placeholder='DD']`).nth(1);

    this.passportExpiryMonthInput = (index: number) =>
      this.page.locator(`//label[@id='${index}-label']//input[@placeholder='MM']`).nth(1);

    this.passportExpiryYearInput = (index: number) =>
      this.page.locator(`//label[@id='${index}-label']//input[@placeholder='YYYY']`).nth(1);

    this.passengerNationalityInput = this.page.locator('//input[@id="text-box" and @class="M1kdz"]').first();

    this.passportIssueCountryInput = this.page.locator('//input[@id="text-box" and @class="M1kdz"]').first();
  
  }

  private printPassengerDetails(
    type: string,
    index: number,
    firstName: string,
    lastName: string,
    dob: any,
    passportNumber: string,
    expDay: string,
    expMonth: string,
    expYear: string,
    nationality: string,
    issueCountry: string
  ){
    console.log(`\n${type} Passenger ${index + 1}`);
    console.log("--------------------------------------------------");
    console.log(`Name            : ${firstName} ${lastName}`);

    if(dob){
      console.log(`DOB             : ${dob.day}-${dob.month}-${dob.year}`);
    }

    console.log(`Passport Number : ${passportNumber}`);
    console.log(`Expiry Date     : ${expDay}-${expMonth}-${expYear}`);
    console.log(`Nationality     : ${nationality}`);
    console.log(`Issue Country   : ${issueCountry}`);
    console.log("--------------------------------------------------");
  }

  async fillTravellerDetails(data: any) {

    console.log("\n==================================================");
    console.log("PASSENGER DETAILS");
    console.log("==================================================\n");

    await this.passengerSection.click();

    const adultPassengers = data.passengers.slice(0, data.adults);
    const childPassengers = data.passengers.slice(
      data.adults,
      data.adults + data.children
    );

    const infantPassengers = data.passengers.slice(
      data.adults + data.children,
      data.adults + data.children + data.infants
    );

    //ADULTS
    for (let i = 0; i < adultPassengers.length; i++) {

      const passenger = adultPassengers[i];
      const passengerData = generatePassenger();

      const firstName = passengerData.firstName;
      const lastName = passengerData.lastName;

      await this.titleLocator(passenger.titleId).click();

      await this.firstNameInput(i).fill(firstName);
      await expect(this.firstNameInput(i)).toHaveValue(firstName);
      await this.page.waitForTimeout(500)

      await this.lastNameInput(i).fill(lastName);
      await expect(this.lastNameInput(i)).toHaveValue(lastName);
      await this.page.waitForTimeout(500)

      if (passenger.dob) {

        const { day, month, year } = passenger.dob;

        await this.dobDayInput(i).fill(day);
        await expect(this.dobDayInput(i)).toHaveValue(day);

        await this.dobMonthInput(i).fill(month);
        await expect(this.dobMonthInput(i)).toHaveValue(month);

        await this.dobYearInput(i).fill(year);
        await expect(this.dobYearInput(i)).toHaveValue(year);
      }

      const passportNumber = passengerData.passportNumber;
      const expDay = passengerData.passportExpiryDay;
      const expMonth = passengerData.passportExpiryMonth;
      const expYear = passengerData.passportExpiryYear;

      await this.passportNumberInput(i).fill(passportNumber);
      await expect(this.passportNumberInput(i)).toHaveValue(passportNumber);
      await this.page.waitForTimeout(500)

      await this.passportExpiryDayInput(i).fill(expDay);
      await expect(this.passportExpiryDayInput(i)).toHaveValue(expDay);

      await this.passportExpiryMonthInput(i).fill(expMonth);
      await expect(this.passportExpiryMonthInput(i)).toHaveValue(expMonth);

      await this.passportExpiryYearInput(i).fill(expYear);
      await expect(this.passportExpiryYearInput(i)).toHaveValue(expYear);
      await this.page.waitForTimeout(500);

      await this.passengerNationalityInput.click();
      await this.passengerNationalityInput.fill(passengerData.nationality);
      await this.page.waitForTimeout(500)

      await this.passportIssueCountryInput.click();
      await this.passportIssueCountryInput.fill(passengerData.issueCountry);
      await this.page.waitForTimeout(500)

      this.printPassengerDetails(
        "Adult",
        i,
        firstName,
        lastName,
        passenger.dob,
        passportNumber,
        expDay,
        expMonth,
        expYear,
        passengerData.nationality,
        passengerData.issueCountry
      );

      await this.saveDetailsButton.click();
      await this.page.waitForTimeout(500);
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
      await this.page.waitForTimeout(500);

      await this.lastNameInput(index).fill(lastName);
      await expect(this.lastNameInput(index)).toHaveValue(lastName);
      await this.page.waitForTimeout(500);

      if (passenger.dob) {

        const { day, month, year } = passenger.dob;

        await this.dobDayInput(index).fill(day);
        await expect(this.dobDayInput(index)).toHaveValue(day);

        await this.dobMonthInput(index).fill(month);
        await expect(this.dobMonthInput(index)).toHaveValue(month);

        await this.dobYearInput(index).fill(year);
        await expect(this.dobYearInput(index)).toHaveValue(year);
      }

      const passportNumber = passengerData.passportNumber;
      const expDay = passengerData.passportExpiryDay;
      const expMonth = passengerData.passportExpiryMonth;
      const expYear = passengerData.passportExpiryYear;

      await this.passportNumberInput(index).fill(passportNumber);
      await expect(this.passportNumberInput(index)).toHaveValue(passportNumber);
      await this.page.waitForTimeout(500);

      await this.passportExpiryDayInput(index).fill(expDay);
      await expect(this.passportExpiryDayInput(index)).toHaveValue(expDay);

      await this.passportExpiryMonthInput(index).fill(expMonth);
      await expect(this.passportExpiryMonthInput(index)).toHaveValue(expMonth);

      await this.passportExpiryYearInput(index).fill(expYear);
      await expect(this.passportExpiryYearInput(index)).toHaveValue(expYear);
      await this.page.waitForTimeout(500);

      await this.passengerNationalityInput.click();
      await this.passengerNationalityInput.fill(passengerData.nationality);
      await this.page.waitForTimeout(500)

      await this.passportIssueCountryInput.click();
      await this.passportIssueCountryInput.fill(passengerData.issueCountry);
      await this.page.waitForTimeout(500)

      this.printPassengerDetails(
        "Child",
        i,
        firstName,
        lastName,
        passenger.dob,
        passportNumber,
        expDay,
        expMonth,
        expYear,
        passengerData.nationality,
        passengerData.issueCountry
      );

      await this.saveDetailsButton.click();
      await this.page.waitForTimeout(500)
    }

    //INFANTS
    for (let i = 0; i < infantPassengers.length; i++) {

      const passenger = infantPassengers[i];
      const index = data.adults + data.children + i;

      const passengerData = generatePassenger();

      const firstName = passengerData.firstName;
      const lastName = passengerData.lastName;

      await this.titleLocator(passenger.titleId).click();

      await this.firstNameInput(index).fill(firstName);
      await expect(this.firstNameInput(index)).toHaveValue(firstName);
      await this.page.waitForTimeout(500);

      await this.lastNameInput(index).fill(lastName);
      await expect(this.lastNameInput(index)).toHaveValue(lastName);
      await this.page.waitForTimeout(500);

      if (passenger.dob) {

        const { day, month, year } = passenger.dob;

        await this.dobDayInput(index).fill(day);
        await expect(this.dobDayInput(index)).toHaveValue(day);

        await this.dobMonthInput(index).fill(month);
        await expect(this.dobMonthInput(index)).toHaveValue(month);

        await this.dobYearInput(index).fill(year);
        await expect(this.dobYearInput(index)).toHaveValue(year);
      }

      const passportNumber = passengerData.passportNumber;

      await this.passportNumberInput(index).fill(passportNumber);
      await expect(this.passportNumberInput(index)).toHaveValue(passportNumber);
      await this.page.waitForTimeout(500);

      await this.passportExpiryDayInput(index).fill(passengerData.passportExpiryDay);
      await this.passportExpiryMonthInput(index).fill(passengerData.passportExpiryMonth);
      await this.passportExpiryYearInput(index).fill(passengerData.passportExpiryYear);
      await this.page.waitForTimeout(500);

      await this.passengerNationalityInput.click();
      await this.passengerNationalityInput.fill(passengerData.nationality);
      await this.page.waitForTimeout(500)

      await this.passportIssueCountryInput.click();
      await this.passportIssueCountryInput.fill(passengerData.issueCountry);
      await this.page.waitForTimeout(500)

      this.printPassengerDetails(
        "Infant",
        i,
        firstName,
        lastName,
        passenger.dob,
        passportNumber,
        passengerData.passportExpiryDay,
        passengerData.passportExpiryMonth,
        passengerData.passportExpiryYear,
        passengerData.nationality,
        passengerData.issueCountry
      );

      await this.saveDetailsButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  async fillContactDetails(data: { mobile: string; email: string }) {

    console.log("\n==================================================");
    console.log("CONTACT DETAILS");
    console.log("==================================================\n");

    await this.mobileInput.fill(data.mobile);
    await this.emailInput.fill(data.email);

    console.log(`Mobile Number : ${data.mobile}`);
    console.log(`Email Address : ${data.email}`);
    console.log("--------------------------------------------------");
  }

  async verifyContactDetails(data: { mobile: string; email: string }) {

    console.log("\n==================================================");
    console.log("✔ CONTACT DETAILS VALIDATION");
    console.log("==================================================\n");

    const mobileRegex = /^[6-9]\d{9}$/;

    if (!mobileRegex.test(data.mobile)) {
      console.log(`Invalid Mobile Number : ${data.mobile}`);
      console.log("Expected Format : 10 digits starting with 6,7,8,9");
    } else {
      console.log(`Valid Mobile Number : ${data.mobile}`);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.email)) {
      console.log(`⚠ Invalid Email Address : ${data.email}`);
      console.log("Expected Format : example@test.com");
    } else {
      console.log(`✔ Valid Email Address : ${data.email}`);
    }

    console.log("--------------------------------------------------");
  }

  async verifyProceedButton() {
    await expect(this.proceedToPayButton).toBeVisible();
  }

  async clickProceed() {
    await this.proceedToPayButton.click();
    await this.page.getByRole('img', { name: 'Close' }).click();
  }

  async verifyFareBreakupCalculation() {

    console.log("\n==================================================");
    console.log("FARE BREAKUP CALCULATION");
    console.log("==================================================\n");

    const baseFareText = await this.page
      .locator("//div[@class='dCZRn']//div[1]//div[1]//span[1]")
      .textContent();

    const taxesText = await this.page
      .locator("//div[@class='dCZRn']//div[2]//div[1]//span[1]")
      .textContent();

    const convenienceFeeText = await this.page
      .locator("//div[text()='Convenience Fee']/following-sibling::span[@class='UCFuX']")
      .textContent();

    const grandTotalText = await this.page
      .locator("//span[@id='totalPrice']")
      .textContent();

    const convertPrice = (price: string | null) =>
      parseInt(price!.replace(/[₹,]/g, "").trim());

    const baseFare = convertPrice(baseFareText);
    const taxes = convertPrice(taxesText);
    const convenienceFee = convertPrice(convenienceFeeText);
    const grandTotal = convertPrice(grandTotalText);

    const calculatedTotal = baseFare + taxes + convenienceFee;

    console.log(`Base Fare : ₹${baseFare}`);
    console.log(`Taxes & Fees : ₹${taxes}`);
    console.log(`Convenience Fee : ₹${convenienceFee}`);
    console.log("--------------------------------------------------");

    console.log(`Calculated Total : ₹${calculatedTotal}`);
    console.log(`Displayed Total : ₹${grandTotal}`);
    console.log("--------------------------------------------------");

    await expect(calculatedTotal).toBe(grandTotal);

    console.log("Fare calculation verified successfully\n");
  }
}