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
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

    setIsLoading(true); // Start loading

    // Construct FormData directly from state for clarity and reliability
    // This ensures all data reflects the current component state.
    const formData = new FormData();
    formData.set('trip', tripTypeToggle ? 'R' : 'O'); // 'R' for Return, 'O' for One-way
    formData.set('depart', departureDate);
    formData.set('origin', origin);
    formData.set('destination', destination);

    if (tripTypeToggle && returnDate) {
        formData.set('return', returnDate);
    }
    // If it's a one-way trip, 'return' is simply not added, so no need for formData.delete()

    try {
      // Step 1: Fetch an authentication token from the backend.
      // This is a prerequisite for making the actual flight search request.
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/auth`, {
        method: 'GET'
      });
      if (!response.ok) {
        // Handle cases where the auth API itself fails (e.g., server error, network issue)
        throw new Error(`Authentication failed: ${response.statusText || response.status}`);
      }
      const tokenResponse: TokenResponse = await response.json();

      // Step 2: Prepare all search parameters, including the retrieved authentication token.
      // FormData values are converted to an array of [key, value] pairs.
      const params: string[][] = [];
      formData.forEach((value, key) => {
        params.push([key.toString(), value.toString()]);
      });
      params.push(['auth', tokenResponse.token]); // Add auth token to the parameters

      // Construct the query string for the redirection URL.
      const searchParams = new URLSearchParams(params);
      
      // Step 3: Redirect the user to the flights page, passing all parameters in the URL.
      // The NEXT_PUBLIC_SITE environment variable should contain the base URL of the application.
      const path = `${process.env.NEXT_PUBLIC_SITE}/flights`;
      window.location.assign(`${path}?${searchParams.toString()}`);

    } catch (error) {
      // Catch any errors from the fetch call (network, auth failure) or other issues during submission.
      console.error("Failed to submit form:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during submission.";
      setErrors(prev => ({ ...prev, form: errorMessage }));
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-6 sm:p-8 mt-10">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-800">
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
            <div className="flex items-center justify-center text-red-600 text-sm font-medium p-3 bg-red-100 rounded-md border border-red-300 shadow-sm my-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errors.form}</span>
            </div>
          )}
          <SearchButton isLoading={isLoading} />
        </form>
      </div>
      <footer className="text-center mt-12 pb-6">
        <p className="text-sm text-blue-100">&copy; {new Date().getFullYear()} JourneyMaker. All rights reserved.</p>
      </footer>
    </main>
  );
}



