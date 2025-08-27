import { Box, Typography, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  Air,
  Visibility,
  WaterDrop,
  Speed,
  Cloud,
  WbSunny,
} from "@mui/icons-material";

import type { WeatherResponse } from "@Types/weather";
import {
  formatWindSpeed,
  formatPressure,
  formatVisibility,
} from "@Services/weatherApi";
import { SunTimes } from "./SunTimes";

interface WeatherDetailsProps {
  current: WeatherResponse['current'];
  weatherData: WeatherResponse;
  sunrise: string;
  sunset: string;
  showDetails: boolean;
  styles: {
    dividerStyles: any;
    detailsGridStyles: any;
    detailItemBoxStyles: any;
    detailIconStyles: any;
    detailLabelStyles: any;
    detailValueStyles: any;
    detailSubtextStyles: any;
  };
}

export function WeatherDetails({
  current,
  weatherData,
  sunrise,
  sunset,
  showDetails,
  styles,
}: WeatherDetailsProps) {
  const { t } = useTranslation();

  if (!showDetails) {
    return null;
  }

  return (
    <>
      <Divider sx={styles.dividerStyles} />
      
      <Box sx={styles.detailsGridStyles}>
      <Box sx={styles.detailItemBoxStyles}>
        <Air sx={styles.detailIconStyles} />
        <Typography variant="body2" sx={styles.detailLabelStyles}>
          {t("weather.details.windSpeed")}
        </Typography>
        <Typography variant="h6" sx={styles.detailValueStyles}>
          {formatWindSpeed(current.wind_kph)}
        </Typography>
        <Typography variant="caption" sx={styles.detailSubtextStyles}>
          {current.wind_dir}
        </Typography>
      </Box>

      <Box sx={styles.detailItemBoxStyles}>
        <WaterDrop sx={styles.detailIconStyles} />
        <Typography variant="body2" sx={styles.detailLabelStyles}>
          {t("weather.details.humidity")}
        </Typography>
        <Typography variant="h6" sx={styles.detailValueStyles}>
          {current.humidity}%
        </Typography>
      </Box>

      <Box sx={styles.detailItemBoxStyles}>
        <Speed sx={styles.detailIconStyles} />
        <Typography variant="body2" sx={styles.detailLabelStyles}>
          {t("weather.details.pressure")}
        </Typography>
        <Typography variant="h6" sx={styles.detailValueStyles}>
          {formatPressure(current.pressure_mb)}
        </Typography>
      </Box>

      <Box sx={styles.detailItemBoxStyles}>
        <Visibility sx={styles.detailIconStyles} />
        <Typography variant="body2" sx={styles.detailLabelStyles}>
          {t("weather.details.visibility")}
        </Typography>
        <Typography variant="h6" sx={styles.detailValueStyles}>
          {formatVisibility(current.vis_km)}
        </Typography>
      </Box>

      <Box sx={styles.detailItemBoxStyles}>
        <Cloud sx={styles.detailIconStyles} />
        <Typography variant="body2" sx={styles.detailLabelStyles}>
          {t("weather.details.cloudCover")}
        </Typography>
        <Typography variant="h6" sx={styles.detailValueStyles}>
          {current.cloud}%
        </Typography>
      </Box>

      <Box sx={styles.detailItemBoxStyles}>
        <WbSunny sx={styles.detailIconStyles} />
        <Typography variant="body2" sx={styles.detailLabelStyles}>
          {t("weather.details.uvIndex")}
        </Typography>
        <Typography variant="h6" sx={styles.detailValueStyles}>
          {current.uv}
        </Typography>
      </Box>

      {/* Show sunrise/sunset only if forecast data is available */}
      <SunTimes
        show={!!weatherData.forecast?.forecastday?.[0]?.astro}
        sunrise={sunrise}
        sunset={sunset}
      />
      </Box>
    </>
  );
}
