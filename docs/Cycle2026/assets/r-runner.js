const WEBR_MODULE_URL = "https://webr.r-wasm.org/v0.6.0/webr.mjs";

const STUDENTS_FIXTURE = `students <- data.frame(
  student_id = c(
    "S001", "S002", "S003", "S004", "S005", "S006",
    "S007", "S008", "S009", "S010", "S011", "S012"
  ),
  major = c(
    "Mathematics", "Biology", "Public Health", "Mathematics",
    "Biology", "Public Health", "Mathematics", "Biology",
    "Public Health", "Mathematics", "Biology", "Public Health"
  ),
  study_hours = c(2.5, 4.0, 1.5, 5.5, 3.0, 2.0, 4.5, 1.0, 3.5, 2.8, 4.2, 1.8),
  attendance_pct = c(78, 92, 70, 96, 85, 74, 88, 62, 90, 82, 94, 68),
  quiz_score = c(68, 84, 61, 93, 76, 65, 87, 55, 81, 73, 89, 60),
  completed = c(TRUE, TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, FALSE, TRUE, TRUE, TRUE, FALSE),
  stringsAsFactors = FALSE
)`;

const CONTEXTS = {
  base: {
    packages: [],
    setup: "",
  },
  scores: {
    packages: [],
    setup: "scores <- c(68, 84, NA, 93, 76)",
  },
  students: {
    packages: [],
    setup: STUDENTS_FIXTURE,
  },
  "students-dplyr": {
    packages: ["dplyr"],
    setup: `suppressPackageStartupMessages(library(dplyr))\n\n${STUDENTS_FIXTURE}`,
  },
  "students-ggplot2": {
    packages: ["ggplot2"],
    setup: `suppressPackageStartupMessages(library(ggplot2))\n\n${STUDENTS_FIXTURE}`,
  },
};

const runtimeMessage = document.querySelector("[data-r-runtime-message]");
const runtimeRetry = document.querySelector("[data-r-runtime-retry]");
const runnableBlocks = [...document.querySelectorAll("[data-r-runnable]")];
const examples = [];
const installedPackages = new Set();

let runtimePromise;
let activeWebR;
let isBusy = false;

function setRuntimeMessage(message, state = "idle") {
  if (!runtimeMessage) return;
  runtimeMessage.textContent = message;
  runtimeMessage.dataset.state = state;
}

function setExampleStatus(example, message) {
  example.status.textContent = message;
  example.status.hidden = !message;
}

function refreshRunButtons() {
  examples.forEach((example) => {
    example.run.disabled = isBusy || !example.editor.value.trim();
  });
}

function setBusy(nextBusy) {
  isBusy = nextBusy;
  refreshRunButtons();
}

function clearResult(example) {
  example.cell.classList.remove("has-r-error");
  example.result.hidden = true;
  example.resultText.hidden = true;
  example.resultText.textContent = "";
  example.plots.replaceChildren();
}

function showTextResult(example, text, isError = false) {
  example.cell.classList.toggle("has-r-error", isError);
  example.result.hidden = false;
  example.resultText.hidden = false;
  example.resultText.textContent = text;
}

