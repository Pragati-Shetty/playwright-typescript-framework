// Date of Birth structure
export interface PassengerDOB {
  day: string;
  month: string;
  year: string;
}

// Passenger structure
export interface Passenger {
  titleId: string;
  firstName: string;
  lastName: string;
  dob?: PassengerDOB;
}

// Main Traveller Data structure
export interface TravellerData {
  passengers: Passenger[];
  mobile: string;
  email: string;
}

// Flight Search Data structure
export interface FlightSearchData {
  fromCity: string;
  fromCityFull: string;
  toCity: string;
  toCityFull: string;
  monthYear: string;
  day: string;
  adults: number;
  children: number;
  infants: number;
}