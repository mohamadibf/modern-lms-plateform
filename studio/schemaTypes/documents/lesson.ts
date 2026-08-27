import { defineArrayMember, defineField, defineType } from "sanity";
import { PlayIcon } from "@sanity/icons";

const ALLOWED_VIDEO_HOSTS = [
  "youtube.com",
  "youtu.be",
  "vimeo.com",
  "mediadelivery.net",
  "b-cdn.net",
];

function isAllowedVideoHost(url: string) {
  try {
    const { hostname } = new URL(url);
    return ALLOWED_VIDEO_HOSTS.some(
      (host) => hostname === host || hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

export const lesson = defineType({
  name: "lesson",
  title: "Lesson",
  type: "document",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description: "YouTube, Vimeo, or Bunny Stream embed URL only.",
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ["https"] })
          .custom((value) => {
            if (!value) return true;
            return (
              isAllowedVideoHost(value) ||
              "Must be a YouTube, Vimeo, or Bunny URL"
            );
          }),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "duration",
      title: "Duration (seconds)",
      type: "number",
      description: "Lesson length in seconds. The frontend formats it for display.",
      validation: (rule) => rule.required().positive().integer(),
    }),
    defineField({
      name: "freePreview",
      title: "Free preview",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "studentCount",
      title: "Student count",
      type: "number",
      initialValue: 0,
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: "notes",
      title: "Notes",
      description: "Rendered as the lesson overview.",
      type: "blockContent",
    }),
    defineField({
      name: "keyPoints",
      title: "Key points",
      description: '"In this lesson you will" checklist.',
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "proTip",
      title: "Pro tip",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "resources",
      title: "Resources",
      type: "array",
      of: [defineArrayMember({ type: "resource" })],
    }),
  ],
  preview: {
    select: { title: "title", media: "thumbnail" },
  },
});
