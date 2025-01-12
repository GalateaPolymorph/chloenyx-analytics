import { formatDate } from "../analytics/interpolation";
import { notionClient } from "../notion/client";
import { fetchMetrics } from "../notion/metrics";

type MetricChanges = {
  // Growth rates (percentage)
  followerGrowth: number;
  likeGrowth: number;
  subscriberGrowth: number;
  // Absolute increments
  followerIncrement: number;
  likeIncrement: number;
  subscriberIncrement: number;
};

const calculateGrowthPercentage = (
  current: number,
  previous: number
): number => {
  if (previous === 0) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(2));
};

const calculateIncrement = (current: number, previous: number): number => {
  return current - previous;
};

const hasAllMetricChanges = (properties: any): boolean => {
  const requiredProperties = [
    "Follower Growth",
    "Like Growth",
    "Subscriber Growth",
    "Follower Increment",
    "Like Increment",
    "Subscriber Increment",
  ];

  // Check if properties exist and have non-null numbers
  const hasAll = requiredProperties.every(
    (prop) =>
      properties[prop]?.type === "number" && properties[prop]?.number !== null
  );

  if (!hasAll) {
    const missing = requiredProperties.filter(
      (prop) =>
        properties[prop]?.type !== "number" || properties[prop]?.number === null
    );
    console.log("Properties needing update:", missing);
  }

  return hasAll;
};

const updatePageMetrics = async (pageId: string, changes: MetricChanges) => {
  await notionClient.pages.update({
    page_id: pageId,
    properties: {
      // Growth rates
      "Follower Growth": {
        type: "number",
        number: changes.followerGrowth,
      },
      "Like Growth": {
        type: "number",
        number: changes.likeGrowth,
      },
      "Subscriber Growth": {
        type: "number",
        number: changes.subscriberGrowth,
      },
      // Increments
      "Follower Increment": {
        type: "number",
        number: changes.followerIncrement,
      },
      "Like Increment": {
        type: "number",
        number: changes.likeIncrement,
      },
      "Subscriber Increment": {
        type: "number",
        number: changes.subscriberIncrement,
      },
    },
  });
};

export const calculateGrowth = async () => {
  try {
    console.log("Fetching metrics...");
    const metrics = await fetchMetrics();

    // Sort metrics by date
    const sortedMetrics = [...metrics].sort(
      (a, b) =>
        new Date(a.Datum.date.start).getTime() -
        new Date(b.Datum.date.start).getTime()
    );

    console.log("Calculating growth rates and increments...");
    let updatedCount = 0;
    let skippedCount = 0;

    for (let i = 1; i < sortedMetrics.length; i++) {
      const current = sortedMetrics[i];
      const previous = sortedMetrics[i - 1];

      const date = formatDate(new Date(current.Datum.date.start));

      console.log(`\nChecking ${date}...`);
      // Check if entry already has all metric changes with correct values
      if (hasAllMetricChanges(current)) {
        console.log(`Skipping ${date} - metrics already up to date`);
        skippedCount++;
        continue;
      }

      const changes: MetricChanges = {
        // Calculate growth rates
        followerGrowth: calculateGrowthPercentage(
          current.Followers.number,
          previous.Followers.number
        ),
        likeGrowth: calculateGrowthPercentage(
          current.Likes.number,
          previous.Likes.number
        ),
        subscriberGrowth: calculateGrowthPercentage(
          current.Subscribers.number,
          previous.Subscribers.number
        ),
        // Calculate increments
        followerIncrement: calculateIncrement(
          current.Followers.number,
          previous.Followers.number
        ),
        likeIncrement: calculateIncrement(
          current.Likes.number,
          previous.Likes.number
        ),
        subscriberIncrement: calculateIncrement(
          current.Subscribers.number,
          previous.Subscribers.number
        ),
      };

      console.log(`Updating metrics for ${date}...`);
      await updatePageMetrics(current.id, changes);
      updatedCount++;
    }

    console.log("\nMetrics calculation complete!");
    console.log(`Updated entries: ${updatedCount}`);
    console.log(`Skipped entries: ${skippedCount}`);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};
