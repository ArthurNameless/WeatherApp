import {
  Card,
  CardContent,
} from "@mui/material";

import type { WeatherResponse } from "@Types/weather";
import {
  getSunTimes,
} from "@Services/weatherApi";
import { createWeatherCardStyles } from "./WeatherCard.styles";
import { WeatherDetails } from "./WeatherDetails";
import { WeatherCardHeader } from "./WeatherCardHeader";
import { WeatherMainDisplay } from "./WeatherMainDisplay";
import { TemperatureInfo } from "./TemperatureInfo";

interface WeatherCardProps {
  weatherData: WeatherResponse;
  showDetails?: boolean;
}

export function WeatherCard({
  weatherData,
  showDetails = true,
}: WeatherCardProps) {
  const { location, current } = weatherData;
  const isDay = current.is_day === 1;
  const { sunrise, sunset } = getSunTimes(weatherData);

  const styles = createWeatherCardStyles(isDay);

  return (
    <Card elevation={3} sx={styles.cardStyles}>
      <CardContent sx={styles.cardContentStyles}>
        <WeatherCardHeader
          location={location}
          condition={current.condition}
          isDay={isDay}
        />

        <WeatherMainDisplay
          current={current}
          weatherData={weatherData}
          isDay={isDay}
        />

        <TemperatureInfo
          weatherData={weatherData}
          isDay={isDay}
        />

        <WeatherDetails
          current={current}
          weatherData={weatherData}
          sunrise={sunrise}
          sunset={sunset}
          showDetails={showDetails}
          styles={{
            dividerStyles: styles.dividerStyles,
            detailsGridStyles: styles.detailsGridStyles,
            detailItemBoxStyles: styles.detailItemBoxStyles,
            detailIconStyles: styles.detailIconStyles,
            detailLabelStyles: styles.detailLabelStyles,
            detailValueStyles: styles.detailValueStyles,
            detailSubtextStyles: styles.detailSubtextStyles,
          }}
        />
      </CardContent>
    </Card>
  );
}
