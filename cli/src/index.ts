import { Command } from "commander";
import { calculateGrowth } from "./commands/calculate-growth";
import { interpolate } from "./commands/interpolate";
import { menu } from "./commands/menu";

const program = new Command();

program
  .name("chloenyx-analytics")
  .description("Analytics tool for Chloenyx Notion database")
  .version("1.0.0");

program.command("menu").action(menu);
program.command("interpolate").action(interpolate);
program.command("growth").action(calculateGrowth);

// If no command is provided, show the menu
if (process.argv.length <= 2) {
  menu();
} else {
  program.parse();
}
