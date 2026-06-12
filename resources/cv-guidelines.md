# CV Generation Guidelines

How to generate a tailored, ATS-optimized resume from `resources/template-cv.md` using `resume-data-source/index.json` as the single source of truth.

## Workflow

1. Read the target role or job description to define the positioning.
2. Fill `template-cv.md` placeholders with data from `index.json`, applying the selection rules below.
3. Save the result as `cv-md-files/<firstname>-<lastname>-<target-role>.md` (e.g. `jane-doe-senior-fullstack.md`).
4. Run `npm run convert` to produce the PDF in `results/`.

---

## Placeholder Syntax

| Syntax | Meaning |
| --- | --- |
| `{{path.to.field}}` | Single value from `index.json` |
| `{{array[].field}}` | Repeated block: render once per selected array entry |
| `{{array[key=value].field}}` | Entries filtered by a field value |
| `{{..., joined}}` | Join the resulting values with `, ` on one line |
| `{{field?}}` | Optional: omit the value *and its surrounding separator* when empty or not relevant |
| `{{a -> b.field}}` | Resolve IDs in `a` against collection `b` (e.g. skill IDs to skill names) |
| `{{array[].field[0]}}` | First element of a nested array |

## Placeholder Reference

| Placeholder | `index.json` source | Notes |
| --- | --- | --- |
| `{{profile.fullName}}` | `profile.fullName` | Document H1, name only |
| `{{profile.headline}}` | `profile.headline` | Adjust to match target positioning |
| `{{profile.location}}` | `profile.location` | |
| `{{profile.phone}}` | `profile.phone` | |
| `{{profile.email}}` | `profile.email` | May be a `mailto:` markdown link with the address as visible text |
| `{{profile.website}}` | `profile.website` | Render URLs as visible text (drop `https://www.`); if hyperlinked, the link text must still be the URL |
| `{{socialNetworks[platform=LinkedIn].link}}` | `socialNetworks[]` where `platform` is `LinkedIn` | Same URL rendering rule |
| `{{socialNetworks[platform=GitHub].link}}` | `socialNetworks[]` where `platform` is `GitHub` | Same URL rendering rule |
| `{{summary.long}}` | `summary.long` | Rewrite to fit the target role; `summary.short` is for compact variants |
| `{{skills[category=X].name, joined}}` | `skills[]` grouped by `category` | Categories: `languages`, `frontend`, `backend`, `dataAndAI`, `devopsAndCloud`, `databases`, `other` |
| `{{workExperience[].position}}` | `workExperience[].position` | |
| `{{workExperience[].company}}` | `workExperience[].company` | |
| `{{workExperience[].employmentType?}}` | `workExperience[].employmentType` | Include only for `Contract` or `Freelance`; omit `Full-time` and its `\|` separator |
| `{{workExperience[].location}}` | `workExperience[].location` | |
| `{{workExperience[].duration}}` | `workExperience[].duration` | Already formatted `Month Year - Month Year` or `Month Year - Present` |
| `{{workExperience[].responsibilities[]}}` | `workExperience[].responsibilities` | One bullet per item; select and reorder per target role |
| `{{projects[].name}}` | `projects[].name` | |
| `{{projects[].skills -> skills.name, joined}}` | `projects[].skills` IDs resolved against top-level `skills[].id` | |
| `{{projects[].description}}` | `projects[].description` | |
| `{{projects[].repo}}` | `projects[].repo` | Visible-URL rendering rule applies |
| `{{education[].degree}}` | `education[].degree` | |
| `{{education[].institution}}` | `education[].institution` | |
| `{{education[].location}}` | `education[].location` | |
| `{{education[].duration}}` | `education[].duration` | |
| `{{certifications[].name}}` | `certifications[].name` | |
| `{{certifications[].issuer}}` | `certifications[].issuer` | |
| `{{certifications[].date}}` | `certifications[].date` | |
| `{{achievements[].title}}` | `achievements[].title` | |
| `{{achievements[].date}}` | `achievements[].date` | |
| `{{achievements[].description[0]}}` | First item of `achievements[].description` | One line max; merge items only if it stays short |
| `{{languages[].language}}` | `languages[].language` | |
| `{{languages[].proficiency}}` | `languages[].proficiency` | |

