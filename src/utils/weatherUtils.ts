import type { WeatherResponse } from "@Types/weather";

/**
 * Formats a date string for display in weather components
 */
export const formatWeatherDate = (localtime: string): string => {
  try {
    const date = new Date(localtime);
    return date.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return localtime;
  }
};

/**
 * Creates a formatted location display string including region, country, and date
 */
export const getLocationDisplayString = (location: WeatherResponse["location"]): string => {
  const regionPart =
    location.region && location.region !== location.name
      ? `${location.region}, `
      : "";

  return `${regionPart}${location.country} • ${formatWeatherDate(location.localtime)}`;
};