function enhanceExample(cell, index) {
  const source = cell.querySelector("pre");
  const sourceCode = source?.querySelector("code");
  const header = cell.querySelector(".code-label");

  if (!source || !sourceCode || !header) return;

  const number = String(index + 1).padStart(2, "0");
  const titleNode = header.querySelector("span:last-child");
  const title = titleNode?.textContent.trim() || `Example ${number}`;
  const titleId = `r-example-${number}-title`;
  const editorId = `r-editor-${number}`;
  const helpId = `r-editor-help-${number}`;
  const outputId = `r-output-${number}`;
  const outputTitleId = `${outputId}-title`;
  const defaultCode = sourceCode.textContent.replace(/\s+$/, "");

  if (titleNode) titleNode.id = titleId;
  cell.classList.add("r-example");
  cell.setAttribute("role", "group");
  cell.setAttribute("aria-labelledby", titleId);
  header.classList.add("r-code-header");
  source.classList.add("r-code-source");
  source.setAttribute("aria-label", `R code: ${title}`);

  const actions = document.createElement("div");
  actions.className = "r-actions";

  const run = document.createElement("button");
  run.className = "r-run";
  run.type = "button";
  run.textContent = "Run";
  run.setAttribute("aria-controls", outputId);

  const reset = document.createElement("button");
  reset.className = "r-reset";
  reset.type = "button";
  reset.textContent = "Reset code";
  reset.disabled = true;

  actions.append(run, reset);
  header.append(actions);

  const editorShell = document.createElement("div");
  editorShell.className = "r-editor-shell";

  const editorLabel = document.createElement("label");
  editorLabel.className = "visually-hidden";
  editorLabel.htmlFor = editorId;
  editorLabel.textContent = `Editable R code: ${title}`;

  const editor = document.createElement("textarea");
  editor.id = editorId;
  editor.className = "r-editor";
  editor.value = defaultCode;
  editor.rows = Math.min(18, Math.max(6, defaultCode.split("\n").length + 1));
  editor.wrap = "off";
  editor.spellcheck = false;
  editor.autocapitalize = "off";
  editor.autocomplete = "off";
  editor.setAttribute("aria-describedby", helpId);
  editor.setAttribute("aria-keyshortcuts", "Control+Enter Meta+Enter");

  const editorHelp = document.createElement("p");
  editorHelp.id = helpId;
  editorHelp.className = "r-editor-help";
  editorHelp.textContent = "Runs all lines from top to bottom. Shortcut: Ctrl+Enter or Command+Enter.";

  editorShell.append(editorLabel, editor, editorHelp);

  const status = document.createElement("p");
  status.className = "r-example-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.setAttribute("aria-atomic", "true");
  status.hidden = true;

  const result = document.createElement("section");
  result.id = outputId;
  result.className = "r-result";
  result.setAttribute("aria-labelledby", outputTitleId);
  result.hidden = true;

  const resultTitle = document.createElement("h4");
  resultTitle.id = outputTitleId;
  resultTitle.className = "r-result-title";
  resultTitle.textContent = "Your output";

  const resultText = document.createElement("pre");
  resultText.className = "r-result-text";
  resultText.tabIndex = 0;
  resultText.setAttribute("aria-label", "R output");
  resultText.hidden = true;

  const plots = document.createElement("div");
  plots.className = "r-result-plots";
  plots.setAttribute("aria-label", "Plot output");

  result.append(resultTitle, resultText, plots);
  source.after(editorShell, status, result);
  cell.classList.add("is-enhanced");

  const example = {
    cell,
    sourceCode,
    editor,
    run,
    reset,
    status,
    result,
    resultText,
    plots,
    defaultCode,
    context: cell.dataset.rContext || "base",
  };

  editor.addEventListener("input", () => {
    sourceCode.textContent = editor.value;
    reset.disabled = editor.value === defaultCode;
    refreshRunButtons();
  });

  editor.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && !run.disabled) {
      event.preventDefault();
      runExample(example);
    }
  });

  reset.addEventListener("click", () => {
    editor.value = defaultCode;
    sourceCode.textContent = defaultCode;
    reset.disabled = true;
    clearResult(example);
    setExampleStatus(example, "Original code restored.");
    editor.focus();
    refreshRunButtons();
  });

  run.addEventListener("click", () => runExample(example));
  examples.push(example);
}

async function getRuntime() {
  if (!runtimePromise) {
    runtimePromise = (async () => {
      setRuntimeMessage("Starting R in your browser…", "loading");
      if (runtimeRetry) runtimeRetry.hidden = true;

      const { WebR } = await import(WEBR_MODULE_URL);
      const webR = new WebR();
      await webR.init();
      activeWebR = webR;
      setRuntimeMessage("R is ready. Each example uses an independent execution environment.", "ready");
      return webR;
    })().catch((error) => {
      runtimePromise = undefined;
      activeWebR = undefined;
      const offlineHint = navigator.onLine === false ? " You appear to be offline." : "";
      setRuntimeMessage(
        `R could not start.${offlineHint} Check your connection and retry; static content remains available.`,
        "error",
      );
      if (runtimeRetry) runtimeRetry.hidden = false;
      throw error;
    });
  }

  return runtimePromise;
}

async function ensurePackages(webR, packageNames) {
  const missing = packageNames.filter((packageName) => !installedPackages.has(packageName));
  if (!missing.length) return;

  const packageLabel = missing.join(" and ");
  setRuntimeMessage(`R is ready. Loading ${packageLabel} for this example…`, "loading");
  try {
    await webR.installPackages(missing, { quiet: true });
    missing.forEach((packageName) => installedPackages.add(packageName));
    setRuntimeMessage("R is ready. Each example uses an independent execution environment.", "ready");
  } catch (error) {
    setRuntimeMessage(
      `R started, but ${packageLabel} could not be loaded. Check your connection, then run this example again.`,
      "error",
    );
    throw error;
  }
}

