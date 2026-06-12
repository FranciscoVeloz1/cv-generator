<!--
  CV TEMPLATE - placeholder-only skeleton.
  Source of truth: resume-data-source/index.json
  Placeholder syntax, selection rules, and writing guidance: resources/cv-guidelines.md
  Do not put real data in this file.
-->

# {{profile.fullName}}

{{profile.headline}}

{{profile.location}} | {{profile.phone}} | {{profile.email}} | {{socialNetworks[platform=LinkedIn].link}} | {{socialNetworks[platform=GitHub].link}} | {{profile.website}}

---

## Professional Summary

{{summary.long}}

## Technical Skills

- **Languages:** {{skills[category=languages].name, joined}}
- **Frontend:** {{skills[category=frontend].name, joined}}
- **Backend:** {{skills[category=backend].name, joined}}
- **Data & AI:** {{skills[category=dataAndAI].name, joined}}
- **DevOps & Cloud:** {{skills[category=devopsAndCloud].name, joined}}
- **Databases:** {{skills[category=databases].name, joined}}
- **Other:** {{skills[category=other].name, joined}}

## Work Experience

<!-- Repeat this block for each selected workExperience entry, most recent first -->

### {{workExperience[].position}}

**{{workExperience[].company}}** | {{workExperience[].employmentType?}} | {{workExperience[].location}} | {{workExperience[].duration}}

- {{workExperience[].responsibilities[]}}

## Selected Projects

<!-- Repeat this block for 3-5 selected projects entries -->

### {{projects[].name}}

**Technologies:** {{projects[].skills -> skills.name, joined}}

{{projects[].description}} ({{projects[].repo}})

## Education

<!-- Repeat this block for each education entry -->

### {{education[].degree}}

**{{education[].institution}}** | {{education[].location}} | {{education[].duration}}

## Certifications

<!-- Repeat for each selected certifications entry, most recent first -->

- **{{certifications[].name}}** | {{certifications[].issuer}} | {{certifications[].date}}

## Achievements

<!-- Repeat for each selected achievements entry -->

- **{{achievements[].title}}** ({{achievements[].date}}) — {{achievements[].description[0]}}

## Languages

<!-- Repeat for each languages entry -->

- **{{languages[].language}}:** {{languages[].proficiency}}
