import { faker } from "@faker-js/faker";

function onlyLetters(value: string): string {
  return value.replace(/[^A-Za-z]/g, "");
}

export function generatePassenger() {

  const firstName = onlyLetters(faker.person.firstName());
  const lastName = onlyLetters(faker.person.lastName());

  return {
    firstName,
    lastName,
    passportNumber:faker.string.alpha({ length: 1 }).toUpperCase() +faker.string.alphanumeric(7).toUpperCase(),
    passportExpiryDay: faker.number.int({ min: 10, max: 28 }).toString(),
    passportExpiryMonth: faker.number.int({ min: 1, max: 12 }).toString().padStart(2,"0"),
    passportExpiryYear: faker.number.int({ min: 2028, max: 2035 }).toString(),
    nationality: "India",
    issueCountry: "India",
    email: faker.internet.email(),
    mobile: `${faker.number.int({ min: 6, max: 9 })}${faker.string.numeric(9)}`
  };
}