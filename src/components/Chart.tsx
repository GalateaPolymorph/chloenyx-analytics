import type { ChartData, ChartOptions } from "chart.js";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type ChartProps = {
  data: ChartData<"line">;
  options?: ChartOptions<"line">;
};

const Chart = ({ data, options = {} }: ChartProps) => {
  const defaultOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Analytics Data",
      },
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <Line data={data} options={{ ...defaultOptions, ...options }} />
    </div>
  );
};

export default Chart;
