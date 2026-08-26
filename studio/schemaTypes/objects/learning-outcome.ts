import { defineField, defineType } from "sanity";
import {
  ComponentIcon,
  CodeIcon,
  DashboardIcon,
  DatabaseIcon,
  EarthGlobeIcon,
  LockIcon,
  ProjectsIcon,
  RocketIcon,
  SparklesIcon,
  StackIcon,
  TerminalIcon,
  VideoIcon,
} from "@sanity/icons";
import type { ComponentType } from "react";

const ICON_COMPONENTS: Record<string, ComponentType> = {
  layers: StackIcon,
  database: DatabaseIcon,
  gauge: DashboardIcon,
  cloud: EarthGlobeIcon,
  code: CodeIcon,
  shield: LockIcon,
  sparkles: SparklesIcon,
  workflow: ProjectsIcon,
  puzzle: ComponentIcon,
  rocket: RocketIcon,
  terminal: TerminalIcon,
  video: VideoIcon,
};

const ICON_OPTIONS = Object.keys(ICON_COMPONENTS) as Array<
  keyof typeof ICON_COMPONENTS
>;

export const learningOutcome = defineType({
  name: "learningOutcome",
  title: "Learning Outcome",
  type: "object",
  icon: SparklesIcon,
  fields: [
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: { list: [...ICON_OPTIONS] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "icon", icon: "icon" },
    prepare({ title, subtitle, icon }) {
      return {
        title,
        subtitle,
        media: ICON_COMPONENTS[icon as string] ?? SparklesIcon,
      };
    },
  },
});
