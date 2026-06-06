import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarFooter,
  NavbarNav,
  NavbarItem,
  NavbarItemLink,
  NavbarItemLinkIcon,
  NavbarItemLinkLabel,
  NavbarToggler,
  NavbarGroup,
  NavbarGroupTrigger,
  NavbarGroupMenu,
  NavbarGroupMenuItem,
} from "@buildoutinc/blueprint-react/ui/Navbar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@buildoutinc/blueprint-react/ui/Popover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiamonds4,
  faHandshake,
  faBullhorn,
  faCalculator,
  faSignal,
  faChevronDown,
  faUser,
  faBriefcase,
  faGrid2,
  faPaintbrushPencil,
  faMagnifyingGlassLocation,
  faCookie,
  faArrowRightFromBracket,
} from "@fortawesome/pro-regular-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import BuildoutLogo from "#/features/assets/buildout-logo";

type NavDropdownItem = { label: string; href: string };
type NavItem =
  | { label: string; icon: IconDefinition; href: string }
  | { label: string; icon: IconDefinition; items: NavDropdownItem[] };

const navItems: NavItem[] = [
  {
    label: "CRM",
    icon: faDiamonds4,
    items: [
      { label: "Properties", href: "/research/properties" },
      { label: "Prospecting", href: "/crm/prospecting" },
      { label: "Tasks", href: "/deals/planner" },
      { label: "Contacts", href: "/backoffice/contacts" },
      { label: "Comps", href: "/research/comps?tab=lease" },
      { label: "Activities", href: "/apex/activities.html" },
    ],
  },
  {
    label: "Deals",
    icon: faHandshake,
    items: [
      { label: "Pipeline", href: "/deals/pipeline" },
      { label: "Broker Earnings", href: "/backoffice/broker_earnings" },
      { label: "Transactions", href: "/deals/transactions" },
    ],
  },
  {
    label: "Showcase",
    icon: faBullhorn,
    items: [
      { label: "Listings", href: "/properties" },
      { label: "Email", href: "/email/messages" },
      { label: "Comps", href: "/comps" },
      { label: "Leads", href: "/leads" },
    ],
  },
  {
    label: "Back Office",
    icon: faCalculator,
    items: [
      { label: "Vouchers", href: "/backoffice/vouchers" },
      { label: "My Receivables", href: "/backoffice/receivables" },
    ],
  },
  { label: "Reports", icon: faSignal, href: "/app/reports" },
];

type UserMenuItem = {
  label: string;
  icon: IconDefinition;
  href?: string;
};

const userMenuItems: UserMenuItem[] = [
  { label: "Profile", icon: faUser },
  { label: "Company", icon: faBriefcase, href: "/app/company" },
  { label: "Grids", icon: faGrid2 },
  { label: "Branding", icon: faPaintbrushPencil },
  { label: "Prospect by Buildout", icon: faMagnifyingGlassLocation },
  { label: "Cookie Settings", icon: faCookie },
  { label: "Logout", icon: faArrowRightFromBracket },
];

function UserMenu() {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button className="btn btn-link p-0 border-0 d-flex align-items-center gap-2 text-white text-decoration-none" />
        }
      >
        <div
          className="d-flex align-items-center justify-content-center rounded-circle bg-secondary-subtle text-secondary fw-semibold flex-shrink-0"
          style={{ width: 32, height: 32, fontSize: 13 }}
        >
          NR
        </div>
        <span className="fw-medium" style={{ fontSize: 14 }}>Nick Rowley</span>
        <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: 11 }} />
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" sideOffset={8}>
        <PopoverBody className="p-1" style={{ minWidth: 220 }}>
          {userMenuItems.map((item) => (
            <a
              key={item.label}
              href={item.href ?? "#"}
              className="d-flex align-items-center gap-3 px-3 py-2 rounded text-body text-decoration-none"
              style={{ fontSize: 14 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bs-light)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "")}
            >
              <FontAwesomeIcon icon={item.icon} style={{ width: 16, color: "var(--bs-secondary)" }} />
              {item.label}
            </a>
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default function AppNavbar() {
  return (
    <Navbar expand="lg">
      <NavbarBrand href="/">
        <BuildoutLogo style={{ height: 32 }} />
      </NavbarBrand>
      <NavbarToggler />
      <NavbarContent>
        <NavbarNav>
          {navItems.map((item) =>
            "items" in item ? (
              <NavbarGroup key={item.label}>
                <NavbarGroupTrigger>
                  <NavbarItemLinkIcon>
                    <FontAwesomeIcon icon={item.icon} />
                  </NavbarItemLinkIcon>
                  <NavbarItemLinkLabel>{item.label}</NavbarItemLinkLabel>
                </NavbarGroupTrigger>
                <NavbarGroupMenu>
                  {item.items.map((sub) => (
                    <NavbarGroupMenuItem key={sub.href} render={<a href={sub.href} />}>
                      {sub.label}
                    </NavbarGroupMenuItem>
                  ))}
                </NavbarGroupMenu>
              </NavbarGroup>
            ) : (
              <NavbarItem key={item.label}>
                <NavbarItemLink href={item.href}>
                  <NavbarItemLinkIcon>
                    <FontAwesomeIcon icon={item.icon} />
                  </NavbarItemLinkIcon>
                  <NavbarItemLinkLabel>{item.label}</NavbarItemLinkLabel>
                </NavbarItemLink>
              </NavbarItem>
            ),
          )}
        </NavbarNav>
      </NavbarContent>
      <NavbarFooter className="d-flex align-items-center gap-3">
        <UserMenu />
      </NavbarFooter>
    </Navbar>
  );
}
