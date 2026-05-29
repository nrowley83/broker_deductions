import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faSignHanging,
  faCalendarClock,
  faHandshakeAngle,
  faDollarSign,
  faRankingStar,
  faFileInvoiceDollar,
  faBriefcaseClock,
  faMoneyCheckDollar,
  faFileLines,
  faMoneyBillTransfer,
  faCreditCard,
  faCalculator,
  faTriangleExclamation,
  faArrowTrendUp,
  faArrowTrendDown,
  faSpinner,
} from "@fortawesome/pro-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export const Route = createFileRoute("/app/reports")({
  component: ReportsPage,
});

// ─── Types ───────────────────────────────────────────────────────────────────

type MetricCard = {
  title: string;
  value: string;
  trend: { direction: "up" | "down"; percentage: string } | null;
  comparison: string | null;
};

type QueryResult =
  | { status: "ok"; cards: MetricCard[] }
  | { status: "error"; message: string };

// ─── Server function ─────────────────────────────────────────────────────────

const queryMetrics = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const d = data as { query: string };
    if (!d?.query?.trim()) throw new Error("Query is required");
    return d as { query: string };
  })
  .handler(async ({ data }): Promise<QueryResult> => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        status: "error",
        message:
          "ANTHROPIC_API_KEY is not set. Add it to your .env file and restart the dev server.",
      };
    }

    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 1024,
      output_config: { effort: "low" },
      messages: [
        {
          role: "user",
          content: `You are a commercial real estate brokerage data API. Generate 2–4 KPI metric cards for this query: "${data.query}"

Return ONLY valid JSON — a single array, no markdown, no extra text:
[
  {
    "title": "metric label",
    "value": "formatted value e.g. '$ 5,259,756.00' or '42%' or '1,234'",
    "trend": {"direction": "up", "percentage": "492.3%"} or null,
    "comparison": "Jan 1, 2021 - Jun 30, 2021: $ 888,000.00" or null
  }
]

Use realistic Buildout CRE brokerage data. Include dollar signs with a space before the number for currency.`,
        },
      ],
    });

    try {
      const text =
        response.content[0].type === "text" ? response.content[0].text : "";
      const cards = JSON.parse(text.trim()) as MetricCard[];
      return { status: "ok", cards };
    } catch {
      return {
        status: "error",
        message: "Failed to parse response from Claude. Please try again.",
      };
    }
  });

// ─── Report sections ──────────────────────────────────────────────────────────

type ReportItem = {
  icon: IconDefinition;
  title: string;
  description: string;
};

type ReportSection = {
  heading: string;
  reports: ReportItem[];
};

const sections: ReportSection[] = [
  {
    heading: "LISTINGS",
    reports: [
      {
        icon: faSignHanging,
        title: "Inventory Report",
        description:
          "Generate a PDF report showcasing properties available for sale or for lease.",
      },
    ],
  },
  {
    heading: "DEALS",
    reports: [
      {
        icon: faCalendarClock,
        title: "Critical Dates Report",
        description:
          "Report on upcoming critical dates such as lease expirations.",
      },
      {
        icon: faHandshakeAngle,
        title: "Pipeline Report",
        description: "Report on deals across all stages of your pipeline.",
      },
    ],
  },
  {
    heading: "COMMISSIONS",
    reports: [
      {
        icon: faDollarSign,
        title: "Commissions Report",
        description:
          "Report on internal broker commissions from your deal pipeline and vouchers.",
      },
      {
        icon: faRankingStar,
        title: "Broker Leaderboard Report",
        description: "Compare your brokers' total commission earnings.",
      },
    ],
  },
  {
    heading: "BACK OFFICE",
    reports: [
      {
        icon: faFileInvoiceDollar,
        title: "Vouchers Report",
        description:
          "Report on transaction-level data from draft, submitted, and approved vouchers.",
      },
      {
        icon: faBriefcaseClock,
        title: "Receivables Report",
        description:
          "Track open receivables, money that's due to be collected by the brokerage.",
      },
      {
        icon: faMoneyCheckDollar,
        title: "Deposits Report",
        description:
          "Report on past deposits, money that's already been collected by the brokerage.",
      },
      {
        icon: faFileLines,
        title: "Other Credits Report",
        description:
          "Report on other receivable credits, money that could not be collected.",
      },
      {
        icon: faMoneyBillTransfer,
        title: "Payables Report",
        description:
          "Track open payables, money that's due to be paid out to brokers.",
      },
      {
        icon: faCreditCard,
        title: "Payments Report",
        description:
          "Report on past payments, money that's already been paid out to brokers.",
      },
      {
        icon: faCalculator,
        title: "Deductions Report",
        description:
          "Track open deductions, money that's due to be deducted from deposits or payments.",
      },
    ],
  },
];

