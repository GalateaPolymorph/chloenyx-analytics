import {
  DatePropertyItemObjectResponse,
  NumberPropertyItemObjectResponse,
  PageObjectResponse,
  SelectPropertyItemObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { DATABASE_ID, notionClient } from "./client";
import { DataType, NotionMetric } from "./types";

const parseMetric = (page: PageObjectResponse): NotionMetric => {
  const datumProp = page.properties.Datum as DatePropertyItemObjectResponse;
  const followersProp = page.properties
    .Followers as NumberPropertyItemObjectResponse;
  const subscribersProp = page.properties
    .Subscribers as NumberPropertyItemObjectResponse;
  const likesProp = page.properties.Likes as NumberPropertyItemObjectResponse;
  const dataTypeProp = page.properties[
    "Data Type"
  ] as SelectPropertyItemObjectResponse;

  // Growth rates
  const followerGrowthProp = page.properties[
    "Follower Growth"
  ] as NumberPropertyItemObjectResponse;
  const likeGrowthProp = page.properties[
    "Like Growth"
  ] as NumberPropertyItemObjectResponse;
  const subscriberGrowthProp = page.properties[
    "Subscriber Growth"
  ] as NumberPropertyItemObjectResponse;

  // Increments
  const followerIncrementProp = page.properties[
    "Follower Increment"
  ] as NumberPropertyItemObjectResponse;
  const likeIncrementProp = page.properties[
    "Like Increment"
  ] as NumberPropertyItemObjectResponse;
  const subscriberIncrementProp = page.properties[
    "Subscriber Increment"
  ] as NumberPropertyItemObjectResponse;

  if (!datumProp.date?.start) throw new Error("Missing date");
  if (followersProp.number === null) throw new Error("Missing followers count");
  if (subscribersProp.number === null)
    throw new Error("Missing subscribers count");
  if (likesProp.number === null) throw new Error("Missing likes count");
  if (!dataTypeProp.select?.name) throw new Error("Missing data type");

  return {
    id: page.id,
    Datum: {
      type: "date",
      date: {
        start: datumProp.date.start,
      },
    },
    Followers: {
      type: "number",
      number: followersProp.number,
    },
    Subscribers: {
      type: "number",
      number: subscribersProp.number,
    },
    Likes: {
      type: "number",
      number: likesProp.number,
    },
    "Data Type": {
      type: "select",
      select: {
        name: dataTypeProp.select.name as DataType,
      },
    },
    // Growth rates
    "Follower Growth": {
      type: "number",
      number: followerGrowthProp?.number ?? 0,
    },
    "Like Growth": {
      type: "number",
      number: likeGrowthProp?.number ?? 0,
    },
    "Subscriber Growth": {
      type: "number",
      number: subscriberGrowthProp?.number ?? 0,
    },
    // Increments
    "Follower Increment": {
      type: "number",
      number: followerIncrementProp?.number ?? 0,
    },
    "Like Increment": {
      type: "number",
      number: likeIncrementProp?.number ?? 0,
    },
    "Subscriber Increment": {
      type: "number",
      number: subscriberIncrementProp?.number ?? 0,
    },
  };
};

export const fetchMetrics = async (): Promise<NotionMetric[]> => {
  const response = await notionClient.databases.query({
    database_id: DATABASE_ID,
    sorts: [
      {
        property: "Datum",
        direction: "ascending",
      },
    ],
  });

  return response.results.map((page) =>
    parseMetric(page as PageObjectResponse)
  );
};

export const getLatestMetrics = async (): Promise<NotionMetric | null> => {
  const response = await notionClient.databases.query({
    database_id: DATABASE_ID,
    sorts: [
      {
        property: "Datum",
        direction: "descending",
      },
    ],
    page_size: 1,
  });

  if (response.results.length === 0) {
    return null;
  }

  return parseMetric(response.results[0] as PageObjectResponse);
};

export const addMetricEntry = async (
  date: string,
  followers: number,
  subscribers: number,
  likes: number,
  dataType: DataType = "Manual"
) => {
  await notionClient.pages.create({
    parent: {
      database_id: DATABASE_ID,
    },
    properties: {
      Datum: {
        type: "date",
        date: {
          start: date,
        },
      },
      Followers: {
        type: "number",
        number: followers,
      },
      Subscribers: {
        type: "number",
        number: subscribers,
      },
      Likes: {
        type: "number",
        number: likes,
      },
      "Data Type": {
        type: "select",
        select: {
          name: dataType,
        },
      },
    },
  });
};
