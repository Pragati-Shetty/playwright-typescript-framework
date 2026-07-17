import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { TravellerDetailsPage } from "../pages/TravellerDetailsPage";
import flightData from "../test-data/flightData.json";
import { generatePassenger } from "../utils/fakerDataGenerator";
test.describe.configure({ mode: "parallel" });        //Enable parallel execution
test.describe("Paytm Flight Booking Flow", () => {
  const searchFlight = async (home: HomePage) => {      //Common Step: Search Flight
    await home.searchCity(flightData);
    await home.selectDepartureDate(flightData);
    await home.selectTraveller(flightData);
  };
  const goToTravellerPage = async (home: HomePage) => {  //Common Step: Navigate to Traveller Page
    const newPage = await home.bookFlightAndNavigate();
    return new TravellerDetailsPage(newPage);
  };
  const fillTraveller = async (traveller: TravellerDetailsPage) => {   //Common Step: Fill Traveller Details
    await traveller.selectInsurance();
    await traveller.fillTravellerDetails(flightData);
    const passengerData = generatePassenger();
    await traveller.fillContactDetails({
      mobile: passengerData.mobile,
      email: passengerData.email
    });
    return passengerData;
  };
  test("E2E: Complete booking flow without filters", async ({ page }) => { //1. E2E FLOW (BASIC - NO FILTERS)
    test.setTimeout(120000);
    const home = new HomePage(page);
    await home.navigate();
    await expect(page).toHaveURL(/tickets\.paytm\.com/);
    await searchFlight(home);
    const traveller = await goToTravellerPage(home);
    await fillTraveller(traveller);
    await traveller.clickProceed();
    await traveller.verifyFareBreakupCalculation();
  });
  test("E2E: Complete booking flow with filters", async ({ page }) => { // 2. E2E FLOW WITH FILTERS
    test.setTimeout(120000);
    const home = new HomePage(page);
    await home.navigate();
    await expect(page).toHaveURL(/tickets\.paytm\.com/);
    await searchFlight(home);
    await home.applyFilters(flightData);
    await home.runAllSliders(flightData); // optional but good here
    const traveller = await goToTravellerPage(home);
    await fillTraveller(traveller);
    await traveller.clickProceed();
    await traveller.verifyFareBreakupCalculation();
  });
  test("Validate flight search with filters and sliders", async ({ page }) => {  //SEARCH + FILTER VALIDATION
    test.setTimeout(120000);
    const home = new HomePage(page);
    await home.navigate();
    await expect(page.getByText("Search Flights")).toBeVisible();
    await searchFlight(home);
    await home.applyFilters(flightData);
    await home.runAllSliders(flightData);
  });
  test("Validate booking flow with traveller and contact details", async ({ page }) => {    //4. TRAVELLER DETAILS VALIDATION
    test.setTimeout(120000);
    const home = new HomePage(page);
    await home.navigate();
    await searchFlight(home);
    const traveller = await goToTravellerPage(home);
    const passengerData = await fillTraveller(traveller);
    await traveller.verifyContactDetails({
      mobile: passengerData.mobile,
      email: passengerData.email
    });
    await traveller.verifyProceedButton();
  });
});