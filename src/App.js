import React from "react";
import { useState } from "react";
import { parsePhoneNumber, AsYouType } from "libphonenumber-js";

import "./App.css";

// see https://www.npmjs.com/package/libphonenumber-js
// "Validate phone number" section for details
const POSSIBLE_IS_VALID = false;

const calculateValidity = (parsedPhone) => {
  return parsedPhone.isValid() || POSSIBLE_IS_VALID
    ? parsedPhone.isPossible()
    : false;
};

function App() {
  const [country, setCountry] = useState("GB");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [isValid, setIsValid] = useState(null);

  const countries = [
    {
      code: "GB",
      teleCode: "+44",
    },
    {
      code: "IE",
      teleCode: "+353",
    },
    {
      code: "RU",
      teleCode: "+7",
    },
    {
      code: "US",
      teleCode: "+1",
    },
    {
      code: "UA",
      teleCode: "+380",
    },
  ];

  const formatNumber = (value) => {
    console.log("formatter: ", country);

    let output = value;
    try {
      output = new AsYouType(country).input(output);
    } catch (e) {
      console.error(e);
    }

    return output;
  };

  const onCountryChange = (event) => {
    setCountry(event.target.value);
    onPhoneChange(
      {
        target: {
          value: phone,
        },
      },
      event.target.value
    );
  };

  const onPhoneChange = (event, externalCountry) => {
    console.log("Raw number: ", event.target.value);
    try {
      const parsedPhone = parsePhoneNumber(
        event.target.value,
        externalCountry || country
      );
      console.log(parsedPhone);
      console.log(parsedPhone.isValid(), parsedPhone.isPossible());

      parsedPhone.country &&
        !externalCountry &&
        setCountry(parsedPhone.country);

      if (calculateValidity(parsedPhone)) {
        setIsValid(true);
        setPhone(parsedPhone.nationalNumber);
        setCountryCode(parsedPhone.countryCallingCode);

        return;
      }

      setIsValid(false);
      setPhone(event.target.value);
      setCountryCode("");
    } catch (e) {
      console.error(e);
      setPhone(event.target.value);
      setCountryCode("");
    }
  };

  const onPhoneBlur = (event) => {
    console.log("Blur!");
  };

  const onPhonePaste = (event) => {
    console.log("Autofill or copypaste");
  };

  return (
    <div className="App container">
      <form className="col-6">
        <div className="form-group">
          <label htmlFor="fname">First name</label>
          <input type="text" className="form-control" id="fname" />
        </div>
        <div className="form-group">
          <label htmlFor="lname">Last name</label>
          <input type="text" className="form-control" id="lname" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input type="email" className="form-control" id="email" />
        </div>
        <div className="form-group">
          <label htmlFor="country-code">Country</label>
          <select
            className="form-control"
            id="country-code"
            value={country}
            onChange={onCountryChange}
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {`${country.code} ${country.teleCode}`}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            className={`form-control ${isValid === false ? "is-invalid" : ""}`}
            id="phone"
            value={formatNumber(phone)}
            onChange={onPhoneChange}
            onBlur={onPhoneBlur}
            onPaste={onPhonePaste}
          />
          <div className="invalid-feedback">Phone is invalid</div>
        </div>
      </form>
      <h3>Output</h3>
      <p>{`Valid: ${isValid}`}</p>
      <p>{`Country: ${country}`}</p>
      <p>{`Country code: ${countryCode}`}</p>
      <p>{`National phone: ${phone}`}</p>
    </div>
  );
}

export default App;