// ─── Metric card component ────────────────────────────────────────────────────

function MetricCardDisplay({ card }: { card: MetricCard }) {
  return (
    <div
      className="card h-100"
      style={{ minWidth: 220 }}
    >
      <div className="card-body p-4">
        <div className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
          {card.title}
        </div>
        <div className="d-flex align-items-baseline gap-2 flex-wrap">
          <span className="fw-bold" style={{ fontSize: "1.75rem", lineHeight: 1.1 }}>
            {card.value}
          </span>
          {card.trend && (
            <span
              className={card.trend.direction === "up" ? "text-success" : "text-danger"}
              style={{ fontSize: "1rem", fontWeight: 500 }}
            >
              <FontAwesomeIcon
                icon={card.trend.direction === "up" ? faArrowTrendUp : faArrowTrendDown}
                className="me-1"
              />
              {card.trend.percentage}
            </span>
          )}
        </div>
        {card.comparison && (
          <div className="text-muted mt-2" style={{ fontSize: "0.8rem" }}>
            {card.comparison}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page component ───────────────────────────────────────────────────────────

function ReportsPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await queryMetrics({ data: { query } });
      setResult(res);
    } catch {
      setResult({ status: "error", message: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Page header */}
      <div className="align-items-center my-6 row">
        <div className="align-self-start col-auto">
          <div className="p-3 bg-storm-grey-100 rounded text-primary">
            <FontAwesomeIcon icon={faChartSimple} size="2x" />
          </div>
        </div>
        <div className="col">
          <h5 className="fw-bold">Reports</h5>
          <div className="mt-1 fs-large fw-light">
            View and analyze data about your company
          </div>
        </div>
        <div className="col-auto">
          <button type="button" className="btn btn-primary">
            New Report
          </button>
        </div>
      </div>

      {/* Natural language query input */}
      <div className="row mb-4">
        <div className="col">
          <form onSubmit={handleSubmit}>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder={'Ask about your data… e.g. “Total pipeline value YTD” or “Commission earnings this quarter”'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="btn btn-primary flex-shrink-0"
                disabled={loading || !query.trim()}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                    Analyzing…
                  </>
                ) : (
                  "Analyze"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Metric cards result */}
      {result?.status === "error" && (
        <div className="alert alert-warning d-flex align-items-center gap-2 mb-4">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          {result.message}
        </div>
      )}

      {result?.status === "ok" && (
        <div className="row g-3 mb-5">
          {result.cards.map((card, i) => (
            <div key={i} className="col-12 col-sm-6 col-lg-3">
              <MetricCardDisplay card={card} />
            </div>
          ))}
        </div>
      )}

      {/* Content row: sidebar + main */}
      <div className="row">
        {/* Left sidebar nav */}
        <div className="col-auto pt-3">
          <div className="flex-column nav nav-pills" role="tablist">
            <div className="nav-item">
              <a role="tab" className="nav-link active" href="#">
                Standard reports
              </a>
            </div>
            <div className="nav-item">
              <a role="tab" className="nav-link" href="#">
                My reports
              </a>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="col">
          <div className="tab-content">
            <div
              className="pe-0 tab-pane active"
              style={{ padding: "12px 0px 12px 12px" }}
            >
              {sections.map((section, i) => (
                <div key={section.heading}>
                  <h6
                    className={`text-muted mb-2 ${i === 0 ? "mt-0" : "mt-5"}`}
                  >
                    {section.heading}
                  </h6>
                  <div className="d-flex flex-column gap-3">
                    {section.reports.map((report) => (
                      <div key={report.title}>
                        <div className="card">
                          <div className="card-body">
                            <div className="row">
                              <div
                                className="clickable col-auto"
                                style={{ cursor: "pointer" }}
                              >
                                <div className="p-3 bg-storm-grey-100 rounded text-primary">
                                  <FontAwesomeIcon icon={report.icon} size="2x" />
                                </div>
                              </div>
                              <div
                                className="clickable col"
                                style={{ cursor: "pointer" }}
                              >
                                <div className="my-0 fw-bold fs-large">
                                  {report.title}
                                </div>
                                <div className="mt-2">{report.description}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
