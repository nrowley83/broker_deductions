import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faEllipsisVertical,
  faCirclePlus,
  faCircleInfo,
  faPaperclip,
  faFileLines,
  faThumbTack,
  faClockRotateLeft,
  faReceipt,
  faCircleExclamation,
} from "@fortawesome/pro-regular-svg-icons";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@buildoutinc/blueprint-react/ui/Table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@buildoutinc/blueprint-react/ui/Tooltip";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
} from "@buildoutinc/blueprint-react/ui/Modal";
import {
  Combobox,
  ComboboxInputGroup,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@buildoutinc/blueprint-react/ui/Combobox";

export const Route = createFileRoute("/app/quickbooks-contact-sync")({
  component: QuickBooksContactSync,
});

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: "Deal" },
  { number: 2, label: "Contacts" },
  { number: 3, label: "Commissions" },
  { number: 4, label: "Billing" },
  { number: 5, label: "Preview & Submit" },
];
const ACTIVE_STEP = 4;

function StepIndicator() {
  return (
    <div className="d-flex w-100" style={{ borderBottom: "1px solid var(--bs-border-color)" }}>
      {STEPS.map((step) => {
        const active = step.number === ACTIVE_STEP;
        const past = step.number < ACTIVE_STEP;
        return (
          <div
            key={step.number}
            className="flex-fill d-flex flex-column align-items-center justify-content-center position-relative py-3"
            style={{ borderTop: active ? "3px solid #3b3fa5" : "3px solid transparent" }}
          >
            <span
              className={`fw-bold lh-1 ${active ? "text-primary" : past ? "text-secondary" : "text-muted"}`}
              style={{ fontSize: active ? 22 : 20 }}
            >
              {step.number}
            </span>
            <span
              className={`mt-1 ${active ? "text-primary fw-semibold" : "text-muted"}`}
              style={{ fontSize: 12 }}
            >
              {step.label}
            </span>
            {step.number < STEPS.length && (
              <div
                className="position-absolute top-0 end-0 h-100 d-flex align-items-center"
                style={{ color: "var(--bs-border-color)", fontSize: 24, marginRight: -4, zIndex: 1 }}
              >
                ›
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function SidebarItem({ icon, label, active }: { icon: typeof faReceipt; label: string; active?: boolean }) {
  return (
    <div
      className={`d-flex align-items-center gap-2 px-2 py-1 rounded ${active ? "bg-light fw-medium" : "text-muted"}`}
      style={{ fontSize: 13, cursor: "pointer" }}
    >
      <FontAwesomeIcon icon={icon} style={{ width: 14 }} />
      {label}
    </div>
  );
}

function SidebarGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <div
        className="d-flex align-items-center justify-content-between px-2 py-1 text-muted fw-semibold"
        style={{ fontSize: 11, letterSpacing: "0.05em", cursor: "pointer" }}
      >
        {label} <span style={{ fontSize: 10 }}>∧</span>
      </div>
      {children}
    </div>
  );
}

// ─── QuickBooks icon ──────────────────────────────────────────────────────────

function QBIcon({ connected, onClick }: { connected: boolean; onClick?: () => void }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              onClick={onClick}
              className="btn btn-link btn-sm p-0 border-0 d-flex align-items-center justify-content-center"
              style={{ width: 22, height: 22, lineHeight: 1 }}
            />
          }
        >
          {connected ? (
            <span
              className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
              style={{ width: 20, height: 20, fontSize: 11, background: "#2ca01c" }}
            >
              Q
            </span>
          ) : (
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="text-danger"
              style={{ fontSize: 18 }}
            />
          )}
        </TooltipTrigger>
        <TooltipContent>
          {connected
            ? "Connected to QuickBooks customer"
            : "No QuickBooks Customer connected. Click to add"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ─── QB Modal ─────────────────────────────────────────────────────────────────

const QB_SUGGESTIONS = ["Mark Payer"];

function QBModal({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (customer: string) => void;
}) {
  const [value, setValue] = useState("");

  const handleSave = () => {
    if (value.trim()) {
      onSave(value.trim());
      onOpenChange(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="sm" centered>
        <ModalHeader>
          <ModalTitle>QuickBooks Information</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Customer</label>
          <Combobox value={value} onValueChange={(v: string) => setValue(v)} inputValue={value} onInputChange={(v: string) => setValue(v)}>
            <ComboboxInputGroup>
              <ComboboxInput
                placeholder="Enter QuickBooks customer name"
                showTrigger
              />
            </ComboboxInputGroup>
            <ComboboxContent>
              <ComboboxList>
                <ComboboxEmpty>No customers found</ComboboxEmpty>
                {QB_SUGGESTIONS.filter((s) =>
                  s.toLowerCase().includes(value.toLowerCase())
                ).map((s) => (
                  <ComboboxItem key={s} value={s}>{s}</ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </ModalBody>
        <ModalFooter className="d-flex justify-content-end gap-2">
          <ModalClose
            render={<button className="btn btn-outline-secondary btn-sm" />}
          >
            Cancel
          </ModalClose>
          <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={!value.trim()}>
            Save
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ─── Payer card ───────────────────────────────────────────────────────────────

function PayerCard({
  initials,
  type,
  name,
  email,
  phone,
  showQB,
}: {
  initials: string;
  type: string;
  name: string;
  email?: string;
  phone?: string;
  showQB?: boolean;
}) {
  const [qbConnected, setQbConnected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="d-flex align-items-start gap-3 py-3 border-bottom">
        <div
          className="d-flex align-items-center justify-content-center rounded-circle bg-secondary-subtle text-secondary fw-semibold flex-shrink-0"
          style={{ width: 34, height: 34, fontSize: 12 }}
        >
          {initials}
        </div>
        <div className="flex-grow-1" style={{ fontSize: 13 }}>
          <div className="text-muted mb-1" style={{ fontSize: 11 }}>{type}</div>
          <div className="d-flex align-items-center gap-2">
            <span className="text-primary fw-medium">{name}</span>
            {showQB && (
              <QBIcon connected={qbConnected} onClick={() => !qbConnected && setModalOpen(true)} />
            )}
          </div>
          {email && <div className="text-primary">{email}</div>}
          {phone && <div className="text-body">{phone}</div>}
        </div>
        <button className="btn btn-link btn-sm text-muted p-0">
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </button>
      </div>

      {showQB && (
        <QBModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSave={() => setQbConnected(true)}
        />
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function QuickBooksContactSync() {
  return (
    <div className="d-flex" style={{ minHeight: "100%", fontSize: 14 }}>
      {/* Left sidebar */}
      <div
        className="border-end flex-shrink-0 pt-3 px-1"
        style={{ width: 160, background: "var(--bs-body-bg)" }}
      >
        <SidebarGroup label="VOUCHER">
          <SidebarItem icon={faReceipt} label="Voucher" active />
        </SidebarGroup>
        <SidebarGroup label="ATTACHMENTS">
          <SidebarItem icon={faPaperclip} label="Uploaded" />
          <SidebarItem icon={faFileLines} label="Invoices" />
        </SidebarGroup>
        <SidebarGroup label="NOTES">
          <SidebarItem icon={faThumbTack} label="Pinned" />
          <SidebarItem icon={faFileLines} label="Additional" />
        </SidebarGroup>
        <SidebarGroup label="HISTORY">
          <SidebarItem icon={faClockRotateLeft} label="All History" />
        </SidebarGroup>
      </div>

      {/* Main */}
      <div className="flex-grow-1 overflow-auto">
        {/* Page header */}
        <div className="px-4 pt-3 pb-2 d-flex align-items-start justify-content-between">
          <div>
            <h5 className="fw-bold mb-0" style={{ fontSize: 18 }}>
              Voucher for <span>123 West Madison Street</span>
            </h5>
            <div className="d-flex align-items-center gap-2 mt-1" style={{ fontSize: 12 }}>
              <span className="text-muted">Chicago, IL 60602</span>
              <FontAwesomeIcon icon={faCircle} className="text-warning" style={{ fontSize: 8 }} />
              <span className="text-muted">Evaluating</span>
              <a href="#" className="text-primary text-decoration-none">View Deal</a>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: 12 }}>
            <span>Voucher ID: 301327</span>
            <button className="btn btn-link btn-sm p-0 text-muted">
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </button>
          </div>
        </div>

        {/* Voucher card */}
        <div className="mx-4 mb-4 border rounded" style={{ background: "#fff" }}>
          <div className="px-4 pt-3 pb-0 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold" style={{ fontSize: 16 }}>Voucher</span>
              <span
                className="badge fw-normal"
                style={{ fontSize: 11, background: "#444", color: "#fff", borderRadius: 4 }}
              >
                Draft
              </span>
            </div>
            <span className="text-muted" style={{ fontSize: 12 }}>Deal Type: Sale</span>
          </div>

          <div className="mt-2">
            <StepIndicator />
          </div>

          <div className="px-4 pt-4 pb-2 d-flex align-items-end justify-content-between">
            <div>
              <div className="text-muted mb-1" style={{ fontSize: 12 }}>Step 4</div>
              <h5 className="fw-bold mb-0" style={{ fontSize: 20 }}>Billing</h5>
            </div>
            <button className="btn btn-primary px-4">Save</button>
          </div>

          {/* Two-column body */}
          <div className="px-4 pt-2 pb-4 row g-4">
            {/* Gross Commission */}
            <div className="col-12 col-xl-6">
              <div className="border rounded p-4">
                <h6 className="fw-semibold mb-4" style={{ fontSize: 15 }}>Gross Commission</h6>
                <div className="mb-3">
                  <label className="form-label" style={{ fontSize: 12, fontWeight: 500 }}>Transaction Value (TV)</label>
                  <div className="form-control text-end text-body" style={{ fontSize: 13, pointerEvents: "none" }}>$500,000.00</div>
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ fontSize: 12, fontWeight: 500 }}>Gross Commission Percent<span className="text-danger">*</span></label>
                  <div className="form-control text-end text-body" style={{ fontSize: 13, pointerEvents: "none" }}>5</div>
                </div>
                <div className="mb-0">
                  <label className="form-label" style={{ fontSize: 12, fontWeight: 500 }}>Gross Commission Amount<span className="text-danger">*</span></label>
                  <div className="form-control text-end text-body" style={{ fontSize: 13, pointerEvents: "none" }}>$25,000.00</div>
                </div>
              </div>
            </div>

            {/* Billing / Payers */}
            <div className="col-12 col-xl-6">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-1">
                  <span className="fw-semibold" style={{ fontSize: 15 }}>Billing</span>
                  <span className="text-danger">*</span>
                  <span className="text-muted ms-1" style={{ fontSize: 12 }}>Required for invoicing</span>
                </div>
                <button className="btn btn-link btn-sm text-primary p-0 d-flex align-items-center gap-1" style={{ fontSize: 13 }}>
                  <FontAwesomeIcon icon={faCirclePlus} />
                  Add payer
                </button>
              </div>

              <PayerCard
                initials="MP"
                type="Contact | Payer"
                name="Mark Payer"
                email="mark.payer@buildout.com"
                phone="321.555.5020"
                showQB
              />
              <PayerCard initials="A" type="Company" name="ABC, Corp." />
            </div>
          </div>

          {/* Receivables */}
          <div className="px-4 pb-2">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-semibold mb-0" style={{ fontSize: 15 }}>Receivables</h6>
              <div className="d-flex align-items-center gap-3" style={{ fontSize: 13 }}>
                <button className="btn btn-link btn-sm text-primary p-0">+ Set Sales Tax</button>
                <button className="btn btn-link btn-sm text-primary p-0">+ Add Receivable</button>
                <button className="btn btn-link btn-sm text-muted p-0">Actions ▾</button>
              </div>
            </div>
            <div className="border rounded overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ width: 36 }}><input type="checkbox" className="form-check-input" /></TableHead>
                    <TableHead>Payer Name</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Billing Description</TableHead>
                    <TableHead className="text-end">Receivable Amount</TableHead>
                    <TableHead className="text-end">Credited Amount</TableHead>
                    <TableHead style={{ width: 36 }} />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell><input type="checkbox" className="form-check-input" /></TableCell>
                    <TableCell>Mark Payer (mark.payer@buildout.co…)</TableCell>
                    <TableCell>06/01/2026</TableCell>
                    <TableCell>Full Payment</TableCell>
                    <TableCell className="text-end">$25,000.00</TableCell>
                    <TableCell className="text-end">None</TableCell>
                    <TableCell>
                      <button className="btn btn-link btn-sm text-muted p-0">
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                      </button>
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ background: "var(--bs-light)" }}>
                    <TableCell />
                    <TableCell className="fw-semibold">Sum</TableCell>
                    <TableCell /><TableCell />
                    <TableCell className="text-end fw-semibold">
                      <FontAwesomeIcon icon={faCircleInfo} className="text-muted me-1" style={{ fontSize: 12 }} />
                      $25,000.00
                    </TableCell>
                    <TableCell className="text-end fw-semibold">$0.00</TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Payables */}
          <div className="px-4 py-4">
            <h6 className="fw-semibold mb-3" style={{ fontSize: 15 }}>Payables</h6>
            <div className="border rounded d-flex align-items-center justify-content-center py-3" style={{ fontSize: 13, background: "var(--bs-light)" }}>
              <span className="text-muted">Payables will be automatically created when deposits are applied to this voucher.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
