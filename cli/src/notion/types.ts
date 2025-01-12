export type DataType = "Manual" | "Interpolation";

export type NotionMetric = {
  id: string;
  Datum: {
    type: "date";
    date: {
      start: string;
    };
  };
  Followers: {
    type: "number";
    number: number;
  };
  Subscribers: {
    type: "number";
    number: number;
  };
  Likes: {
    type: "number";
    number: number;
  };
  "Data Type": {
    type: "select";
    select: {
      name: DataType;
    };
  };
  // Growth rates
  "Follower Growth": {
    type: "number";
    number: number;
  };
  "Like Growth": {
    type: "number";
    number: number;
  };
  "Subscriber Growth": {
    type: "number";
    number: number;
  };
  // Increments
  "Follower Increment": {
    type: "number";
    number: number;
  };
  "Like Increment": {
    type: "number";
    number: number;
  };
  "Subscriber Increment": {
    type: "number";
    number: number;
  };
};