async function conditionText(item) {
  if (typeof item?.data === "string") return item.data;
  if (item?.data == null) return "";

  try {
    const message = await item.data.getDollar("message");
    const text = await message.toString();
    if (text && text !== "[object Object]") return text;
  } catch (_) {
    // Not every captured item is an R condition with a message field.
  }

  try {
    const text = await item.data.toString();
    if (text && text !== "[object Object]") return text;
  } catch (_) {
    // Fall through to a stable label below.
  }

  return item.type || "R output";
}

function outputPrefix(type) {
  const label = typeof type === "string" && type ? type : "output";
  if (label === "stdout") return "";
  if (label === "stderr") return "Error: ";
  return `${label.charAt(0).toUpperCase()}${label.slice(1)}: `;
}

async function renderCapture(example, capture) {
  const lines = [];
  let hasError = false;

  for (const item of capture.output) {
    const text = (await conditionText(item)).replace(/\n+$/, "");
    if (!text) continue;
    hasError ||= item.type === "error" || item.type === "stderr";
    lines.push(`${outputPrefix(item.type)}${text}`);
  }

  example.plots.replaceChildren();
  capture.images.forEach((image, index) => {
    const figure = document.createElement("figure");
    figure.className = "r-plot-frame";

    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", `Plot ${index + 1} generated by the edited R code.`);

    const context = canvas.getContext("2d");
    if (context) context.drawImage(image, 0, 0);
    image.close?.();

    const caption = document.createElement("figcaption");
    caption.textContent = `Plot ${index + 1} generated by your code.`;
    figure.append(canvas, caption);
    example.plots.append(figure);
  });

  if (!lines.length) {
    lines.push(capture.images.length ? "Execution completed. Plot output appears below." : "Execution completed without printed output.");
  }

  showTextResult(example, lines.join("\n"), hasError);
  return hasError;
}

async function runExample(example) {
  if (isBusy || !example.editor.value.trim()) return;

  const configuration = CONTEXTS[example.context] || CONTEXTS.base;
  const codeAtRun = example.editor.value;
  const originalRunLabel = example.run.textContent;
  let shelter;
  let longRunTimer;

  setBusy(true);
  example.run.textContent = "Running…";
  example.editor.readOnly = true;
  example.reset.disabled = true;
  example.cell.setAttribute("aria-busy", "true");
  clearResult(example);
  setExampleStatus(example, "Preparing environment…");

  try {
    const webR = await getRuntime();
    await ensurePackages(webR, configuration.packages);

    setExampleStatus(example, "Running…");
    longRunTimer = window.setTimeout(() => {
      setExampleStatus(
        example,
        "This example is still running. Browser R cannot interrupt a long command here; reload the page if it does not finish.",
      );
    }, 15000);

    shelter = await new webR.Shelter();
    const environment = await shelter.evalR("new.env(parent = globalenv())");
    const completeCode = configuration.setup ? `${configuration.setup}\n\n${codeAtRun}` : codeAtRun;
    const capture = await shelter.captureR(completeCode, {
      env: environment,
      withAutoprint: true,
      captureStreams: true,
      captureConditions: true,
      throwJsException: false,
      captureGraphics: {
        capture: true,
        width: 760,
        height: 480,
        pointsize: 12,
        bg: "white",
      },
    });

    const hasError = await renderCapture(example, capture);
    setExampleStatus(
      example,
      hasError ? "R stopped with an error. See the output below." : "Execution complete.",
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const fileHint = window.location.protocol === "file:"
      ? " Open this tutorial through http:// or https:// instead of file://."
      : " Check your connection and try again.";
    showTextResult(example, `Error: ${message}${fileHint}`, true);
    setExampleStatus(example, "R stopped with an error. See the output below.");
  } finally {
    window.clearTimeout(longRunTimer);
    if (shelter) {
      try {
        await shelter.purge();
      } catch (_) {
        // The example result is already rendered; cleanup errors should not replace it.
      }
    }
    example.run.textContent = originalRunLabel;
    example.editor.readOnly = false;
    example.reset.disabled = example.editor.value === example.defaultCode;
    example.cell.removeAttribute("aria-busy");
    setBusy(false);
  }
}

runtimeRetry?.addEventListener("click", async () => {
  if (isBusy) return;
  runtimeRetry.disabled = true;
  setBusy(true);
  try {
    await getRuntime();
    runtimeRetry.hidden = true;
  } catch (_) {
    // getRuntime provides the visible recovery message.
  } finally {
    runtimeRetry.disabled = false;
    setBusy(false);
  }
});

runnableBlocks.forEach(enhanceExample);
refreshRunButtons();

window.addEventListener("offline", () => {
  if (!activeWebR) {
    setRuntimeMessage("You appear to be offline. Reconnect to run code; reading and editing still work.", "error");
    if (runtimeRetry) runtimeRetry.hidden = false;
  }
});
