import {
  BarChart2,
  Bell,
  Bookmark,
  Clock,
  Eye,
  FileText,
  Grid3x3,
  Play,
  Search,
  ShieldCheck,
  Target,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { CourseCard } from "@/components/ui/CourseCard";
import { LessonCard } from "@/components/ui/LessonCard";
import { Navigation } from "@/components/ui/Navigation";
import { Pagination } from "@/components/ui/Pagination";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ResourceCard } from "@/components/ui/ResourceCard";
import { SearchInput, TextInput } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { StatusIndicator } from "@/components/ui/StatusIndicator";

const primaryColors = [
  { name: "Primary 500", hex: "#F97316", token: "primary-500" },
  { name: "Primary 400", hex: "#FB923C", token: "primary-400" },
  { name: "Primary 300", hex: "#FDBA74", token: "primary-300" },
  { name: "Primary 200", hex: "#FED7AA", token: "primary-200" },
  { name: "Primary 100", hex: "#FFEEE5", token: "primary-100" },
];

const neutralColors = [
  { name: "Neutral 900", hex: "#0F172A", token: "neutral-900" },
  { name: "Neutral 700", hex: "#334155", token: "neutral-700" },
  { name: "Neutral 500", hex: "#64748B", token: "neutral-500" },
  { name: "Neutral 300", hex: "#CBD5E1", token: "neutral-300" },
  { name: "Neutral 200", hex: "#E2E8F0", token: "neutral-200" },
  { name: "Neutral 100", hex: "#F1F5F9", token: "neutral-100" },
  { name: "Neutral 50", hex: "#FAFAFC", token: "neutral-50" },
  { name: "White", hex: "#FFFFFF", token: "white" },
];

const typeScale = [
  { style: "Display 1", font: "Playfair Display", size: "48 / 56", weight: "Bold", use: "Page titles" },
  { style: "Display 2", font: "Playfair Display", size: "36 / 44", weight: "Bold", use: "Section titles" },
  { style: "Heading 1", font: "Inter", size: "28 / 36", weight: "Semi Bold", use: "Card titles" },
  { style: "Heading 2", font: "Inter", size: "22 / 30", weight: "Semi Bold", use: "Sub section" },
  { style: "Heading 3", font: "Inter", size: "18 / 26", weight: "Medium", use: "Small titles" },
  { style: "Body Large", font: "Inter", size: "16 / 24", weight: "Regular", use: "Body copy" },
  { style: "Body", font: "Inter", size: "14 / 20", weight: "Regular", use: "Supporting text" },
  { style: "Small", font: "Inter", size: "12 / 16", weight: "Regular", use: "Captions, meta" },
];

const spacingScale = [4, 8, 12, 16, 24, 32, 40, 48, 64];
const radiusScale = [
  { label: "4px (xs)", className: "rounded-xs" },
  { label: "8px (sm)", className: "rounded-sm" },
  { label: "12px (md)", className: "rounded-md" },
  { label: "16px (lg)", className: "rounded-lg" },
  { label: "24px (xl)", className: "rounded-xl" },
  { label: "Full (circle)", className: "rounded-full" },
];
const shadowScale = [
  { label: "Sm", className: "shadow-sm", desc: "0 1px 2px 0" },
  { label: "Md", className: "shadow-md", desc: "0 4px 12px -2px" },
  { label: "Lg", className: "shadow-lg", desc: "0 12px 24px -4px" },
  { label: "Xl", className: "shadow-xl", desc: "0 20px 40px -8px" },
];

