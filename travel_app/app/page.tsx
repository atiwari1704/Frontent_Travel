'use client'

import { useState, useEffect } from "react";
import TripTypeSelector from "./components/TripTypeSelector";
import DateInput from "./components/DateInput";
import LocationInput from "./components/LocationInput";
import SearchButton from "./components/SearchButton";

interface TokenResponse {
  token: string
}

interface Errors {
  departureDate?: string;
  returnDate?: string;
  origin?: string;
  destination?: string;
  form?: string; // For general form errors like API issues
}

export default function Home() {
  const [tripTypeToggle, setTripTypeToggle] = useState(true); // true for Return, false for One-way
  const [departureDate, setDepartureDate] = useState<string>((new Date()).toJSON().slice(0, 10));
  const [returnDate, setReturnDate] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  const minDate = (new Date()).toJSON().slice(0, 10);
  const airportOptions = ["YEG", "PHL", "LAX", "JFK", "LHR", "CDG", "DXB", "HND"]; // Example airport codes

  // Clear errors when inputs change
  useEffect(() => {
    setErrors(prev => ({ ...prev, departureDate: undefined }));
  }, [departureDate]);

  useEffect(() => {
    setErrors(prev => ({ ...prev, returnDate: undefined }));
  }, [returnDate, tripTypeToggle]);

  useEffect(() => {
    setErrors(prev => ({ ...prev, origin: undefined }));
  }, [origin]);

  useEffect(() => {
    setErrors(prev => ({ ...prev, destination: undefined }));
  }, [destination]);


  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!departureDate) {
      newErrors.departureDate = "Departure date is required.";
    }
    if (tripTypeToggle && !returnDate) {
      newErrors.returnDate = "Return date is required for a return trip.";
    }
    if (tripTypeToggle && returnDate && departureDate && returnDate < departureDate) {
      newErrors.returnDate = "Return date cannot be before departure date.";
    }
    if (!origin) {
      newErrors.origin = "Origin airport is required.";
    } else if (origin.length !== 3) {
      newErrors.origin = "Origin airport code must be 3 letters.";
    }
    if (!destination) {
      newErrors.destination = "Destination airport is required.";
    } else if (destination.length !== 3) {
      newErrors.destination = "Destination airport code must be 3 letters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors(prev => ({ ...prev, form: undefined })); // Clear previous form error

    if (!validateForm()) {
      return;
    }

    // Construct FormData directly from state for clarity and reliability
    const formData = new FormData();
    formData.set('trip', tripTypeToggle ? 'R' : 'O');
    formData.set('depart', departureDate);
    formData.set('origin', origin);
    formData.set('destination', destination);

    if (tripTypeToggle && returnDate) {
        formData.set('return', returnDate);
    }
    // If it's a one-way trip, 'return' is simply not added, so no need for formData.delete()

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/auth`, {
        method: 'GET'
      });
      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText || response.status}`);
      }
      const tokenResponse: TokenResponse = await response.json();

      const params: string[][] = [];
      formData.forEach((value, key) => {
        params.push([key.toString(), value.toString()]);
      });
      params.push(['auth', tokenResponse.token]);

      const searchParams = new URLSearchParams(params);
      const path = `${process.env.NEXT_PUBLIC_SITE}/flights`;
      window.location.assign(`${path}?${searchParams.toString()}`);

    } catch (error) {
      console.error("Failed to submit form:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during submission.";
      setErrors(prev => ({ ...prev, form: errorMessage }));
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-8 mt-10">
        <header className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-800">
            JourneyMaker
          </h1>
          <p className="text-gray-600 text-lg mt-2">Find your next adventure</p>
        </header>

        <form className="flex flex-col space-y-8" onSubmit={handleSubmit}>
          <TripTypeSelector tripTypeToggle={tripTypeToggle} setTripTypeToggle={setTripTypeToggle} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DateInput
              name="depart"
              label="Departure Date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              minDate={minDate}
              required={true}
              error={errors.departureDate}
            />
            {tripTypeToggle && (
              <DateInput
                name="return"
                label="Return Date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                minDate={departureDate || minDate}
                required={tripTypeToggle}
                error={errors.returnDate}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LocationInput
              name="origin"
              label="From (Airport Code)"
              placeholder="e.g., LAX"
              value={origin}
              onChange={(e) => setOrigin(e.target.value.toUpperCase())}
              listId="origin-airports"
              options={airportOptions}
              required={true}
              error={errors.origin}
            />
            <LocationInput
              name="destination"
              label="To (Airport Code)"
              placeholder="e.g., JFK"
              value={destination}
              onChange={(e) => setDestination(e.target.value.toUpperCase())}
              listId="destination-airports"
              options={airportOptions}
              required={true}
              error={errors.destination}
            />
          </div>
          {errors.form && (
            <div className="text-center text-red-500 text-sm font-medium p-3 bg-red-100 rounded-md">
              {errors.form}
            </div>
          )}
          <SearchButton />
        </form>
      </div>
      <footer className="text-center mt-12 pb-6">
        <p className="text-sm text-blue-100">&copy; {new Date().getFullYear()} JourneyMaker. All rights reserved.</p>
      </footer>
    </main>
  );
}