Never use `profile.profilePhoto`, `logo`, `image`, or `video` fields in the resume: images break ATS parsing.

---

## Positioning

Choose ONE dominant professional identity per generated resume (e.g. AI Engineer, Senior Full-Stack Engineer, Data Engineer, DevOps Engineer, Tech Lead). Every section must support that positioning instead of competing with it:

- Headline and summary state it explicitly.
- Skills relevant to it come first within each category; drop irrelevant categories entirely.
- Experience bullets that prove it come first within each job.
- Projects, certifications, and achievements that do not support it are cut.

## Selection Rules

- **Length:** 1 page for junior/mid-level targets, 2 pages maximum for senior/lead.
- **Work experience:** include all relevant roles, most recent first. For older or less relevant roles, trim to 2-3 bullets or drop them. Non-software roles are optional; keep them only when they support the narrative (e.g. domain expertise) and compress to 1-2 bullets.
- **Projects:** 3-5 maximum. Prioritize technical complexity, real-world impact, and unique engineering challenges (AI, cloud, systems, compilers, robotics, scalable architecture).
- **Certifications:** include only those that are relevant to the target role, industry-recognized, and technically meaningful. Skip beginner-level courses, outdated content, and long lists that dilute stronger experience. Omit certification descriptions in the resume; name, issuer, and date are enough.
- **Achievements:** keep concise and high-impact; drop the section if nothing supports the positioning.
- **Empty sections:** remove a section heading entirely rather than leaving it empty.

## Writing Quality

Use quantifiable metrics wherever the data provides them — recruiters remember measurable impact:

- "Reduced processing time by 70%"
- "Improved deployment reliability across 12 services"
- "Processed millions of records through custom pipelines"

Bullet formula: **action verb + what you built + technologies + measurable outcome or business purpose**.

- Strong: "Automated order-intake workflows with Node.js and React, cutting daily manual processing time by 70%"
- Weak: "Responsible for developing innovative solutions using cutting-edge technologies"

Avoid generic AI-sounding language:

- "innovative solutions", "robust systems", "cutting-edge technologies", "dynamic professional", "results-driven", "passionate about technology"

Prefer specific technologies, concrete outcomes, measurable impact, and technical implementations. Start every bullet with a strong past-tense verb (present tense for the current role): Led, Built, Designed, Automated, Reduced, Architected, Delivered, Integrated, Mentored. Do not start bullets with "Responsible for" or "Helped with".

## ATS Optimization

Structure (already baked into the template — do not change it):

- Single H1 for the name; H2 for sections; H3 for entries. Standard section names (Professional Summary, Technical Skills, Work Experience, Education...) that ATS parsers recognize.
- No tables, no images, no multi-column layouts, no text boxes, no headers/footers.
- Consistent date format: `Month Year - Month Year` or `Month Year - Present`.
- Contact info as plain text on one line directly under the name.
- URLs always visible as text, never hidden behind link labels like "LinkedIn" or "Portfolio".

Keywords:

- Mirror the exact terminology of the job description where truthful (e.g. "React.js" vs "React", "CI/CD", "REST APIs").
- Keywords must appear in the Technical Skills section AND inside experience bullets — ATS ranks contextual usage higher than bare lists.
- Do not bury technologies inside long paragraphs only; do not keyword-stuff skills you cannot defend in an interview.
- Spell out acronyms once when uncommon (e.g. "software composition analysis (SCA)").

Output:

- File name: `<firstname>-<lastname>-<target-role>.md`, lowercase, hyphen-separated.
- Verify the generated markdown renders to 1-2 pages via `npm run convert` before delivering.

## Resume Principles Checklist

A finished resume should communicate:

1. Technical depth
2. Business impact
3. Leadership ability
4. Scalability experience
5. Production experience
6. Clear specialization
7. Measurable outcomes
