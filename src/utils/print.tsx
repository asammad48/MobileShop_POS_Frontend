// src/utils/print.ts
export interface PrintOptions {
  title?: string;
  styles?: string;
  onBeforePrint?: () => void;
  onAfterPrint?: () => void;
}

/**
 * printElement()
 * ------------------
 * Prints any DOM element by its ID into a hidden iframe.
 */
export async function printElement(
  elementId: string,
  options: PrintOptions = {}
): Promise<void> {
  const { title, styles, onBeforePrint, onAfterPrint } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`❌ Element with id "${elementId}" not found`);
    return;
  }

  const originalTitle = document.title;
  if (title) document.title = title;

  if (onBeforePrint) onBeforePrint();

  // Clone the target element so we don't mutate original DOM
  const printContent = element.cloneNode(true) as HTMLElement;

  // Collect all in-page styles
  const stylesheets = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n");
      } catch {
        return ""; // ignore cross-origin styles
      }
    })
    .join("\n");

  // External link styles
  const linkTags = Array.from(
    document.querySelectorAll('link[rel="stylesheet"]')
  )
    .map((link) => link.outerHTML)
    .join("\n");

  // Create an invisible iframe
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";

  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    throw new Error("Unable to access print iframe document");
  }

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title || document.title}</title>
        ${linkTags}
        <style>
          ${stylesheets}
          ${getDefaultPrintStyles()}
          ${styles || ""}
        </style>
      </head>
      <body>
        <div
          style="
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #111;
            line-height: 1.4;
            padding-bottom: 16px;
            border-bottom: 2px solid #e5e5e5;
          "
        >
        <!-- Left section: Company info -->
        <div>
          <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 8px 0;">
            Sell POS
          </h1>
          </div>
          <div>
          
            <div>
              <p style="margin: 2px 0; font-size: 14px;">
                
                1234 Business Avenue, Suite 500<br />
                San Francisco, CA 94102
              </p>
              <p style="margin: 2px 0; font-size: 14px;">
                
                +1 (555) 123-4567
              </p>
              <p style="margin: 2px 0; font-size: 14px;">
                
                info@sellpos.com
              </p>
            </div>
            
          </div>
      </div>

        ${printContent.outerHTML}
      </body>
    </html>
  `);
  doc.close();

  // Wait for DOM ready before printing
  await new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (doc.readyState === "complete") {
        clearInterval(interval);
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          resolve();
        }, 250);
      }
    }, 50);
  });

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(iframe);
    document.title = originalTitle;
    if (onAfterPrint) onAfterPrint();
  }, 500);
}

function getDefaultPrintStyles(): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4; margin: 20mm; }
    body {
      font-family: 'Arial', sans-serif;
      font-size: 12pt;
      color: #000;
      background: #fff;
      line-height: 1.6;
    }
    h1, h2, h3 { font-weight: bold; margin-bottom: 12pt; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #444;
      padding: 8pt;
      text-align: left;
    }
    th {
      background: #f4f4f4;
      font-weight: bold;
    }
    .no-print { display: none !important; }
  `;
}

/**
 * Helper shortcut to print a standard element ID
 */
export function printDocument(title?: string): Promise<void> {
  return printElement("printable-document", { title });
}
