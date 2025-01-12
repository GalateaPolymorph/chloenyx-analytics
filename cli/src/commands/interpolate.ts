import { formatDate, interpolateMetrics } from "../analytics/interpolation";
import { addMetricEntry, fetchMetrics } from "../notion/metrics";

export const interpolate = async () => {
  try {
    console.log("Fetching existing metrics...");
    const metrics = await fetchMetrics();

    console.log("Calculating interpolated values...");
    const interpolatedValues = interpolateMetrics(metrics);

    console.log(`Found ${interpolatedValues.length} days to interpolate`);

    if (interpolatedValues.length === 0) {
      console.log("No days need interpolation!");
      return;
    }

    console.log("Adding interpolated values to Notion...");
    const addPromises = interpolatedValues.map((value) =>
      addMetricEntry(
        formatDate(value.date),
        value.followers,
        value.subscribers,
        value.likes,
        "Interpolation"
      )
    );

    await Promise.all(addPromises);
    console.log("Successfully added all interpolated values!");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};
