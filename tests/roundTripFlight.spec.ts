import { test, expect } from "@playwright/test";
import { RoundTripHomePage } from "../pages/RoundTripHomePage";
import { RoundTripResultsPage } from "../pages/RoundTripResultsPage";
import { RoundTripTravellerPage } from "../pages/RoundTripTravellerPage";
import roundTripData from "../test-data/roundTripData.json";
import { generatePassenger } from "../utils/fakerDataGenerator";
test.describe("Paytm Round way Flight Booking Flow", () => {
test("Round trip flight booking from Bangalore to Dubai", async ({ page }) => {
  const home = new RoundTripHomePage(page);
  await home.navigate();
  await expect(page).toHaveURL(/tickets\.paytm\.com/);
  await home.searchRoundTrip(roundTripData);
  const results = new RoundTripResultsPage(page);
  await results.applyFilters(roundTripData);
  await results.runAllSliders(roundTripData);
  await results.returnFlight();
  await results.applyFiltersReturn(roundTripData);
  await results.runAllSlidersReturn(roundTripData);
  const travellerPage = await results.bookFlightAndNavigate();
  await expect(travellerPage).toHaveURL(/paytm/);
  const traveller = new RoundTripTravellerPage(travellerPage);// Traveller Page
    await traveller.fillTravellerDetails(roundTripData);
const passengerData = generatePassenger(); 
    await traveller.fillContactDetails({
  mobile: passengerData.mobile,
  email: passengerData.email
});
await traveller.verifyContactDetails({
  mobile: passengerData.mobile,
  email: passengerData.email
});
    await traveller.verifyProceedButton();
    await traveller.clickProceed();
    await traveller.verifyFareBreakupCalculation();
  });
});
  