import Image from "next/image";
import Link from "next/link";

type NavGroup = {
  href?: string;
  label: string;
  links?: Array<{
    description?: string;
    href: string;
    label: string;
  }>;
};

const navGroups: NavGroup[] = [
  {
    label: "Product",
    links: [
      {
        href: "/tools",
        label: "Platform vision",
        description: "What this hub can become for client operations.",
      },
      {
        href: "/clients",
        label: "Client workspace",
        description: "How intake, delivery, and billing connect.",
      },
      {
        href: "/library",
        label: "Shared library",
        description: "Invoices, quotes, and brand assets already copied in.",
      },
    ],
  },
  { href: "/library", label: "Pricing" },
  { href: "/tools", label: "How it works" },
  { href: "/clients", label: "Samples" },
  {
    label: "Company",
    links: [
      { href: "/", label: "Overview" },
      { href: "/clients", label: "Partner support" },
      { href: "/tools", label: "Roadmap" },
    ],
  },
  {
    label: "Resources",
    links: [
      { href: "/library", label: "Quotes" },
      { href: "/library", label: "Invoices" },
      { href: "/tools", label: "Future tooling" },
    ],
  },
];

function ChevronDown() {
  return (
    <svg
      aria-hidden="true"
      className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MarketingHeader() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center space-x-6">
        <Link href="/" className="flex items-center">
          <div style={{ height: "30px" }}>
            <Image
              src="/logos/lm-logo-tyg.svg"
              alt="LeaseMagnets"
              width={142}
              height={54}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              priority
            />
          </div>
        </Link>

        <nav className="hidden items-center space-x-6 md:flex">
          {navGroups.map((group) =>
            group.links ? (
              <div key={group.label} className="group relative">
                <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  {group.label}
                  <ChevronDown />
                </button>
                <div className="invisible absolute left-0 z-50 mt-2 w-64 rounded-md bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="py-2">
                    {group.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <div className="font-medium">{link.label}</div>
                        {link.description ? (
                          <div className="text-xs text-gray-500">
                            {link.description}
                          </div>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={group.label}
                href={group.href ?? "/"}
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {group.label}
              </Link>
            ),
          )}
        </nav>
      </div>

      <div className="flex items-center space-x-3">
        <Link
          href="/clients"
          className="hidden text-sm font-medium text-gray-700 hover:text-gray-900 sm:inline-flex"
        >
          Login
        </Link>
        <Link
          href="/tools"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white visited:text-white hover:bg-slate-800 hover:text-white"
          style={{ color: "#ffffff" }}
        >
          Get a free demo
        </Link>
      </div>
    </header>
  );
}
