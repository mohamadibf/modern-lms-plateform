import { defineQuery } from "next-sanity";

export const COURSES_LIST_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)] | order(popular desc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage,
    level,
    price,
    popular,
    studentCount,
    "instructor": instructor->{ name, "slug": slug.current },
    "category": category->{ title, "slug": slug.current },
    "moduleCount": count(modules),
    "totalDurationSeconds": math::sum(modules[].lessons[]->duration)
  }
`);

export const COURSE_SLUGS_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)].slug.current
`);

export const COURSE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "course" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage,
    level,
    price,
    popular,
    studentCount,
    learningOutcomes[] {
      _key,
      icon,
      title,
      description
    },
    "instructor": instructor->{ _id, name, "slug": slug.current, photo, expertise, bio },
    "category": category->{ _id, title, "slug": slug.current },
    "totalDurationSeconds": math::sum(modules[].lessons[]->duration),
    modules[] {
      _key,
      title,
      summary,
      "lessonCount": count(lessons),
      "durationSeconds": math::sum(lessons[]->duration),
      lessons[]-> {
        _id,
        title,
        "slug": slug.current,
        duration,
        freePreview
      }
    }
  }
`);

export const LESSON_SLUGS_QUERY = defineQuery(`
  *[_type == "lesson" && defined(slug.current)].slug.current
`);

export const LESSON_BY_SLUG_QUERY = defineQuery(`
  *[_type == "lesson" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    videoUrl,
    thumbnail,
    duration,
    freePreview,
    studentCount,
    notes,
    keyPoints,
    proTip,
    resources[] {
      _key,
      type,
      title,
      description,
      url
    }
  }
`);

export const COURSE_FOR_LESSON_QUERY = defineQuery(`
  *[_type == "course" && references($lessonId)][0] {
    _id,
    title,
    "slug": slug.current,
    level,
    coverImage,
    modules[] {
      _key,
      title,
      "durationSeconds": math::sum(lessons[]->duration),
      lessons[]-> {
        _id,
        title,
        "slug": slug.current,
        duration,
        freePreview
      }
    }
  }
`);

export const INSTRUCTORS_LIST_QUERY = defineQuery(`
  *[_type == "instructor" && defined(slug.current)] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    photo,
    expertise
  }
`);

export const INSTRUCTOR_BY_SLUG_QUERY = defineQuery(`
  *[_type == "instructor" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    photo,
    expertise,
    bio,
    "courses": *[_type == "course" && references(^._id)] {
      _id,
      title,
      "slug": slug.current,
      coverImage,
      level
    }
  }
`);

export const SEARCH_LESSONS_BY_IDS_QUERY = defineQuery(`
  *[_type == "lesson" && _id in $ids] {
    _id,
    title,
    "slug": slug.current,
    duration,
    freePreview,
    keyPoints,
    thumbnail,
    _createdAt,
    "course": *[_type == "course" && references(^._id)][0] {
      title,
      "slug": slug.current,
      coverImage,
      modules[] {
        title,
        lessons[]-> { _id }
      }
    }
  }
`);

export const CATEGORIES_LIST_QUERY = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description
  }
`);
