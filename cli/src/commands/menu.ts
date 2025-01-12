import inquirer from "inquirer";
import { calculateGrowth } from "./calculate-growth";
import { interpolate } from "./interpolate";
import { summary } from "./summary";
import { visualize } from "./visualize";

type Command = {
  name: string;
  value: string;
  description: string;
  action: () => Promise<void>;
};

const commands: Command[] = [
  {
    name: "Interpolate missing days",
    value: "interpolate",
    description: "Fill in missing days with interpolated values",
    action: interpolate,
  },
  {
    name: "Show metrics summary",
    value: "summary",
    description: "Display a summary of all metrics",
    action: summary,
  },
  {
    name: "Calculate Growth",
    value: "growth",
    description: "Calculate and update growth metrics",
    action: calculateGrowth,
  },
  {
    name: "Visualize Metrics",
    value: "visualize",
    description:
      "Generate a chart showing followers, likes, and subscribers trends",
    action: visualize,
  },
  {
    name: "Exit",
    value: "exit",
    description: "Exit the application",
    action: async () => process.exit(0),
  },
];

export const menu = async () => {
  while (true) {
    const { command } = await inquirer.prompt([
      {
        type: "list",
        name: "command",
        message: "What would you like to do?",
        choices: commands.map((cmd) => ({
          name: `${cmd.name} - ${cmd.description}`,
          value: cmd.value,
        })),
      },
    ]);

    if (command === "exit") {
      console.log("Goodbye!");
      process.exit(0);
    }

    const selectedCommand = commands.find((cmd) => cmd.value === command);
    if (selectedCommand) {
      await selectedCommand.action();
      // Add a small pause between commands
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};
