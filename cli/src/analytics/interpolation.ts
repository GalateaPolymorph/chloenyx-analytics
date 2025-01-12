import { NotionMetric } from "../notion/types";

type MetricValue = {
  date: Date;
  followers: number;
  subscribers: number;
  likes: number;
};

export const parseDate = (dateStr: string): Date => new Date(dateStr);

export const formatDate = (date: Date): string =>
  date.toISOString().split("T")[0];

export const getDaysBetween = (start: Date, end: Date): Date[] => {
  const days: Date[] = [];
  const current = new Date(start);

  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
};

export const interpolateValue = (
  startValue: number,
  endValue: number,
  totalSteps: number,
  currentStep: number
): number => {
  const difference = endValue - startValue;
  const stepSize = difference / (totalSteps + 1);
  return Math.round(startValue + stepSize * currentStep);
};

export const interpolateMetrics = (metrics: NotionMetric[]): MetricValue[] => {
  if (metrics.length < 2) return [];

  const sortedMetrics = [...metrics].sort(
    (a, b) =>
      parseDate(a.Datum.date.start).getTime() -
      parseDate(b.Datum.date.start).getTime()
  );

  const interpolatedValues: MetricValue[] = [];

  for (let i = 0; i < sortedMetrics.length - 1; i++) {
    const currentMetric = sortedMetrics[i];
    const nextMetric = sortedMetrics[i + 1];

    const startDate = parseDate(currentMetric.Datum.date.start);
    const endDate = parseDate(nextMetric.Datum.date.start);

    const daysBetween = getDaysBetween(startDate, endDate).slice(1, -1);

    if (daysBetween.length === 0) continue;

    daysBetween.forEach((date, index) => {
      interpolatedValues.push({
        date,
        followers: interpolateValue(
          currentMetric.Followers.number,
          nextMetric.Followers.number,
          daysBetween.length,
          index + 1
        ),
        subscribers: interpolateValue(
          currentMetric.Subscribers.number,
          nextMetric.Subscribers.number,
          daysBetween.length,
          index + 1
        ),
        likes: interpolateValue(
          currentMetric.Likes.number,
          nextMetric.Likes.number,
          daysBetween.length,
          index + 1
        ),
      });
    });
  }

  return interpolatedValues;
};
