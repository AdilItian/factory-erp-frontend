import {
  codeNameLabel,
  formatEntityDate,
  formatEnumLabel,
  getEntityName
} from '@/lib/entity';
import { formatMoney } from './cart';

/** Standard 80mm thermal roll (printable ~72mm). */
const RECEIPT_WIDTH_MM = 80;
const CONTENT_WIDTH_MM = 72;

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function discountLabel(sale) {
  const amount = formatMoney(sale.discount);
  if (!Number(sale.discount)) return null;
  if (sale.discountType === 'percent' && sale.discountPercent != null) {
    return `${amount} (${formatMoney(sale.discountPercent)}%)`;
  }
  return amount;
}

function outletParts(sale) {
  const location = sale.location;
  if (!location) return { title: 'Our store', subtitle: '' };
  const name = getEntityName(location, '');
  const code = location.code ? String(location.code) : '';
  if (name && code) return { title: name, subtitle: code };
  return { title: codeNameLabel(location), subtitle: '' };
}

function buildReceiptHtml(sale) {
  const { title: outletTitle, subtitle: outletCode } = outletParts(sale);
  const discount = discountLabel(sale);
  const itemCount = (sale.lines ?? []).reduce(
    (sum, line) => sum + (Number(line.quantity) || 0),
    0
  );

  const lines = (sale.lines ?? [])
    .map((line) => {
      const name = escapeHtml(getEntityName(line.item, line.itemId));
      const qty = escapeHtml(line.quantity);
      const unit = formatMoney(line.unitPrice);
      const total = formatMoney(line.lineTotal);
      return `
        <tr class="line">
          <td class="desc">
            <div class="item">${name}</div>
            <div class="meta">${qty} × ${unit}</div>
          </td>
          <td class="num">${total}</td>
        </tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Receipt ${escapeHtml(sale.code)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800&family=Nunito+Sans:opsz,wght@6..12,400;6..12,500;6..12,600;6..12,700&display=swap" rel="stylesheet" />
  <style>
    @page {
      size: ${RECEIPT_WIDTH_MM}mm auto;
      margin: 0;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink: #1a1a1a;
      --muted: #4a4a4a;
      --font-display: "Nunito", "Segoe UI", system-ui, sans-serif;
      --font-body: "Nunito Sans", "Segoe UI", system-ui, sans-serif;
    }

    html, body {
      width: ${RECEIPT_WIDTH_MM}mm;
      margin: 0;
      padding: 0;
      background: #fff;
      color: var(--ink);
      font-family: var(--font-body);
      font-size: 11px;
      line-height: 1.4;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body { display: flex; justify-content: center; }

    .ticket {
      width: ${CONTENT_WIDTH_MM}mm;
      max-width: ${CONTENT_WIDTH_MM}mm;
      padding: 4mm 2.5mm 10mm;
      overflow: hidden;
    }

    .ornament {
      text-align: center;
      font-size: 9px;
      letter-spacing: 0.12em;
      color: var(--muted);
      margin: 1.5mm 0;
    }

    .brand-block {
      text-align: center;
      padding: 1mm 0 2mm;
    }

    .brand {
      font-family: var(--font-display);
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.01em;
      line-height: 1.15;
    }

    .tagline {
      margin-top: 1.5mm;
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .store {
      text-align: center;
      margin-top: 2.5mm;
      padding: 2mm 0;
      border-top: 1px solid var(--ink);
      border-bottom: 1px solid var(--ink);
    }

    .store-name {
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 700;
    }

    .store-meta {
      margin-top: 1mm;
      font-size: 9.5px;
      color: var(--muted);
    }

    .hello {
      text-align: center;
      margin: 3mm 0 2mm;
      font-family: var(--font-display);
      font-size: 12.5px;
      font-weight: 700;
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      gap: 2mm;
      font-size: 9px;
      color: var(--muted);
      margin-bottom: 0.8mm;
    }

    .meta-row strong {
      color: var(--ink);
      font-weight: 600;
    }

    .rule {
      border: none;
      border-top: 1px dashed var(--ink);
      margin: 2.5mm 0;
    }

    .rule-double {
      border: none;
      border-top: 2px solid var(--ink);
      margin: 2mm 0 1mm;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    td {
      vertical-align: top;
      padding: 1.4mm 0;
      word-wrap: break-word;
    }

    td.desc { width: 66%; padding-right: 2mm; }
    td.num {
      width: 34%;
      text-align: right;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
      font-weight: 500;
    }

    .section-label {
      font-size: 8.5px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 1mm;
    }

    .item {
      font-weight: 600;
      font-size: 10.5px;
    }

    .meta {
      font-size: 9px;
      color: var(--muted);
      margin-top: 0.4mm;
    }

    .totals td {
      padding: 0.9mm 0;
      font-size: 10.5px;
    }

    .totals .label-muted { color: var(--muted); }

    .totals .grand td {
      font-family: var(--font-display);
      font-size: 15px;
      font-weight: 800;
      padding-top: 2mm;
      padding-bottom: 1.5mm;
    }

    .pay-note {
      margin-top: 1mm;
      font-size: 9px;
      color: var(--muted);
      text-align: center;
    }

    .invite {
      text-align: center;
      margin-top: 3.5mm;
      padding: 3mm 2mm;
      border: 1.5px solid var(--ink);
    }

    .invite-title {
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 800;
      line-height: 1.25;
    }

    .invite-body {
      margin-top: 1.5mm;
      font-size: 10px;
      color: var(--muted);
      line-height: 1.45;
    }

    .footer {
      text-align: center;
      margin-top: 3mm;
      font-size: 9px;
      color: var(--muted);
      line-height: 1.45;
    }

    .void-banner {
      text-align: center;
      font-weight: 700;
      letter-spacing: 0.12em;
      margin: 2mm 0;
      padding: 1.5mm;
      border: 2px solid var(--ink);
    }

    .receipt-barcode {
      text-align: center;
      margin-top: 3.5mm;
      padding-top: 2.5mm;
    }

    .receipt-barcode svg {
      display: inline-block;
      max-width: 100%;
      height: auto;
    }

    .receipt-barcode-hint {
      margin-top: 1mm;
      font-size: 8.5px;
      color: var(--muted);
      letter-spacing: 0.04em;
    }

    @media screen {
      html, body {
        min-height: 100%;
        background:
          radial-gradient(ellipse at top, #f3efe6 0%, #e4dfd4 55%, #d8d2c6 100%);
      }
      body { padding: 16px 0 28px; }
      .ticket {
        background: #fffef9;
        box-shadow:
          0 1px 0 rgba(0, 0, 0, 0.04),
          0 8px 24px rgba(40, 30, 20, 0.12);
      }
    }

    @media print {
      html, body {
        width: ${RECEIPT_WIDTH_MM}mm;
        background: #fff !important;
      }
      body { display: block; padding: 0; }
      .ticket {
        width: ${CONTENT_WIDTH_MM}mm;
        max-width: ${CONTENT_WIDTH_MM}mm;
        margin: 0 auto;
        background: #fff;
        box-shadow: none;
        padding: 2mm 2mm 8mm;
      }
    }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="ornament">✦ · · · · · · · · · · · · ✦</div>

    <div class="brand-block">
      <div class="brand">Factory</div>
      <div class="tagline">Goods · Made with care</div>
    </div>

    <div class="store">
      <div class="store-name">${escapeHtml(outletTitle)}</div>
      <div class="store-meta">
        ${outletCode ? `${escapeHtml(outletCode)} · ` : ''}
        ${escapeHtml(formatEntityDate(sale.soldAt))}
      </div>
    </div>

    ${
      sale.status === 'VOIDED'
        ? '<div class="void-banner">VOIDED SALE</div>'
        : '<p class="hello">Thanks for stopping by</p>'
    }

    <div class="meta-row">
      <span>Sale</span>
      <strong>${escapeHtml(sale.code)}</strong>
    </div>
    <div class="meta-row">
      <span>Items</span>
      <strong>${escapeHtml(String(itemCount))}</strong>
    </div>

    <hr class="rule" />
    <div class="section-label">Your order</div>
    <table>
      <tbody>${lines}</tbody>
    </table>

    <hr class="rule-double" />
    <table class="totals">
      <tbody>
        <tr>
          <td class="label-muted">Subtotal</td>
          <td class="num">${formatMoney(sale.subtotal)}</td>
        </tr>
        ${
          discount
            ? `<tr>
          <td class="label-muted">Discount</td>
          <td class="num">−${escapeHtml(discount)}</td>
        </tr>`
            : ''
        }
        <tr class="grand">
          <td>Total</td>
          <td class="num">${formatMoney(sale.total)}</td>
        </tr>
      </tbody>
    </table>

    <p class="pay-note">
      Paid by ${escapeHtml(formatEnumLabel(sale.paymentMethod))}
      · ${formatMoney(sale.tendered)}
      ${
        sale.paymentMethod === 'CASH' && Number(sale.change) > 0
          ? ` · Change ${formatMoney(sale.change)}`
          : ''
      }
    </p>

    <div class="invite">
      <div class="invite-title">Come see us again</div>
      <div class="invite-body">
        Fresh drops, warm welcome, and staff who remember your favourites.
        Bring this receipt anytime — we’d love another visit.
      </div>
    </div>

    <div class="footer">
      Keep for exchanges within 7 days<br />
      with tags attached · Original payment method
    </div>

    <div class="receipt-barcode">
      <svg id="receipt-barcode"></svg>
      <div class="receipt-barcode-hint">Scan for returns · ${escapeHtml(sale.code)}</div>
    </div>

    <div class="ornament">✦  see you soon  ✦</div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>
  <script>
    window.onload = function () {
      var code = ${JSON.stringify(String(sale.code ?? ''))};
      try {
        if (window.JsBarcode && code) {
          window.JsBarcode('#receipt-barcode', code, {
            format: 'CODE128',
            width: 1.35,
            height: 38,
            displayValue: false,
            margin: 0,
            background: '#ffffff',
            lineColor: '#000000'
          });
        }
      } catch (err) {}
      window.focus();
      setTimeout(function () { window.print(); }, 180);
    };
  </script>
</body>
</html>`;
}

/**
 * Opens a print-ready 80mm thermal receipt for a POS sale.
 * @returns {boolean} false if the browser blocked the popup
 */
export function printPosReceipt(sale) {
  if (!sale || typeof window === 'undefined') return false;

  const popup = window.open('', '_blank', 'width=320,height=720');
  if (!popup) return false;

  popup.document.open();
  popup.document.write(buildReceiptHtml(sale));
  popup.document.close();
  return true;
}
