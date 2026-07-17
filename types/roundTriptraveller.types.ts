export interface PassengerDOB {
  firstName: string;
  lastName: string;
  dd: string;
  mm: string;
  yyyy: string;
}

export interface TravellerData {
  adults: number;
  children: number;
  infants: number;

  adultPassengers: {
    firstName: string;
    lastName: string;
  }[];

  childPassengers: PassengerDOB[];
  infantPassengers: PassengerDOB[];

  mobile: string;
  email: string;
}