const outlineIcons = [Bell, Search, Play, FileText, Bookmark, BarChart2, Clock, User];

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-neutral-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-widest text-primary-500">
        {number} &nbsp; {title}
      </h2>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="min-h-full bg-neutral-50 pb-24">
      <Navigation
        links={[
          { label: "Courses", href: "#", active: true },
          { label: "My Learning", href: "#" },
        ]}
      />

      <div className="mx-auto max-w-6xl space-y-6 px-6 py-10">
        <header>
          <h1 className="font-display text-5xl font-bold text-neutral-900">
            Design System
          </h1>
          <p className="mt-3 max-w-xl font-sans text-base text-neutral-500">
            A unified design language for Vertex learning platform. Clean,
            modern and focused on clarity, consistency and intuitive learning
            experiences.
          </p>
        </header>

        {/* 01 Colors */}
        <Section number="01" title="Colors">
          <p className="mb-3 font-sans text-sm font-medium text-neutral-700">
            Primary
          </p>
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {primaryColors.map((color) => (
              <div key={color.token}>
                <div
                  className="h-20 rounded-md"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="mt-2 font-sans text-sm font-medium text-neutral-900">
                  {color.name}
                </p>
                <p className="font-sans text-xs text-neutral-500">
                  {color.hex}
                </p>
              </div>
            ))}
          </div>
          <p className="mb-3 font-sans text-sm font-medium text-neutral-700">
            Neutral
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {neutralColors.map((color) => (
              <div key={color.token}>
                <div
                  className="h-20 rounded-md border border-neutral-100"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="mt-2 font-sans text-sm font-medium text-neutral-900">
                  {color.name}
                </p>
                <p className="font-sans text-xs text-neutral-500">
                  {color.hex}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 02 Typography */}
          <Section number="02" title="Typography">
            <div className="mb-6">
              <p className="font-display text-4xl font-bold text-neutral-900">
                Ag
              </p>
              <p className="mt-1 font-sans text-sm font-medium text-neutral-900">
                Playfair Display
              </p>
              <p className="font-sans text-xs text-neutral-500">
                Elegant · Readable · Timeless
              </p>
            </div>
            <div>
              <p className="font-sans text-4xl font-bold text-neutral-900">
                Ag
              </p>
              <p className="mt-1 font-sans text-sm font-medium text-neutral-900">
                Inter
              </p>
              <p className="font-sans text-xs text-neutral-500">
                Clean · Modern · Highly legible
              </p>
            </div>
          </Section>

          {/* 03 Type Scale */}
          <Section number="03" title="Type Scale">
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="text-left text-xs text-neutral-500">
                  <th className="pb-2 font-medium">Style</th>
                  <th className="pb-2 font-medium">Size / LH</th>
                  <th className="pb-2 font-medium">Use</th>
                </tr>
              </thead>
              <tbody>
                {typeScale.map((row) => (
                  <tr key={row.style} className="border-t border-neutral-100">
                    <td className="py-2 font-medium text-neutral-900">
                      {row.style}
                    </td>
                    <td className="py-2 text-neutral-500">{row.size}</td>
                    <td className="py-2 text-neutral-500">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 04 Spacing */}
          <Section number="04" title="Spacing System">
            <p className="mb-4 font-sans text-xs text-neutral-500">
              Base unit: 4px
            </p>
            <div className="flex flex-wrap items-end gap-4">
              {spacingScale.map((size) => (
                <div key={size} className="text-center">
                  <div
                    className="rounded-sm bg-primary-200"
                    style={{ width: size, height: size }}
                  />
                  <p className="mt-2 font-sans text-xs text-neutral-500">
                    {size}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* 05 Radius & Shadows */}
          <Section number="05" title="Radius & Shadows">
            <p className="mb-3 font-sans text-sm font-medium text-neutral-700">
              Radius
            </p>
            <div className="mb-6 flex flex-wrap gap-4">
              {radiusScale.map((radius) => (
                <div key={radius.label} className="text-center">
                  <div
                    className={`size-14 border border-neutral-200 bg-neutral-50 ${radius.className}`}
                  />
                  <p className="mt-2 font-sans text-xs text-neutral-500">
                    {radius.label}
                  </p>
                </div>
              ))}
            </div>
            <p className="mb-3 font-sans text-sm font-medium text-neutral-700">
              Shadows
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {shadowScale.map((shadow) => (
                <div
                  key={shadow.label}
                  className={`rounded-md border border-neutral-100 bg-white p-3 font-sans text-xs ${shadow.className}`}
                >
                  <p className="font-medium text-neutral-900">
                    {shadow.label}
                  </p>
                  <p className="text-neutral-500">{shadow.desc}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* 06 Icons */}
        <Section number="06" title="Icons">
          <div className="flex flex-wrap gap-6">
            {outlineIcons.map((Icon, i) => (
              <Icon key={i} className="size-6 stroke-2 text-neutral-900" />
            ))}
          </div>
          <p className="mt-4 font-sans text-xs text-neutral-500">
            24x24px grid · 2px stroke width · rounded line caps
          </p>
        </Section>

        {/* 07 Buttons */}
        <Section number="07" title="Buttons">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">Get Started</Button>
            <Button variant="secondary">Explore Courses</Button>
            <Button variant="tertiary">View Lesson</Button>
            <Button variant="text">Watch Video</Button>
            <Button variant="primary" disabled>
              Get Started
            </Button>
          </div>
          <p className="mt-4 font-sans text-xs text-neutral-500">
            Height 44px · Radius 12px · Font Inter Medium (14–16px)
          </p>
        </Section>

        {/* 08 Inputs */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Section number="08" title="Inputs">
            <div className="space-y-4">
              <SearchInput placeholder="Search anything…" shortcut="⌘ K" />
              <TextInput placeholder="Text input" />
              <Select defaultValue="relevant">
                <option value="relevant">Most Relevant</option>
                <option value="recent">Most Recent</option>
              </Select>
            </div>
          </Section>

          {/* 09 + 10 Badges & Status */}
          <div className="space-y-6">
            <Section number="09" title="Badges / Tags">
              <div className="flex gap-3">
                <Badge variant="video">Video</Badge>
                <Badge variant="lesson">Lesson</Badge>
                <Badge variant="popular">Popular</Badge>
              </div>
            </Section>
            <Section number="10" title="Status / Indicators">
              <div className="flex flex-wrap gap-4">
                <StatusIndicator status="in-progress" />
                <StatusIndicator status="completed" />
                <StatusIndicator status="now-playing" />
                <StatusIndicator status="locked" />
              </div>
            </Section>
          </div>
        </div>

        {/* 11 Progress Bar */}
        <Section number="11" title="Progress Bar">
          <ProgressBar value={35} showLabel className="max-w-md" />
        </Section>

        {/* 12 Cards */}
        <Section number="12" title="Cards">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CourseCard
              icon="N"
              title="Next.js for Production"
              description="Build scalable, high-performance web applications with Next.js."
              level="Intermediate"
              duration="18h 24m"
              moduleCount={12}
            />
            <LessonCard
              variant="video"
              title="Data Fetching in Server Components"
              description="Learn how to fetch data on the server using async/await and Next.js best practices."
              meta="Lesson 5.1 · 12:45"
              actionLabel="Watch from 12:45"
            />
            <LessonCard
              variant="lesson"
              title="Data Fetching & Caching"
              description="Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance."
              meta="Module 5"
              actionLabel="View lesson"
            />
            <ResourceCard
              title="Caching and Revalidation Guide"
              description="Deep dive into Next.js caching strategies."
              fileMeta="PDF · 1.2 MB"
            />
          </div>
        </Section>

        {/* 13 Navigation */}
        <Section number="13" title="Navigation">
          <div className="space-y-6">
            <Breadcrumbs
              items={[
                { label: "All Courses", href: "#" },
                { label: "Next.js for Production", href: "#" },
                { label: "Data Fetching & Caching" },
              ]}
            />
            <Pagination page={1} totalPages={8} />
          </div>
        </Section>

        {/* 14 Principles */}
        <Section number="14" title="Principles">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3">
              <Eye className="size-5 shrink-0 text-primary-500" />
              <div>
                <p className="font-sans text-sm font-semibold text-neutral-900">
                  Clarity First
                </p>
                <p className="font-sans text-xs text-neutral-500">
                  Every element should communicate clearly.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Grid3x3 className="size-5 shrink-0 text-primary-500" />
              <div>
                <p className="font-sans text-sm font-semibold text-neutral-900">
                  Consistency
                </p>
                <p className="font-sans text-xs text-neutral-500">
                  Use components and patterns consistently across the
                  platform.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="size-5 shrink-0 text-primary-500" />
              <div>
                <p className="font-sans text-sm font-semibold text-neutral-900">
                  Focus & Calm
                </p>
                <p className="font-sans text-xs text-neutral-500">
                  Remove noise and help learners focus on what matters.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="size-5 shrink-0 text-primary-500" />
              <div>
                <p className="font-sans text-sm font-semibold text-neutral-900">
                  Accessible
                </p>
                <p className="font-sans text-xs text-neutral-500">
                  Design with accessibility and inclusivity in mind.
                </p>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
