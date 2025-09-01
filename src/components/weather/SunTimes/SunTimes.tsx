import { Box, Typography } from "@mui/material";
import { WbSunny, NightsStay } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

import { colors } from "@Theme/colors";
import { sunTimesStyles } from "./SunTimes.styles";

interface SunTimesProps {
  sunrise: string;
  sunset: string;
  iconColor?: string;
  labelColor?: string;
  show?: boolean;
}

export function SunTimes({
  sunrise,
  sunset,
  iconColor = colors.weather.overlay.text.muted,
  labelColor = colors.weather.overlay.text.muted,
  show,
}: SunTimesProps) {
  const { t } = useTranslation();

  const iconStyles = {
    ...sunTimesStyles.detailIcon,
    color: iconColor
  };

  const labelStyles = {
    ...sunTimesStyles.detailLabel,
    color: labelColor
  };

  if (!show) return null;

  return (
    <Box sx={sunTimesStyles.container}>
      <Box sx={sunTimesStyles.detailItemBox}>
        <WbSunny sx={iconStyles} />
        <Typography variant="body2" sx={labelStyles}>
          {t("weather.details.sunrise")}
        </Typography>
        <Typography variant="h6" sx={sunTimesStyles.detailValue}>
          {sunrise}
        </Typography>
      </Box>

      <Box sx={sunTimesStyles.detailItemBox}>
        <NightsStay sx={iconStyles} />
        <Typography variant="body2" sx={labelStyles}>
          {t("weather.details.sunset")}
        </Typography>
        <Typography variant="h6" sx={sunTimesStyles.detailValue}>
          {sunset}
        </Typography>
      </Box>
    </Box>
  );
}
