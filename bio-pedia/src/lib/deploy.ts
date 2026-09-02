import { createServerFn } from "@tanstack/react-start";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export const deployWebsite = createServerFn({ method: "POST" }).handler(async () => {
  const cwd = process.cwd();

  try {
    await execFileAsync("npm", ["run", "build:prod"], {
      cwd,
      env: process.env,
      shell: true,
    });

    const deployCommand = process.env.DEPLOY_COMMAND || "npm run preview -- --host 0.0.0.0";
    await execFileAsync(deployCommand, {
      cwd,
      env: process.env,
      shell: true,
    });

    return {
      success: true,
      message: "Production build and local deployment command completed successfully.",
      url: process.env.SITE_URL || "http://localhost:4173",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown deployment error";
    throw new Error(`Deploy failed: ${message}`);
  }
});
