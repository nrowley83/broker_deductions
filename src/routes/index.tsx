import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardBody, CardHeader, CardTitle } from "@buildoutinc/blueprint-react/ui/Card";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      {
        title: "Buildout Prototypes",
      },
    ],
  }),
});

function Home() {
  return (
    <div className="p-8 container">
      <Card className="shadow">
        <CardBody className="p-6">
          <h1 className="fs-display2 lh-display2 fw-bold">
            Buildout Prototypes
          </h1>
          <p className="fs-large text-muted m-0">
            Start your prompt for a Buildout prototype.
          </p>
        </CardBody>
      </Card>

      <div className="row g-4 mt-2">
        <div className="col-md-4">
          <Link to="/app" className="text-decoration-none">
            <Card className="shadow-sm h-100">
              <CardHeader>
                <CardTitle>App Shell</CardTitle>
              </CardHeader>
              <CardBody>
                Prototype canvas with Buildout navbar and sidebar. Add new
                prototype routes under <code>/app</code> to render them inside
                this layout.
              </CardBody>
            </Card>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/app/reports" className="text-decoration-none">
            <Card className="shadow-sm h-100">
              <CardHeader>
                <CardTitle>Reports</CardTitle>
              </CardHeader>
              <CardBody>
                Standard reports directory showing Listings, Deals, Commissions,
                and Back Office report categories.
              </CardBody>
            </Card>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/app/quickbooks-contact-sync" className="text-decoration-none">
            <Card className="shadow-sm h-100">
              <CardHeader>
                <CardTitle>QuickBooks Contact Sync</CardTitle>
              </CardHeader>
              <CardBody>
                Voucher billing screen (Step 4) — gross commission fields,
                payers, receivables, and payables.
              </CardBody>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
