import { defineField, defineType } from "sanity";
import {
  DocumentIcon,
  DocumentTextIcon,
  DownloadIcon,
  GithubIcon,
  BookIcon,
  LinkIcon,
} from "@sanity/icons";
import type { ComponentType } from "react";

const TYPE_ICON_COMPONENTS: Record<string, ComponentType> = {
  documentation: DocumentTextIcon,
  guide: BookIcon,
  repository: GithubIcon,
  article: DocumentIcon,
  download: DownloadIcon,
  link: LinkIcon,
};

export const resource = defineType({
  name: "resource",
  title: "Resource",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Documentation", value: "documentation" },
          { title: "Guide", value: "guide" },
          { title: "Repository", value: "repository" },
          { title: "Article", value: "article" },
          { title: "Download", value: "download" },
          { title: "Link", value: "link" },
        ],
      },
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
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["https"] }),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "type", type: "type" },
    prepare({ title, subtitle, type }) {
      return {
        title,
        subtitle,
        media: TYPE_ICON_COMPONENTS[type as string] ?? LinkIcon,
      };
    },
  },
});
